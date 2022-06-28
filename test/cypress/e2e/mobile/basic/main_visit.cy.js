import setup from '../setup.js';

describe('Visiting app', () => {
    setup();

    it('Checks if the basic components are getting rendered', () => {
        cy.get('h1').first().should('have.text', LANG.THREADSTITLE);
    });
});
