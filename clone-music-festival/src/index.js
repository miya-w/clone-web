const layout = document.querySelector('.page-layout')

/**
 *  載入動態
 */

const loadFont = () => {
    return new Promise((resolve) => {
        WebFont.load({
            google: {
                families: ['Expletus Sans:500,700,i7', 'Noto Sans TC:500,900&display=swap'],
            },
            active() {
                resolve()
            },
        })
    })
}

const loadImage = () => {
    return new Promise((resolve) => {
        new imagesLoaded('.page-layout', { background: '[data-background]' }, (instance) => {
            resolve()
        })
    })
}

const loading = new LoadingLogo([loadFont(), loadImage()])
// const loading = new LoadingProgress([loadFont(), loadImage()])

/**
 *  主要動態
 */

// const banner = new Parallax()
const banner = new Noise(document.querySelector('.m-banner'))

/**
 *  進場動態
 */

// const textAnimation = new TypingText()
const textAnimation = new BlockText()

/**
 *  離場動態
 */

// const leave = new Wave(document.querySelector('.page-layout__route-transition'))
const leave = new Rect(document.querySelector('.page-layout__route-transition'))

/**
 *  游標動態
 */

const cursor = new Scale(document.querySelector('.page-layout__cursor'))
// const cursor = new Color(document.querySelector('.page-layout__cursor'))

/**
 *  點擊動態
 */

 cursor.addClickEffect(Line)
// cursor.addClickEffect(Pow)

/**
 *  滾動動態
 */

 const scrollEffect = new FadeSide()
// const scrollEffect = new Rotate()
// const scrollEffect = new FadeUp()

/**
 *  持續動態
 */

const strokeLine = new StrokeLine()

/**
 *  設備動態
 */

const keypress = new Keypress(['b', 's'])

/**
 *  顏色
 * '#40587c', '#e2ae4a', '#5a7c40'
 */

const colors = ['#40587c', '#e2ae4a', '#5a7c40']
colors.forEach((color, i) => {
    layout.style.setProperty(`--color-${i + 1}`, color)
})

/**
 *  回饋動態
 */

layout.classList.add('-underline')
// layout.classList.add('-block')

/**
 *  按鈕
 */

layout.classList.add('-button-default')
 // layout.classList.add('-button-elastic')

/**
 *  program
 */

 // layout.classList.add('-program-colorful')
layout.classList.add('-program-primary')

/**
 *  過渡
 */

layout.classList.add('-rotate')
// layout.classList.add('-scale')

/**----------------------------------------------------------------------- */

const innerHeight = mobileInnerHeight()
document
    .querySelector('.page-layout main')
    .style.setProperty('--vh', `${window.innerHeight / innerHeight()}vh`)
window.addEventListener('resize', () => {
    document
        .querySelector('.page-layout main')
        .style.setProperty('--vh', `${window.innerHeight / innerHeight(true)}vh`)
})

loading.on('loadingDone', () => {
    document.body.classList.remove('-loading')
})

const route = new Route()
route.on('beforeRouteChange', async (from, to, next) => {
    banner.stop()
    await leave.startTransition()
    next()
})
route.on('afterRouteChange', (from, to) => {
    if (to === 'index') {
        banner.render()
    }
    scrollEffect.refresh()
    leave.endTransition()
})
document.querySelectorAll('[data-href]').forEach((el) => {
    const { href } = el.dataset
    el.addEventListener('click', route.to.bind(route, href))
})
