import { userMock } from '../mocks/users';

describe('LayoutComponent', () => {
  beforeEach(() => {
    sessionStorage.setItem('uploadedFiles', JSON.stringify([]));
    
    sessionStorage.setItem(
      'userStorage',
      JSON.stringify([
        { password: userMock.password, email: userMock.email }
      ])
    );

    sessionStorage.setItem(
      'userLoggedIn',
      JSON.stringify({
        password: userMock.password,
        email: userMock.email,
      })
    );

    cy.visit('/file-list');
  });

  it('should display the welcome message with the user email', () => {
    cy.get('[data-test="welcome-message"]').should(
      'contain.text',
      `Welcome back, ${userMock.email}`
    );
  });

  it('should display the logo', () => {
    cy.get('[data-test="logo"]').should('be.visible');
  });

  it('should navigate to the login page when logout is clicked', () => {
    cy.get('[data-test="logout-button"]').click();

    cy.url().should('include', '/login');

    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('userLoggedIn')).to.be.null;
    });
  });

  it('should display the file list component', () => {
    cy.get('[data-test="file-list-container"]').should('be.visible');
  });
});
