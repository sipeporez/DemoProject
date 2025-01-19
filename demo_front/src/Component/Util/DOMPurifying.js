import DOMPurify from 'dompurify'

const DOMPurifying = (dirty) => {
    const config = {
        ALLOWED_TAGS: [
            'h1','h2','h3','h4','h5','h6',
            'span', 'b', 'i', 'u', 'em', 'strong', 'li', 'ol', 's', 
            'a', 'p', 'br', 'img', 'iframe', 'blockquote', 'div' ], // 허용할 태그
        ALLOWED_ATTR: ['href','data-list', 'src', 'alt', 'style', 'rel', 'target', 'title', 'width', 'height', 'allow', 'referrerpolicy',
             'frameborder', 'allowfullscreen', 'class', 'spellcheck'], // 허용할 속성
        ALLOWED_IFRAMES: ['youtube.com', 'youtu.be'] // youtube만 iframe 허용
    }
    return DOMPurify.sanitize(dirty, config)
}

export default DOMPurifying