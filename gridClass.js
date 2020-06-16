'use strict';
class Grid extends HTMLElement {

    // A getter/setter for a disabled property.
    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(val) {
        // Reflect the value of the disabled property as an HTML attribute.
        if (val) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    get getColumnsMobile() {
        return (this.getAttribute('oh-columns-m') * 1);
    }
    get getColumnsTablet() {
        return (this.getAttribute('oh-columns-tb') * 1);
    }
    get getColumnsDesktop() {
        return (this.getAttribute('oh-columns-d') * 1);
    }
    get getColumnsHd() {
        return (this.getAttribute('oh-columns-w') * 1);
    }
    get getAutoRows() {
        return (this.getAttribute('auto-rows') * 1);
    }
    get getId() {
        return this.getAttribute('id');
    }
    get getMaxColumn() {

        let $sizes = {
            tb: this.getColumnsTablet,
            d: this.getColumnsDesktop,
            w: this.getColumnsHd
        };

        console.log($sizes);

        let $css = '';

        let $size = $sizes[0];
        for (let $i in $sizes) {
            let $size = `@media screen and (min-width: ${this[$i]}){
										{{classes}}
									}`;

            let $classes = '';

            console.log($sizes[$i]);

            for (let $c = 1; $c <= $sizes[$i]; $c++) {
                $classes += `
											.${$i}-width-${$c} {
												grid-column: span ${$c};
											}
											.${$i}-height-${$c} {
												grid-row: span ${$c};
											}
										`;
            }
            $size = $size.replace(/\{\{classes\}\}/g, $classes);
            $css += $size;
        }

        console.log($css);
        return $css;
    }

    connectedCallback() {
        let $css = `
								<style>
									:host {
										display:grid;
										width:100%;
										grid-template-columns: repeat(${this.mobileCols},1fr);
										grid-auto-rows: ${this.autoRows}px;
										grid-gap: 1rem;
										grid-auto-flow: row dense;
									}

									:host, :host * {
										box-sizing: border-box;
									}

									@media screen and (min-width: ${this.tb}){
										:host {
											grid-template-columns: repeat(${this.tabletCols},1fr);
										}
									}
									@media screen and (min-width: ${this.d}){
										:host {
											grid-template-columns: repeat(${this.desktopCols},1fr);
										}
									}
									@media screen and (min-width: ${this.w}){
										:host {
											grid-template-columns: repeat(${this.hdCols},1fr);
										}
									}
								</style>
								`;
        $css = $css.replace(/[\r\t]/g, '');
        $css = $css.replace(/[\n]/g, ' ');

        let shadow = this.attachShadow({
            mode: 'open'
        });
        shadow.innerHTML = `
					${$css} <!-- scoped style -->
					<slot></slot>
				`;

        if (!document.getElementById('_grid_layot_css_')) {
            const $styles = document.createElement('style');
            $styles.id = "_grid_layot_css_";

            let $css = `
									grid-layout .grid_item {
										overflow:hidden;
										border-radius:10px;
										position:relative;
										padding:1rem;
									}

									grid-layout .grid_item::before {
										content: '';
										display:block;
										background-color: rgba(0,0,0,0.3);
										z-index: 2;
									}

									grid-layout .grid_item::before,
									grid-layout .grid_item ._image_ {
										position:absolute;
										top:0;
										left:0;
										width:100%;
										height:100%;
										pointer-events:none;
									}
									grid-layout ._image_ {
										z-index: 1;
										object-fit:cover;
										object-fit-position: bottom center;
									}
									grid-layout .grid_item ._caption_ {
										z-index:3;
										color: #fff;
									}
									`;

            $css += this.getMaxColumn;

            $css = $css.replace(/[\r\t]/g, '');
            $css = $css.replace(/[\n]/g, ' ');

            $styles.innerHTML = $css;
            document.head.appendChild($styles);
        }

        setTimeout(() => {
            this.classList.add('loaded');
        }, 1000);
    }

    constructor() {
        super();

        this.mobileCols = this.getColumnsMobile;
        this.tabletCols = this.getColumnsTablet;
        this.desktopCols = this.getColumnsDesktop;
        this.hdCols = this.getColumnsHd;
        this.autoRows = this.getAutoRows;

        this.tb = '768px';
        this.d = '1366px';
        this.w = '1520px';

        let $main_slider = document.getElementById(this.getId);
        lightGallery($main_slider);
    }


}
window.customElements.define('grid-layout', Grid);

{ /* <grid-layout id = "gallery23476" oh-columns-m="2" oh-columns-tb="2" oh-columns-d="3" oh-columns-w="4" auto-rows="150"></grid-layout> */ }