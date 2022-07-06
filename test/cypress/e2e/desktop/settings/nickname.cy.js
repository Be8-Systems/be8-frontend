import setup from '../setup.js';

describe('Nickname', () => {
    setup();

    it('Check if a nickname changes the title', () => {
        const newNick = 'mustermann';

        cy.get('.bottom-navi .fa-gears').click();
        cy.get('settings-menu .settings-container input').clear();
        cy.get('settings-menu .settings-container input').type('mustermann');
        cy.get('settings-menu .settings-container input').should('have.value', newNick);
        cy.get('settings-menu .settings-container p').first().should('have.text', `Nickname is ${newNick}`);
    });
});
