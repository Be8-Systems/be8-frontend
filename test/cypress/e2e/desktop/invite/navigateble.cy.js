import setup from '../setup.js';

describe('Check if menu or modal is navigateable', () => {
    setup();

    it('Check if modal is viewable and hidden again after closing', () => {
        cy.get('.bottom-navi .fa-plus').click();
        cy.get('invite-modal-window').should('not.have.class', 'hide');
        cy.get('invite-modal-window small').focus();
        cy.get('invite-modal-window small').click();
        cy.get('invite-modal-window').should('have.class', 'hide');
    });
    
    it('Check if link in modal has a parameter join value', () => {
        cy.get('.bottom-navi .fa-plus').click();
        cy.get('invite-modal-window').should('not.have.class', 'hide');
        cy.get('invite-modal-window a').should('have.attr', 'href');
        cy.get('invite-modal-window small').focus().realClick();
    });
});
