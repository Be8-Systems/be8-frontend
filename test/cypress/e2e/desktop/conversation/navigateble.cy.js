import setup from '../setup.js';

describe('Check if menu or modal is navigateable', () => {
    setup();

    it('Check if modal is viewable and hidden again after closing', () => {
        cy.get('.fa-pen-clip').click();
        cy.get('conversation-modal-window').should('not.have.class', 'hide');
        cy.get('conversation-modal-window.modal .inner-modal .close-modal').click();
        cy.get('conversation-modal-window').should('have.class', 'hide');
    });

    it('Go to group and go back', () => {
        cy.get('.fa-pen-clip').click();
        cy.get('conversation-modal-window.modal .modal-content .sub-modal-button').click();
        cy.get('conversation-modal-window .create-group-content').should('not.have.class', 'hide');
        cy.get('conversation-modal-window.modal .inner-modal .close-modal').click();
        cy.get('conversation-modal-window .create-group-content').should('have.class', 'hide');
    });

    it('Go to group and close modal and reopen', () => {
        cy.get('.fa-pen-clip').click();
        cy.get('conversation-modal-window.modal .modal-content .sub-modal-button').click();
        cy.get('conversation-modal-window.modal .inner-modal .close-modal').click();
        cy.get('.fa-pen-clip').click();
        cy.get('conversation-modal-window').should('not.have.class', 'hide');
        cy.get('conversation-modal-window .create-group-content').should('have.class', 'hide');
    });
});
