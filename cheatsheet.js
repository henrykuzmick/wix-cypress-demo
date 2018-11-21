
it('Adds a todo', () => {
  cy.visit('http://localhost:8080');
  cy.get('#new-todo').type('hello{enter}')
  cy.get('#todo-list').find('li').should('have.length', 1)
});

it('Update a todo', () => {
  cy.addTodo('new todo');
  cy.contains('new todo').dblclick();
  cy.focused().type('{selectall}yoyoyo{enter}');
  cy.get('#todo-list').find('li').contains('yoyoyo');
});

Cypress.Commands.add("resetdb", () => {
  cy.request({
    url: 'http://localhost:8080/todos',
    method: 'POST',
    body: {
      type: "UPDATE_ITEMS", data: {status: true}
    }
  })

  cy.request({
    url: 'http://localhost:8080/todos',
    method: 'POST',
    body: {
      query: {status: true},
      status: true,
      type: "DELETE_ITEMS"
    }
  })
});

Cypress.Commands.add("addTodo", (text = 'hello') => {
  cy.request({
    url: 'http://localhost:8080/todos',
    method: 'POST',
    body: {
      id: Math.random(),
      type: "ADD_ITEM",
      text,
    }
  })
});

function setXMLHttpRequest (w) {
  window.XMLHttpRequest = w.XMLHttpRequest
  return w
}

function setAlert (w) {
  window.alert = w.alert
  return w
}

Cypress.Commands.add("mount", (jsx) => {
  const html = `<body>
    <div id="app"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/umd/react.development.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.2.0/umd/react-dom.development.js"></script>
  </body>`

  const document = cy.state('document')
  document.write(html)
  document.close()

  cy.window({log: false})
    .then(setXMLHttpRequest)
    .then(setAlert)
    .its('ReactDOM.render')
    .then(render => {
      Cypress._component = render(jsx, document.getElementById('app'))
      Cypress.component = () =>
        cy.then(() => Cypress._component)
    })
});

import React from 'react'
import { HelloWorld } from '../../HelloWorld';

describe('unit test', () => {
  it('renders the todo', () => {
    cy.mount(<HelloWorld />)
    cy.contains('Hello World')
  });
});
