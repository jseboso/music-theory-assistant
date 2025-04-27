describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('renders the sign-in form by default', () => {
    cy.contains('h2', 'Welcome back').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.contains('button', 'Sign in').should('be.visible');
  });

  it('toggles into the sign-up form and back', () => {
    cy.contains("Don't have an account? Sign up").click();
    cy.contains('h2', 'Create an account').should('be.visible');
    cy.contains('button', 'Sign up').should('be.visible');

    cy.contains('Already have an account? Sign in').click();
    cy.contains('h2', 'Welcome back').should('be.visible');
  });

  it('marks email and password as required fields', () => {
    cy.get('#email').should('have.attr', 'required');
    cy.get('#password').should('have.attr', 'required');
  });
});
