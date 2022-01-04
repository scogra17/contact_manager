class Model {
  // only handles data and modifying data
  // has no knowledge of what's modifying it
  // has no knowledge of how data will be displayed
  // sufficient for CRUD app CLI

  // should know nothing about the DOM, HTML elements, CSS, etc.
  constructor() {
    this.contacts = [];
    this.tags = [];
  }

  deleteContact(id) {}

  addContact() {}

  editContact(id) {}

  getContact(id) {}
}

class View {
  constructor() {
    this.app = document.querySelector('#root')

    this.title = this.createElement('h1')
    this.title.textContent = ''
  }

  createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)

    return element
  }
}

class Controller {
  // should know nothing about the DOM, HTML elements, CSS, etc.

  constructor(model, view) {
    this.model = model
    this.view = view
  }
}

const app = new Controller(new Model(), new View())
