import { christopherUser, powerdosistem } from '../mocks/users';

describe('FileListComponent', () => {
  beforeEach(() => {
    const mockFiles = [
      {
        id: '1',
        name: 'testfile1.txt',
        size: 200,
        type: 'text/plain',
        imgURL: '../../../assets/img/files/txt.png',
      },
      {
        id: '2',
        name: 'testfile2.txt',
        size: 300,
        type: 'text/plain',
        imgURL: '../../../assets/img/files/txt.png',
      },
    ];

    sessionStorage.setItem(
      'uploadedFiles',
      JSON.stringify([{ email: christopherUser.email, files: mockFiles }])
    );

    sessionStorage.setItem(
      'userStorage',
      JSON.stringify([
        { password: christopherUser.password, email: christopherUser.email },
        { password: powerdosistem.password, email: powerdosistem.email },
      ])
    );

    sessionStorage.setItem(
      'userLoggedIn',
      JSON.stringify({
        password: christopherUser.password,
        email: christopherUser.email,
      })
    );

    cy.visit('/file-list');
  });

  it('should delete a file', () => {
    cy.get('[data-test=delete-file-button]').first().click();

    cy.get('.modal-footer .btn-primary').click();

    cy.get('[data-test=file-list] tr').should('have.length', 1); 
  });

  it('should clear all files', () => {
    cy.get('[data-test=clear-all-button]').click();

    cy.get('.modal-footer .btn-primary').click(); 

    cy.get('[data-test=file-list] tr').should('have.length', 0);
  });
});
