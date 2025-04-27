describe('Chord Finder', () => {
  it('shows the notes and theory copy for a selected chord', () => {
    cy.visit('/tools/chord-finder');

    cy.contains('button', /^C$/).click();
    cy.contains('button', /^Major 7th$/).click();

    cy.contains('h4', 'Major 7th Chord').should('be.visible');
    cy.contains('smooth, jazzy quality').should('be.visible');
    // Major 7th is a four-note chord: C E G B
    cy.get('.bg-amber-100.text-amber-800.rounded-lg').should('have.length', 4);
  });

  it('changes the note count between a triad and a 7th chord', () => {
    cy.visit('/tools/chord-finder');
    cy.contains('button', /^D$/).click();

    cy.contains('button', /^Minor$/).click();
    cy.get('.bg-amber-100.text-amber-800.rounded-lg').should('have.length', 3);

    cy.contains('button', /^Minor 7th$/).click();
    cy.get('.bg-amber-100.text-amber-800.rounded-lg').should('have.length', 4);
  });
});
