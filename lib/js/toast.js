import { LitElement, html } from 'lit';

class Toast extends LitElement {
    static properties = {
        notification: { type: Object },
    };

    #isOpen = false;
    #icons = {
        success: 'check',
        error: 'times',
        warning: 'triangle-exclamation'
    };
    #openTime = 5000;
    #progress = {};
    #timer1; 
    #timer2;
    
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
        if (this.#isOpen) {
            this.#progress.style.animation = 'none';
            this.#progress.style.width = '100%';
            this.#progress.style.animation = null; 
            
            this.#progress.classList.remove('active');
            this.classList.remove('active');
            clearTimeout(this.#timer1);
            clearTimeout(this.#timer2);
        }
        
        this.classList.add('active');
        this.#progress.classList.add('active');

        this.#isOpen = true;
        this.#timer1 = setTimeout(() => {
            this.classList.remove('active');
            this.isOpen = false;
        }, this.#openTime);
        this.#timer2 = setTimeout(() => this.#progress.classList.remove('active'), this.#openTime + 300);
    }

    close () {
        this.classList.remove('active');
        clearTimeout(this.#timer1);
        clearTimeout(this.#timer2);

        setTimeout(() => this.#progress.classList.remove('active'), 300);

        this.#timer1 = null;
        this.#timer2 = null;
        this.#isOpen = false;
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