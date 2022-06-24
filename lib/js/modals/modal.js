import { LitElement, html, css } from 'lit';

class Modal extends LitElement {
    static styles = css`
    :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0,0,0,0.25);
    }

    .inner-modal {
        position: absolute;
        background: white;
        padding: var(--big-padding);
        border-radius: var(--small-border-radius); 
        width: 550px;
        max-width: 82%;
        min-height: 32px;
        word-break: break-word;
        background-color: var(--color-secondary);
        color: var(--color-on-secondary);
    }

    @keyframes fadeInAnimation {
        0% {
            bottom: -50%;
        }
        100% {
            bottom: 0;
        }
    }

    @keyframes fadeOutAnimation {
        0% {
            bottom: 0;
        }
        100% {
            bottom: -60%;
        }
    }

    .close-modal {
        color: #aaa;
        line-height: var(--big-padding);
        position: absolute;
        right: 0;
        top: 0;
        text-align: center;
        width: 70px;
    }

    .close-modal:hover {
        cursor: pointer;
        color: var(--color-on-background);
    }

    a,
    a:link,
    a:active,
    a:visited,
    a:hover {
        color: var(--color-highlight-variant) !important;
        text-decoration: none;
    }

    @media (pointer:none), (pointer:coarse) {
        :host {
            align-items: self-end;
        }

        .inner-modal {
            border-bottom-left-radius: 0; 
            border-bottom-right-radius: 0; 
            animation: fadeInAnimation 0.3s;
        }
    }`;

    constructor () {
        super();
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

        if (isOpen) {
            return;
        }
  
        requestAnimationFrame(() => {
            this.classList.remove('hide');
            return this.setAttribute('data-open', 'true');
        });
    }

    close () {
        const isClosed = this.getAttribute('data-open') === 'false';
        const innerModal = this.shadowRoot.querySelector('.inner-modal');

        if (isClosed) {
            return;
        }

        innerModal.style = 'animation: fadeOutAnimation 0.3s !important;'
        setTimeout(() => {
            this.classList.add('hide');
            innerModal.style = '';
            return this.setAttribute('data-open', 'false');
        }, 300);
    }
    
    set ({ HTML }) {
        this.shadowRoot.querySelector('.modal-content').innerHTML = HTML;
    }

    setAndOpen (options) {
        this.set(options);
        this.open();
    }

    render (content = '') {
        return html`<div class="inner-modal"><small @click="${this.close}" class="close-modal">close</small><div class="modal-content">${content}</div></div>`;
    }
}

customElements.define('modal-window', Modal);

export default Modal;