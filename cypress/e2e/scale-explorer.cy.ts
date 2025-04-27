describe('Scale Explorer', () => {
  it('defaults to the C major scale', () => {
    cy.visit('/tools/scale-explorer');
    cy.contains('h3', 'C Major Scale').should('be.visible');
  });

  it('recalculates the scale when the root note changes', () => {
    cy.visit('/tools/scale-explorer');

    cy.contains('button', /^G$/).click();
    cy.contains('h3', 'G Major Scale').should('be.visible');
  });

  it('recalculates the scale when the scale type changes', () => {
    cy.visit('/tools/scale-explorer');

    cy.contains('button', /^A$/).click();
    cy.get('select').select('Natural Minor');

    cy.contains('h3', 'A Natural Minor Scale').should('be.visible');
    // A natural minor has 7 notes
    cy.get('.bg-amber-100.text-amber-800.rounded-lg').should('have.length', 7);
  });
});
