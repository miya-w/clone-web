class Rect extends Leave {
    constructor(el) {
        super(el)
        if (el instanceof Element) {
            this.path = document.getElementById('rect')
            this.svgPaths = ['M0 300h300v-0H0z', 'M0 0h300v336H0z']
        }
    }
}
