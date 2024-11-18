package com.example.demo.service.member;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender jms;
    private static final String ADDRESS = "sipeporez@gmail.com";

    public void sendEmail(String email, String token) {
        try {
            MimeMessage message = jms.createMimeMessage();
            MimeMessageHelper messageHelper = null;
            messageHelper = new MimeMessageHelper(message, true);
            messageHelper.setFrom(ADDRESS);
            messageHelper.setTo(email);
            messageHelper.setSubject("Seong 이메일 인증 입니다.");

            String html = "<html><body>";
            html += "<p><a href='http://110.13.52.11:3000/verify?key=" + token + "'>해당 링크를 클릭하여 이메일 인증을 완료 해주세요.</a></p>";
            html += "</body></html>";
            messageHelper.setText(html, true);

            jms.send(message);
            log.info("이메일 전송 완료");
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
