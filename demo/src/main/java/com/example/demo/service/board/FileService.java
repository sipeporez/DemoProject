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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
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
public class FileService {
    private final FileRepository fr;
    private final BoardRepository br;
    private final MemberValidator memVal;

    // 파일 경로
    @Value("${file.dir}")
    private String filePath;

    // 게시글 번호로 업로드 된 파일 이름과 크기 조회
    public List<Map<String, Object>> getFileListFromBoard(Integer boardIdx) {
        List<Map<String, Object>> list = new ArrayList<>();
        // 삭제되지 않은 파일만 들고오기
        for (FileListDTO f : fr.getFileListByBoardIdx(boardIdx)) {
            if (f.getFileStatus() != FileStatus.DELETED) {
                Map<String, Object> map = new HashMap<>();
                map.put("originalName", f.getOriginalName());
                map.put("fileSize", f.getFileSize());
                map.put("storedName", f.getStoredName());

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
        List<String> storedFileName = fr.getTempFileStoredName();
        for (String name : storedFileName) {
            File file = new File(filePath + name);
            if (file.exists()) {
                try {
                    Files.delete(file.toPath());  // 파일 삭제
                    log.info("Deleted file: {}{}", filePath, name);
                    fr.removeTempFileList();
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
            records += fr.updateBoardIdxByStoredName(dto.getBoardIdx(), name);
            br.updateHasImageByBoardIdx(dto.getBoardIdx());
        }
        return records;
    }

    // 파일 다운로드
    // record를 이용하여 원본 파일명(String)과 file을 묶어서 컨트롤러에 전달
    public record FileDownloadWithName(FileSystemResource file, String originalName, String mimeType) {
    }

    public FileDownloadWithName downloadBoardFile(String fileName) throws IOException {
        File file = new File(filePath + fileName);
        String mimeType = Files.probeContentType(file.toPath());

        if (file.exists() && file.isFile()) {
            // 다운로드 시 파일명을 DB 조회 후 원본 파일 명으로 변경
            try {
                String originalName =
                        URLEncoder.encode(fr.getOriginalNameByStoredName(fileName), StandardCharsets.UTF_8)
                                .replaceAll("\\+", "%20");
                return new FileDownloadWithName(new FileSystemResource(file), originalName, mimeType);
            } catch (Exception e) {
                log.error(e.getMessage());
            }
        }
        throw new FileNotFoundException();
    }

    // 업로드된 파일 정보를 분석하여 DB에 저장하는 메서드
    public void fileToDB(MemberDAO member, String storedName, MultipartFile file) {
        String originalName = file.getOriginalFilename();
        Long fileSize = file.getSize();
        // 이미 fileUpload메서드에서 null체크 했으므로 substring 예외처리 할 필요 없음
        String fileExtension = originalName.substring(originalName.lastIndexOf(".") + 1);
        FileStatus fileStatus = FileStatus.ACTIVATE;

        fr.save(FileDAO.builder()
                .member(member)
                .originalName(originalName)
                .storedName(storedName)
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
                    fileToDB(member, storedName, file);
                    Path path = Paths.get(filePath, storedName);
                    Files.createDirectories(path.getParent());
                    file.transferTo(path);
                    storedFileList.add(storedName);
                } catch (IOException e) {
                    log.error(e.getMessage());
                    throw new FileUploadException("파일 업로드 오류 : 파일이 존재하지 않거나 업로드에 실패했습니다.");
                }
            } else throw new FileUploadException("파일 업로드 오류 : 이미지 파일(jpg, jpeg, png, gif, webp)만 업로드 할 수 있습니다.");
        }
        return storedFileList;
    }

}
