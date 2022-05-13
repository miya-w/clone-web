class FadeSide extends Scroll {
    constructor(options) {
        super({
            scrub: null,
            ease: null,
            ...options,
        })

        this.setup()
    }

    setup() {
        this.els.forEach((el) => {
            const { scrollX, scrollOpacity, scrollDelay, scrollDuration, scrollEase } = el.dataset

            const tween = gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    toggleActions: 'restart none none reverse',
                },
                duration: scrollDuration || 0.5,
                delay: scrollDelay,
                ease: scrollEase || 'power1.out',
                translateX: `${scrollX}%`,
                opacity: scrollOpacity,
            })
            this.tweens.push(tween)
        })
    }
}
