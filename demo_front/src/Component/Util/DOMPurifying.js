import DOMPurify from 'dompurify'

const DOMPurifying = (dirty) => {
    const config = {
        ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'span', 'b', 'i', 'u', 'em', 'strong', 'li', 'ol', 's',
            'a', 'p', 'br', 'img', 'iframe', 'blockquote', 'div'], // 허용할 태그
        ALLOWED_ATTR: ['href', 'data-list', 'src', 'alt', 'style', 'rel', 'target', 'title', 'width', 'height', 'allow', 'referrerpolicy',
            'frameborder', 'allowfullscreen', 'class', 'spellcheck'], // 허용할 속성
        FORBID_TAGS: [
            'script',  // 스크립트 실행 방지
            'style',   // 스타일 주입 방지
            'form',    // 폼 제출 방지
            'input',   // 사용자 입력 방지
            'button',  // 버튼 클릭 이벤트 방지
            'link',    // 외부 리소스 로딩 방지
            'meta',    // 메타 정보 변경 방지
            'base',    // 기본 URL 변경 방지
            'object',  // 외부 객체 삽입 방지
            'embed'    // 외부 컨텐츠 임베딩 방지
        ],
        FORBID_ATTR: [
            'onerror',     // 에러 핸들링 스크립트 방지
            'onload',      // 로드 시 스크립트 실행 방지
            'onclick',     // 클릭 이벤트 방지
            'onmouseover', // 마우스 이벤트 방지
            'onfocus',     // 포커스 이벤트 방지
            'onblur',      // 블러 이벤트 방지
            'onkeyup',     // 키보드 이벤트 방지
            'onkeydown',   // 키보드 이벤트 방지
            'onchange',    // 변경 이벤트 방지
            'formaction',  // 폼 액션 URL 변경 방지
            'href',        // 링크 URL 제한
            'xlink:href',  // SVG 링크 방지
            'data'         // data URL 스키마 방지
        ]
    }
    return DOMPurify.sanitize(dirty, config)
}

export default DOMPurifying