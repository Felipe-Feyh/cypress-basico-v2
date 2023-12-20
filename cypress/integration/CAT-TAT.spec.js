/// <reference types='Cypress' />

describe('Central de Atendimento ao Cliente TAT', function () {
  this.beforeEach(function () {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', function () {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', function () {
    const longText = 'Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem Teste de mensagem'
    cy.get('#firstName').type('Felipe')
    cy.get('#lastName').type('Feyh')
    cy.get('#email').type('felipe.feyh@tat.com')
    cy.get('#open-text-area').type(longText, { delay: 1 })
    //cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
    cy.get('#firstName').type('Felipe')
    cy.get('#lastName').type('Feyh')
    cy.get('#email').type('japao')
    cy.get('#open-text-area').type('teste')
    // cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
  })

  it('campo telefone continua vazio quando preenchido com valor não-numérico', function () {
    cy.get('#phone')
      .type('telefone')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
    cy.get('#firstName').type('Felipe')
    cy.get('#lastName').type('Feyh')
    cy.get('#email').type('japao')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('teste')
    // cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
    cy.get('#firstName')
      .type('Felipe')
      .should('have.value', 'Felipe')
      .clear()
      .should('have.value', '')
    cy.get('#lastName')
      .type('Feyh')
      .should('have.value', 'Feyh')
      .clear()
      .should('have.value', '')
    cy.get('#email')
      .type('felipe@teste.com')
      .should('have.value', 'felipe@teste.com')
      .clear()
      .should('have.value', '')
    cy.get('#phone')
      .type('1234567890')
      .should('have.value', '1234567890')
      .clear()
      .should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
    //  cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })

  it('envia o formulário com sucesso usando um comando customizado', function () {

    // utiliza o commands para armazenar os mocks
    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.success').should('be.visible')
  })

  it('seleciona um produto de maneira aleatória por seu índice', function () {
    cy.get('select option')
      .its('length', { log: false }).then(n => {
        cy.get('select').select(Cypress._.random(n - 1))
      })

  })

  it('seleciona um produto de maneira aleatória por seu texto', function () {
    cy.get('select option')
      .as('options')
      .its('length', { log: false }).then(n => {
        cy.get('@options', { log: false }).then($options => {
          const randomOptionIndex = Cypress._.random(n - 1)
          const randomOptionText = $options[randomOptionIndex].innerText
          cy.get('select').select(randomOptionText)
        })
      })
  })

  it('seleciona um produto (YouTube) por seu texto', function () {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor', function () {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) pelo seu índice', function () {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', function () {
    cy.get('input[type="radio"][value="feedback"')
      .check()
      .should('have.value', 'feedback')
  })

  it('marca cada tipo de atendimento', function () {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(function ($radio) {
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })
  })

  it('marca ambos checkbox, depois desmarca o último', function () {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures', function () {
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('cypress/fixtures/example.json')
      .then(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', function () {
    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })


  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
    cy.fixture('example.json').as('aliasExemplo')
    cy.get('input[type="file"]')
      .selectFile('@aliasExemplo')
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', function () {
    cy.get('#privacy a')
      .invoke('removeAttr', 'target')
      .click()

    cy.contains('Talking About Testing').should('be.visible')
  })
})