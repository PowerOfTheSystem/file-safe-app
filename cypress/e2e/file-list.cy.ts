import { filesMock } from 'cypress/mocks/files';
import { userMock } from '../mocks/users';
import { File } from 'src/app/models/file';

describe('FileListComponent', () => {
  beforeEach(() => {
    const mockFiles: File = filesMock;

    sessionStorage.setItem(
      'uploadedFiles',
      JSON.stringify([{ email: userMock.email, files: mockFiles }])
    );

    sessionStorage.setItem(
      'userStorage',
      JSON.stringify([
        { password: userMock.password, email: userMock.email },
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

  it('should save uploaded files to sessionStorage', () => {
    const fileName = 'photo.png';
    const fileType = 'image/png';

    cy.get('[data-test="file-input"]').selectFile('cypress/fixtures/photo.png');

    cy.window().then((win) => {
      const uploadedFiles = win.sessionStorage.getItem('uploadedFiles');
      const parsedFiles = JSON.parse(uploadedFiles);

      expect(parsedFiles).to.be.an('array').and.have.length.greaterThan(0);
      const userFileEntry = parsedFiles.find(
        (entry) => entry.email === userMock.email
      );

      expect(userFileEntry).to.exist;
      expect(userFileEntry.files)
        .to.be.an('array')
        .and.have.length.greaterThan(0);
      expect(userFileEntry.files[2].name).to.equal(fileName);
      expect(userFileEntry.files[2].type).to.equal(fileType);
    });
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
