import setup from '../setup.js';

describe('Dialog settings', () => {
    setup();

    it('Enter none number and check if there is a non number in input', () => {
        const text = 'text only';

        cy.get('.fa-pen-clip').click();
        cy.get('conversation-modal-window.modal .modal-content input').type(text);
        cy.get('conversation-modal-window.modal .modal-content input').should('not.have.value', text);
    });

    it('check empty id shows error toast', () => {
        cy.get('.fa-pen-clip').click();
        cy.get('toast-notification').not('have.class', 'active');
        cy.get('conversation-modal-window.modal .modal-content input').type('{enter}');
        cy.get('toast-notification').should('have.class', 'active');
        cy.get('toast-notification.active .progress.error').should('have.class', 'active');
    });

    it('check id with success toast', () => {
        cy.get('.modal-content p i')
            .first()
            .invoke('text')
            .then((id) => {
                const otherID = parseInt(id.slice(1)) - 1;
                
                cy.get('.fa-pen-clip').click();
                cy.get('conversation-modal-window.modal .modal-content input').type(`${otherID}{enter}`);
                cy.get('toast-notification').should('have.class', 'active');
                cy.get('toast-notification.active .progress.success').should('have.class', 'active');
            });
    });
});
