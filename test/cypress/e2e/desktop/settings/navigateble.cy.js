import setup from '../setup.js';

describe('Check if menu or modal is navigateable', () => {
    setup();

    it('Check if settings menu is viewable and hidden again', () => {
        cy.get('.bottom-navi .fa-gears').click();
        cy.get('settings-menu').should('not.have.class', 'hide');
        cy.get('.bottom-navi .fa-comments').click();
        cy.get('settings-menu').should('have.class', 'hide');
    });
});
