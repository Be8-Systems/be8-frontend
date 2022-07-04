import setup from '../setup.js';

describe('Trigger Destroy everything', () => {
    setup();

    it('Enter wrong id shows error toas', () => {
        cy.get('.bottom-navi .fa-bomb').click();
        cy.get('panic-modal-window .modal-content input').type(12345);
        cy.get('panic-modal-window .modal-content button').click();
        cy.get('toast-notification').should('have.class', 'active');
        cy.get('toast-notification.active .progress.error').should('have.class', 'active');
    });

    it('Enter empty id shows error toast', () => {
        cy.get('.bottom-navi .fa-bomb').click();
        cy.get('panic-modal-window .modal-content button').click();
        cy.get('toast-notification').should('have.class', 'active');
        cy.get('toast-notification.active .progress.error').should('have.class', 'active');
    });

    it('Enter correct id shows success toast', () => {
        cy.get('.bottom-navi .fa-bomb').click();
        cy.get('panic-modal-window .modal-content input').type('1337');
        cy.wait(1500);
        cy.get('panic-modal-window .modal-content button').click();
        cy.get('toast-notification').should('have.class', 'active');
        cy.get('toast-notification.active .progress.success').should('have.class', 'active');
    });
});
