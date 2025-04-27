describe('Metronome', () => {
  it('toggles between Start and Stop', () => {
    cy.visit('/tools/metronome');

    cy.contains('100').should('be.visible');
    cy.contains('button', 'Start').click();
    cy.contains('button', 'Stop').should('be.visible').click();
    cy.contains('button', 'Start').should('be.visible');
  });

  it('exposes a tempo slider with sensible bounds', () => {
    cy.visit('/tools/metronome');

    cy.get('#tempo-slider')
      .should('have.attr', 'min', '40')
      .and('have.attr', 'max', '220')
      .and('have.value', '100');
  });

  it('switches time signatures', () => {
    cy.visit('/tools/metronome');

    cy.contains('button', '3/4').click();
    cy.contains('Time Signature: 3/4').should('be.visible');
  });
});
