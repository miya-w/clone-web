class LoadingProgress extends Loading {
    constructor(stacks, options) {
        super(stacks)

        document.getElementById('progress').style.display = 'block'

        this.options = {
            fakeProgress: 80,
            ...options,
            ...this.options,
        }
        this.options.fakeProgress = Math.max(Math.min(this.options.fakeProgress, 100), 0)

        const { fakeProgress, minTime } = this.options
        this.progress = 0
        this.progressEl = document.querySelector('.o-loading__progress span')
        this.progressText = document.querySelector('.o-loading__progress p')

        gsap.to(this, {
            progress: fakeProgress,
            duration: minTime / 1000,
            ease: 'none',
            onUpdate: this.updateProgress.bind(this),
        })

        this.waitLoading()
    }

    updateProgress() {
        this.progressEl.style.setProperty('--progress', `${this.progress / 100}`)
        this.progressText.innerText = `${this.progress}%`
    }

    async waitLoading() {
        await super.waitLoading()

        const { fakeProgress, minTime } = this.options

        gsap.to(this, {
            progress: 100,
            duration: (minTime / 1000) * (1 - fakeProgress / 100),
            ease: 'none',
            overwrite: true,
            onUpdate: this.updateProgress.bind(this),
        })
    }
}