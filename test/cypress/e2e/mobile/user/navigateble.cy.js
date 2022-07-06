import setup from '../setup.js';

describe('Check if menu or modal is navigateable', () => {
    setup();

    it('Check if user menu is viewable and hidden again', () => {
        cy.get('header .fa-circle-user').click();
        cy.get('user-menu').should('not.have.class', 'hide');
        cy.get('.bottom-navi .fa-comments').click();
        cy.get('user-menu').should('have.class', 'hide');
    });
});
