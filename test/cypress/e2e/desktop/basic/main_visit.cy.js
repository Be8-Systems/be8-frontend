import setup from '../setup.js';

describe('Visiting app', () => {
    setup();
    
    it('Checks if the basic components are getting rendered', () => {
        cy.get('h1').first().should('have.text', LANG.THREADSTITLE);
        cy.get('modal-window').should('have.class', 'hide');
        cy.get('invite-modal-window').should('have.class', 'hide');
        cy.get('panic-modal-window').should('have.class', 'hide');
        cy.get('conversation-modal-window').should('have.class', 'hide');
        cy.get('codes-modal-window').should('have.class', 'hide');
        cy.get('user-modal-window').should('have.class', 'hide');
        cy.get('messages-menu').should('not.have.class', 'hide');
    });
});
