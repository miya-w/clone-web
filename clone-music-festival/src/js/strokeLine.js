class StrokeLine {
    constructor() {
        this.refresh()
    }

    refresh(){
        const els = document.querySelectorAll('[data-stroke]')

        for(let el of els){
            let parent = el.parentNode
            while(parent){
                if(parent instanceof Element){
                    if(getComputedStyle(parent).display === 'none') return
                }
                parent = parent.parentNode
            }

            const { strokeDirection } = el.dataset
            const direction = strokeDirection || 1
            const dashLength = el.getTotalLength()
            if(direction > 0){
                el.style.setProperty('--svg-dashoffset-from', 0)
                el.style.setProperty('--svg-dashoffset-to', 2 * dashLength)
            }else {
                el.style.setProperty('--svg-dashoffset-from', 2 * dashLength)
                el.style.setProperty('--svg-dashoffset-to', 0)
            }
            el.style.strokeDasharray = dashLength

            el.classList.add('stroke-line')
        }
    }
}
