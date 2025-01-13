package com.example.demo.tools;

import com.example.demo.exception.FileUploadException;
import com.sksamuel.scrimage.ImmutableImage;
import com.sksamuel.scrimage.nio.AnimatedGif;
import com.sksamuel.scrimage.nio.AnimatedGifReader;
import com.sksamuel.scrimage.nio.ImageSource;
import com.sksamuel.scrimage.webp.Gif2WebpWriter;
import com.sksamuel.scrimage.webp.WebpWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Component
public class ImageCompression {

    // 인코딩 후 저장할 파일 경로
    @Value("${file.comp.dir}")
    private String compressFilePath;

    // 원본 파일 이름 가져오는 메서드
    public String getOriginalPath(Path path) {
        return path.getFileName().toString().substring(0, path.getFileName().toString().lastIndexOf("."));
    }

    // 이미지 파일 인코딩 메서드
    // scrimage 라이브러리 사용
    public void encodeImageFile(Path filePath) throws IOException {
        Files.createDirectories(Path.of(compressFilePath));
        int quality = 80;
        WebpWriter writer = WebpWriter.DEFAULT;
        try {
            ImmutableImage img = ImmutableImage.loader().fromFile(String.valueOf(filePath));
            if (img.width < 1200) {
                img.output(writer.withQ(quality)
                        .withMultiThread(), new File(compressFilePath + getOriginalPath(filePath) + "_comp.webp"));
            } else img.scaleToWidth(1200)
                    .output(writer.withQ(quality)
                            .withMultiThread(), new File(compressFilePath + getOriginalPath(filePath) + "_comp.webp"));
        } catch (IOException ex) {
            throw new FileUploadException("이미지 압축에 실패했습니다.");
        }
    }

    // Animated webp 구분 메서드
    // webp 헤더 파일에 ANMF가 있는지 확인 (있으면 animated, true 반환)
    public boolean checkAnimatedWebp(File file) throws IOException {
        try(BufferedInputStream is = new BufferedInputStream(new FileInputStream(file))) {
            byte[] header = new byte[4];
            while (is.read(header) == 4) {
                if (header[0] == 'A' &&
                        header[1] == 'N' &&
                        header[2] == 'M' &&
                        header[3] == 'F')
                    return true;
            }
        }
        return false;
    }

    // animated gif 파일 인코딩 메서드
    // scrimage 라이브러리 사용
    // 속도가 너무 느리다.. 대체제 필요
//    public void encodeAnimatedGifFile(Path filePath) throws IOException {
//        Files.createDirectories(Path.of(compressFilePath));
//        int quality = 90;
//        Gif2WebpWriter writer = Gif2WebpWriter.DEFAULT;
//        try {
//            AnimatedGifReader.read(
//                            ImageSource.of(new File(String.valueOf(filePath))))
//                    .output(writer.withQ(quality), new File(compressFilePath + getOriginalPath(filePath) + ".webp"));
//
//        } catch (IOException ex) {
//            throw new FileUploadException("Animation Gif 압축에 실패했습니다.");
//        }
//    }
}
