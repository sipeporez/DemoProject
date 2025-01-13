package com.example.demo.controller.board;

import com.example.demo.domain.dto.board.FileIdxDTO;
import com.example.demo.service.board.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.FileNotFoundException;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class FileController {
    private final FileService fs;

    // 게시글에서 업로드된 파일 리스트 확인
    @GetMapping("/board/{idx}/filelist")
    public ResponseEntity<?> getFileList(@PathVariable("idx") Integer boardIdx) {
        return ResponseEntity.ok(fs.getFileListFromBoard(boardIdx));
    }

    // 파일 다운로드 - 게시판 이미지 표시
    @GetMapping("/board/image/{filename}")
    public ResponseEntity<?> showBoardImage(@PathVariable("filename") String fileName,
                                            @RequestParam(value = "d", required = false) String download)
            throws FileNotFoundException, IOException {

        var fileWithName = fs.downloadBoardFile(fileName);

        FileSystemResource file = fileWithName.file();
        String originalName = fileWithName.originalName();
        String mimeType = fileWithName.mimeType();

        // 쿼리 파라미터가 있으면 attachment / 없으면 inline
        String headerValue = (download != null && download.equals("true")) ? "attachment" : "inline";

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(mimeType))
                .header(HttpHeaders.CONTENT_DISPOSITION, headerValue + "; filename=\"" + originalName + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600") // 1시간 동안 캐시
                .header(HttpHeaders.ETAG, String.valueOf(file.hashCode())) // ETag를 파일의 해시값으로 설정
                .header(HttpHeaders.LAST_MODIFIED, String.valueOf(file.lastModified())) // 마지막 수정 시간
                .body(file);
    }

    // 파일 업로드
    @PostMapping("/board/image/upload")
    public ResponseEntity<?> boardFileUpload(MultipartHttpServletRequest req) {
        return ResponseEntity.ok(fs.fileUpload(req));
    }

    // 업로드된 이미지 파일의 글번호 업데이트
    @PutMapping("/board/image/update")
    public ResponseEntity<?> boardFileUpdate(@RequestBody FileIdxDTO dto) {
        return ResponseEntity.ok(fs.fileUpdate(dto));
    }
}
