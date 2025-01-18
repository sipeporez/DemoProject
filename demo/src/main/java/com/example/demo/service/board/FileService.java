package com.example.demo.service.board;

import com.example.demo.domain.FileStatus;
import com.example.demo.domain.dao.FileDAO;
import com.example.demo.domain.dao.member.MemberDAO;
import com.example.demo.domain.dto.board.FileIdxDTO;
import com.example.demo.domain.dto.board.FileListDTO;
import com.example.demo.exception.FileUploadException;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.FileRepository;
import com.example.demo.service.validator.member.MemberValidator;
import com.example.demo.tools.ImageCompression;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@EnableScheduling
public class FileService {
    private final FileRepository fr;
    private final BoardRepository br;
    private final MemberValidator memVal;
    private final ImageCompression ienc;

    // 파일 경로
    @Value("${file.dir}")
    private String filePath;
    @Value("${file.comp.dir}")
    private String compressFilePath;

    // 게시글 번호로 업로드 된 파일 이름과 크기 조회
    public List<Map<String, Object>> getFileListFromBoard(Integer boardIdx) {
        List<Map<String, Object>> list = new ArrayList<>();
        // 삭제되지 않은 파일만 들고오기
        for (FileListDTO f : fr.getFileListByBoardIdx(boardIdx)) {
            if (f.getFileStatus() != FileStatus.DELETED) {
                Map<String, Object> map = new HashMap<>();
                map.put("originalName", f.getOriginalName() + "." + f.getFileExtension());
                map.put("fileSize", f.getFileSize());
                map.put("storedName", f.getStoredName() + ".webp");

                list.add(map);
            }
        }
        return list;
    }

    // 업로드 기준 하루가 지난 경우 파일 삭제 (임시파일 제거, 하드 딜리트)
    // 스케쥴러 사용 - 1시간 간격
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void removeTempFiles() {
        List<Object[]> list = fr.getTempFileStoredName();
        for (Object[] row : list) {
            String storedName = (String) row[0];
            String fileExtension = (String) row[1];
            File file = new File(filePath
                    + storedName.replace("_comp", "")
                    + "." + fileExtension);
            if (file.exists()) {
                try {
                    Files.delete(file.toPath());  // 파일 삭제
                    log.info("Deleted file: {}{}", filePath, storedName);
                    fr.removeTempFileList();
                } catch (IOException e) {
                    log.error(e.getMessage());
                }
            }
            File compFile = new File(compressFilePath
                    + storedName + ".webp");
            if (compFile.exists()) {
                try {
                    Files.delete(compFile.toPath());  // 파일 삭제
                    log.info("Deleted Comp file: {}{}", compressFilePath, storedName);
                } catch (IOException e) {
                    log.error(e.getMessage());
                }
            }
        }
    }

    // 파일 업로드시 글 번호 DB에 업데이트
    @Transactional
    public int fileUpdate(FileIdxDTO dto) {
        int records = 0;
        for (String name : dto.getFileList()) {
            records += fr.updateBoardIdxByStoredName(dto.getBoardIdx(), name.substring(0, name.lastIndexOf(".")));
            br.updateHasImageByBoardIdx(dto.getBoardIdx());
        }
        return records;
    }

    // 파일 다운로드 메서드
    // record를 이용하여 원본 파일명(String)과 file을 묶어서 컨트롤러에 전달
    public record FileDownloadWithName(FileSystemResource file, String originalName, String mimeType) {
    }

    public FileDownloadWithName downloadBoardFile(String fileName, String download) throws IOException {
        // 압축 파일 여부 확인
        boolean isCompressed = fileName.endsWith("_comp.webp");
        // 다운로드 요청인 경우 - 항상 원본 파일 제공
        // 로그인 확인
        if ("true".equals(download) && isCompressed) {
           return getOriginalFile(fileName);
        }
        // 압축 파일 요청인 경우
        if (isCompressed) {
            File file = new File(compressFilePath + fileName);
            String mimeType = Files.probeContentType(file.toPath());
            return new FileDownloadWithName(new FileSystemResource(file), "image.webp", mimeType);
        }
        // 압축 안된 파일 요청인 경우
        return getOriginalFile(fileName);
    }

