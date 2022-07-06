import setup from '../setup.js';

describe('Check if menu or modal is navigateable', () => {
    setup();

    // TODO: checken ob richtiger user angezeigt wird
    it('Check different classes and elements', () => {
        cy.get('.thread').eq(2).click();
        cy.get('.thread').eq(2).should('have.class', 'active-thread');
    });
});
