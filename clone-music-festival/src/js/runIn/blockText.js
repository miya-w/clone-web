class BlockText {
    constructor() {
        const els = document.querySelectorAll('[data-text]')

        els.forEach((el, i) => {
            el.classList.add('text-block')
            const params = {
                progress: 0,
                progressBack: 1,
            }
            const { textDelay = 1, textDuration = 1 } = el.dataset
            el.style.setProperty('--progress', `${params.progress}`)
            el.style.setProperty('--progress-back', `${params.progressBack}`)
            el.style.setProperty('--transform-origin', 'left')

            const tl = gsap.timeline()
            tl.to(
                params,
                {
                    duration: textDuration / 2,
                    delay: textDelay,
                    progress: 1,
                    onUpdate() {
                        el.style.setProperty('--progress', `${params.progress}`)
                    },
                    onComplete() {
                        el.style.setProperty('--transform-origin', 'right')
                    },
                },
                'start'
            )
                .to(
                    params,
                    {
                        duration: textDuration / 2,
                        progress: 0,
                        onUpdate() {
                            el.style.setProperty('--progress', `${params.progress}`)
                        },
                    },
                    'end'
                )
                .to(
                    params,
                    {
                        duration: textDuration / 3,
                        progressBack: 0,
                        onUpdate() {
                            el.style.setProperty('--progress-back', `${params.progressBack}`)
                        },
                    },
                    'end+=0.2'
                )
        })
    }
}