    // 원본 파일 다운로드 메서드
    private FileDownloadWithName getOriginalFile(String fileName) throws IOException {
        String fileNameForDB = fileName.substring(0, fileName.lastIndexOf("."));
        try {
            FileListDTO dto = fr.getOriginalNameWithExtensionByStoredName(fileNameForDB);
            File dFile = new File(filePath
                    + fileNameForDB.replace("_comp", "")
                    + "." + dto.getFileExtension());
            String dMimeType = Files.probeContentType(dFile.toPath());
            String originalName = URLEncoder.encode(
                    dto.getOriginalName() + "." + dto.getFileExtension(),
                    StandardCharsets.UTF_8
            ).replaceAll("\\+", "%20");

            return new FileDownloadWithName(new FileSystemResource(dFile), originalName, dMimeType);
        } catch (Exception e) {
            throw new FileNotFoundException();
        }
    }

    // 업로드된 파일 정보를 분석하여 DB에 저장하는 메서드
    public void fileToDB(MemberDAO member, String storedName, MultipartFile file) {
        // 이미 fileUpload메서드에서 null체크 했으므로 substring 예외처리 할 필요 없음
        String origin = file.getOriginalFilename();
        String originalName = origin.substring(0, origin.lastIndexOf("."));
        Long fileSize = file.getSize();
        String fileExtension = origin.substring(origin.toLowerCase().lastIndexOf(".") + 1);
        FileStatus fileStatus = FileStatus.ACTIVATE;

        fr.save(FileDAO.builder()
                .member(member)
                .originalName(originalName)
                .storedName(
                        (fileExtension.equals("gif") || fileExtension.equals("webp") ?
                                storedName.substring(0, storedName.lastIndexOf(".")) :
                                storedName.substring(0, storedName.lastIndexOf(".")) + "_comp"))
                .fileExtension(fileExtension)
                .fileSize(fileSize)
                .fileStatus(fileStatus)
                .build());
    }

    // 파일 확장자 검사 메서드
    // 이미지 파일만 가능하도록
    public boolean checkFileExtension(String fileName) {
        List<String> ALLOWED_EXTENSIONS = Arrays.asList("bmp", "jpg", "jpeg", "png", "gif", "webp");
        if (fileName != null && !fileName.isBlank()) {
            String ext = fileName.substring(fileName.lastIndexOf(".") + 1);
            return ALLOWED_EXTENSIONS.contains(ext.toLowerCase());
        }
        return false;
    }

    // 파일 업로드 메인 메서드
    public List<String> fileUpload(MultipartHttpServletRequest request) {
        // 로그인한 유저만 업로드 가능하게끔
        MemberDAO member = memVal.findMemberIDFromToken();

        List<String> storedFileList = new ArrayList<>();

        Iterator<String> files = request.getFileNames(); // 여러 파일이 업로드 된 경우 각 파일 이름에 대해 파일 목록 순회
        while (files.hasNext()) {
            String originalName = files.next();
            MultipartFile file = request.getFile(originalName);
            // 파일이 존재하면 DB에는 파일 정보 저장, 실제 파일은 설정한 경로로 전송
            // 존재하지 않으면 예외처리
            if (file != null && !file.isEmpty() && checkFileExtension(file.getOriginalFilename())) {
                try {
                    String originName = file.getOriginalFilename();
                    String storedName = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm-ss-"))
                            + UUID.randomUUID()
                            + originName.substring(originName.lastIndexOf("."));
                    // DB 저장
                    fileToDB(member, storedName, file);

                    // 파일 저장
                    String extension = originName.toLowerCase();
                    Path path = Paths.get(filePath, storedName);
                    Files.createDirectories(path.getParent());
                    file.transferTo(path);

                    // 이미지 파일 압축 (gif, webp 제외 -> 너무 느림)
                    String newExtension = null;
                    // gif나 webp은 그대로
                    if (extension.endsWith(".gif") || extension.endsWith(".webp")) {
                        newExtension = extension.substring(extension.lastIndexOf(".") + 1);
                        storedFileList.add(storedName.substring(0, storedName.lastIndexOf(".") + 1) + newExtension);
                    } else {
                        // gif, webp가 아닌 경우 압축
                        ienc.encodeImageFile(path);
                        storedFileList.add(storedName.substring(0, storedName.lastIndexOf(".")) + "_comp.webp");
                    }
                } catch (IOException e) {
                    log.error(e.getMessage());
                    throw new FileUploadException("파일 업로드 오류 : 파일이 존재하지 않거나 업로드에 실패했습니다.");
                }
            } else throw new FileUploadException("파일 업로드 오류 : 이미지 파일(jpg, jpeg, png, gif, webp)만 업로드 할 수 있습니다.");
        }
        return storedFileList;
    }

}
