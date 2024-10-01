import { userMock } from '../mocks/users';

describe('Login and Registration Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should load the login form initially', () => {
    cy.get('[data-test="login-form"]').should('be.visible');
    cy.get('[data-test="login-email"]').should('exist');
    cy.get('[data-test="login-password"]').should('exist');
    cy.get('[data-test="login-button"]').should('exist');
  });

  it('Should switch to the registration form when clicking register link', () => {
    cy.get('[data-test="register-link"]').click();

    cy.get('[data-test="register-form"]').should('be.visible');
    cy.get('[data-test="register-email"]').should('exist');
    cy.get('[data-test="register-password"]').should('exist');
    cy.get('[data-test="register-button"]').should('exist');
  });

  it('Should register a new user successfully', () => {
    cy.get('[data-test="register-link"]').click();

    cy.get('[data-test="register-email"]').type('newuser@example.com');
    cy.get('[data-test="register-password"]').type('password123');

    cy.get('[data-test="register-button"]').click();

    cy.contains('User successfully registered').should('exist');
  });

  it('Should show an error when trying to log in with incorrect credentials', () => {
    cy.get('[data-test="login-form"]').should('be.visible');

    cy.get('[data-test="login-email"]').type('wronguser@example.com');
    cy.get('[data-test="login-password"]').type('wrongpassword');

    cy.get('[data-test="login-button"]').click();

    cy.contains('No user registered').should('exist');
  });

  it('Should warn if no user is registered', () => {
    sessionStorage.clear();

    cy.get('[data-test="login-email"]').type('unknownuser@example.com');
    cy.get('[data-test="login-password"]').type('somepassword');

    cy.get('[data-test="login-button"]').click();

    cy.contains('No user registered').should('exist');
  });

  it('should register a user and login successfully', () => {
    cy.get('[data-test="register-link"]').click();

    cy.get('[data-test="register-email"]').type(userMock.email);
    cy.get('[data-test="register-password"]').type(userMock.password);
    cy.get('[data-test="register-button"]').click();

    cy.contains('User successfully registered').should('exist');

    cy.get('[data-test="login-email"]').type(userMock.email);
    cy.get('[data-test="login-password"]').type(userMock.password);
    cy.get('[data-test="login-button"]').click();

    cy.url().should('include', '/file-list');
  });
});
