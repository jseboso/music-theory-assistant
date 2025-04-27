describe('Homepage', () => {
  it('shows the hero content and links through to login', () => {
    cy.visit('/');

    cy.contains('h1', 'Music Theory Assistant').should('be.visible');
    cy.contains('a', 'Start Learning').should('have.attr', 'href', '/login');

    cy.contains('a', 'Login').click();
    cy.location('pathname').should('eq', '/login');
  });

  it('advertises the three core feature areas', () => {
    cy.visit('/');

    cy.contains('h3', 'Interactive Lessons').should('be.visible');
    cy.contains('h3', 'Ear Training').should('be.visible');
    cy.contains('h3', 'Progress Tracking').should('be.visible');
  });
});
