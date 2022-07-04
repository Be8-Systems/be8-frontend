import setup from '../setup.js';

describe('Check if menu or modal is navigateable', () => {
    setup();

    // go to a message threads 
    // go back to threads menu
    // check if the user you are talking to is switched is switched
    it('Check different classes and elements', () => {
        cy.get('.thread').eq(1).click();
        cy.get('.thread').eq(1).should('have.class', 'active-thread');
    });
});
