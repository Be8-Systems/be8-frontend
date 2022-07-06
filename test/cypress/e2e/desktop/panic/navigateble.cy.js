import setup from '../setup.js';

describe('Check if menu or modal is navigateable', () => {
    setup();

    it('Check if modal is viewable and hidden again after closing', () => {
        cy.get('.bottom-navi .fa-bomb').click();
        cy.get('panic-modal-window').should('not.have.class', 'hide');
        cy.get('panic-modal-window .close-modal').click();
        cy.get('panic-modal-window').should('have.class', 'hide');
    });
});
