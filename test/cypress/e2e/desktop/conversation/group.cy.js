import setup from '../setup.js';

describe('Group settings', () => {
    setup();

    it('check empty group name shows error toast', () => {
        cy.get('.fa-pen-clip').click();
        cy.get('conversation-modal-window.modal .modal-content .sub-modal-button').click();
        cy.get('conversation-modal-window.modal .modal-side button').click();
        cy.get('toast-notification').should('have.class', 'active');
        cy.get('toast-notification.active .progress.error').should('have.class', 'active');
    });

    it('check with public group name and success toast', () => {
        cy.get('.fa-pen-clip').click();
        cy.get('conversation-modal-window.modal .modal-content .sub-modal-button').click();
        cy.get('conversation-modal-window.modal .modal-side input').type('public group');
        cy.get('conversation-modal-window.modal .modal-side select').select('public');
        cy.get('conversation-modal-window.modal .modal-side button').click();
        cy.get('toast-notification').should('have.class', 'active');
        cy.get('toast-notification.active .progress.success').should('have.class', 'active');
    });

    it('check with private group name and success toast', () => {
        cy.get('.fa-pen-clip').click();
        cy.get('conversation-modal-window.modal .modal-content .sub-modal-button').click();
        cy.get('conversation-modal-window.modal .modal-side input').type('private group');
        cy.get('conversation-modal-window.modal .modal-side select').select('private');
        cy.get('conversation-modal-window.modal .modal-side button').click();
        cy.get('toast-notification').should('have.class', 'active');
        cy.get('toast-notification.active .progress.success').should('have.class', 'active');
    });
});
