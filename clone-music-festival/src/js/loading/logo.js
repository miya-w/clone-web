class LoadingLogo extends Loading {
    constructor(stacks, options) {
        super(stacks)

        document.getElementById('logo').style.display = 'block'

        this.options = {
            fakeProgress: 80,
            ...options,
            ...this.options,
        }
        this.options.fakeProgress = Math.max(Math.min(this.options.fakeProgress, 100), 0)

        const { fakeProgress, minTime } = this.options
        this.progress = 0
        this.progressEl = document.querySelector('.o-loading__logo-block')

        gsap.to('.o-loading__logo-block span', {
            duration: minTime / 1000,
            ease: 'none',
            translateY: `${100 - fakeProgress}%`,
        })

        this.waitLoading()
    }

    async waitLoading() {
        await super.waitLoading()

        const { fakeProgress, minTime } = this.options

        gsap.to('.o-loading__logo-block span', {
            duration: ((100 - fakeProgress) * (minTime / 1000)) / fakeProgress,
            ease: 'none',
            translateY: 0,
            overwrite: true,
        })
    }
}
