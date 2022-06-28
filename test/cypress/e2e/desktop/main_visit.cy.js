describe('Visiting app', () => {
    it('Checks if the basic components are getting rendered', () => {
        const text = 'Chats'; 

        cy.visit('http://localhost:3000/prod/');
        cy.get('h1').first().should('have.text', text);
    });
});
