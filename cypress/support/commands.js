Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function () {
    cy.get('#firstName').type('Felipe')
    cy.get('#lastName').type('Feyh')
    cy.get('#email').type('japao@gmail.com')
    cy.get('#open-text-area').type('teste')
    //cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()
})