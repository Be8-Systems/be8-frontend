export default function () {
    return beforeEach(() => {
        cy.viewport(1200, 800);
        cy.visit('http://localhost:3000/prod', {
            onBeforeLoad: (win) => {   
            }, 
        });
        cy.get('.close-modal').first().click();
    });
}
