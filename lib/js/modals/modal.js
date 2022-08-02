import { LitElement, html } from 'lit';

class Modal extends LitElement {
    #hasClose = true;

    constructor (hasClose = true) {
        super();

        this.#hasClose = hasClose;
        this.classList = 'hide modal';
        this.setAttribute('data-open', 'false');
        
        if (hasClose) {
            return this.#addClickEvent();
        }
    }

    #addClickEvent () {
        this.addEventListener('click', ({ target }) => {
            if (target.isSameNode(this)) {
                return this.close();
            }
        });
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }
    
    toggle () {
        const isOpen = this.getAttribute('data-open') === 'true';

        if (isOpen) {
            return this.close();
        }

        return this.open();
    }

    open () {
        const isOpen = this.getAttribute('data-open') === 'true';
        const innerModal = this.querySelector('.inner-modal');

        if (isOpen) {
            return;
        }
  
        requestAnimationFrame(() => {
            this.classList.remove('hide');
            innerModal.style = 'animation: fadeUpAnimation 0.3s !important;'
            return this.setAttribute('data-open', 'true');
        });
    }

    close () {
        const isClosed = this.getAttribute('data-open') === 'false';
        const innerModal = this.querySelector('.inner-modal');

        if (isClosed) {
            return;
        }

        innerModal.style = 'animation: fadeDownAnimation 0.3s !important;'
        setTimeout(() => {
            innerModal.style = '';
            this.classList.add('hide');
            return this.setAttribute('data-open', 'false');
        }, 275);
    }

    set ({ HTML }) {
        this.querySelector('.modal-content').innerHTML = HTML;
    }

    setAndOpen (options) {
        this.set(options);
        this.open();
    }

    render (content = '', sideContent = '') {
        const close = this.#hasClose ? html`<small @click="${this.close}" class="close-modal unselectable">close</small>` : html``;
        return html`<div class="inner-modal">${close}<div class="modal-content">${content}</div><div class="modal-side">${sideContent}</div></div>`;
    }
}

customElements.define('modal-window', Modal);

export default Modal;