# 데모 웹 프로젝트
#### 작성 일자 : 2024-11-19(화)
#### 수정 일자 : 2024-11-19(화)

## 현재 주소 : http://d2x0bexp13nzpb.cloudfront.net/

## 목표
- Cloudflare Turnstile을 활용한 자동화 봇 프로그램 방지
- Spring Data JPA를 이용한 MySQL 연동 CRUD 게시판과 To-DO List
- Spring Security, JWT를 이용한 회원 기반 웹 사이트
- AWS EC2, S3를 이용한 웹사이트 배포
- Flask, Scikit-learn을 이용한 감성분석 AI 모델 연동
- Tailwind CSS를 이용한 모바일-PC 반응형 웹

## 적용 기술
### 1. 백엔드
- **Spring Framework**
  - **Spring Boot**: 백엔드 서버, REST API Controller / Service 구현
  - **Spring Data JPA**: MySQL과의 데이터 연동 및 CRUD 구현
  - **JWT (JSON Web Token)**: 사용자 인증 정보 및 세션 처리
  - **Spring Security**: 사용자 인증 및 인가 기능 구현
  - **Spring Mail**: 회원가입 시 이메일 전송 및 인증 기능 구현

### 2. 프론트엔드
- **HTML, CSS, JavaScript**
  - **Tailwind CSS**: 반응형 디자인, CSS 구현
  - **React**: 동적 웹 프론트엔드 서버 구현
    - **Recoil**: 로그인 상태 관리
    - **Axios**: 백엔드 서버와의 비동기 통신을 위한 데이터 전송 및 처리
    - **React-Router-Dom**: 프론트엔드 라우팅 관리

### 3. 데이터베이스
- **MySQL**: Spring Data JPA를 통한 연동
  - **MySQL 프로시저**: 게시판 관련 삭제 작업 시 삭제 전 내용을 백업하는 프로시저 구현
  - **Index, Explain**: Explain과 Index를 이용한 쿼리문 성능 분석 및 최적화

### 4. 자동화 방지 및 보안
- **Cloudflare Turnstile**: CAPTCHA 대체 자동화 봇 차단

### 5. 웹 호스팅 및 배포
- **AWS EC2**: 백앤드 서버 호스팅을 위한 인스턴스
- **AWS S3**: 빌드된 React 웹의 정적 파일 호스팅 및 배포

### 6. AI 모델
- **Flask**: 감성분석 모델용 REST API 서버 구축
- **Scikit-learn**: 머신러닝 라이브러리, 감성 분석 모델 설계

### 7. 협업 도구 / 기타 기술
- **Git/GitHub**: 버전 관리
- **Postman**: REST API 테스트
- **Notion**: 문서화, 프로젝트 관리
