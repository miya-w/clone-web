gsap.registerPlugin(TextPlugin)

class TypingText {
    constructor() {
        const els = document.querySelectorAll('[data-text]')

        els.forEach((el) => {
            const { textFirst, textDelay, textDuration } = el.dataset
            el.style.display = 'inline'
            const text = el.innerText
            el.innerText = ''

            let cursor = el.parentNode.querySelector('#text-cursor')
            if (!cursor) {
                cursor = document.createElement('span')
                cursor.className = 'text-cursor'
                cursor.innerText = '|'
                el.parentNode.insertBefore(cursor, el.nextSibling)
            }
            if (textFirst !== undefined) {
                cursor.classList.add('-first')
            }

            gsap.to(el, {
                duration: textDuration || 2,
                delay: textDelay || 0,
                text: text,
                ease: 'none',
                onStart() {
                    cursor.classList.add('-start')
                },
                onComplete() {
                    cursor.classList.add('-end')
                },
            })
        })
    }
}
