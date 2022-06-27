import { LitElement, html } from 'lit';

let timer1, timer2;

class Toast extends LitElement {
    static properties = {
        notification: {},
    };

    #icons = {
        success: 'check',
        error: 'times',
        warning: 'triangle-exclamation'
    };
    #openTime = 5000;
    #progress = {};
    
    constructor () {
        super();

        this.notification = {
            type: 'success',
            text: 'Your changes has been saved',
        };
    }

    createRenderRoot () {
        return this; // prevents creating a shadow root
    }

    open () {
        this.classList.add('active');
        this.#progress.classList.add('active');
      
        timer1 = setTimeout(() => {
            this.classList.remove('active');
        }, this.#openTime);
      
        timer2 = setTimeout(() => {
            this.#progress.classList.remove('active');
        }, this.#openTime + 300);
    }

    close () {
        this.classList.remove('active');

        setTimeout(() => {
            this.#progress.classList.remove('active');
        }, 300);
      
        clearTimeout(timer1);
        clearTimeout(timer2);
    }

    firstUpdated () {
        this.#progress = this.querySelector('.progress');
    }

    render () {
        const icon = this.#icons[this.notification.type];

        return html`<div class="toast-content">
            <i class="fas fa-solid fa-${icon} ${this.notification.type}"></i>
            <div class="toast-message">
                <span class="text text-1">${this.notification.type.toUpperCase()}</span>
                <span class="text text-2">${this.notification.text}</span>
            </div>
        </div>
        <i @click="${this.close}" class="fa-solid fa-xmark close hover-font"></i>
        <div class="progress active  ${this.notification.type}"></div>`;
    }
}

export default customElements.define('toast-notification', Toast);