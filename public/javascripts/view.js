export default class View {
  constructor() {
    this.main = document.querySelector('main');
    this.header = document.querySelector('header');

    this.contactTemplate = Handlebars.compile(document.querySelector('#contact-template').innerHTML);
    this.formTemplate = Handlebars.compile(document.querySelector('#form-template').innerHTML);

    this.createDOMElements();
    this.displayTitle();
    this.displayHomeDOMElements();
  }

  // DOM element creation methods

  createDOMElements() {
    this.title = this.createTitle('Contact Manager', 'h1');
    this.searchInput = this.createSearchInput();
    this.addContactButton = this.createButton('Add Contact');
    this.contactsList = this.createContactsList();
    this.createEditContactForm();
    this.createAddContactForm();
  }

  createSearchInput() {
    let elem = this.createElement('input');
    elem.type = 'text';
    elem.placeholder = 'Search';
    elem.name = 'search';
    return elem;
  }

  createButton(text) {
    let elem = this.createElement('a');
    elem.setAttribute('href', '#');
    elem.textContent = text;
    return elem;
  }

  createContactsList() {
    return this.createElement('ul', 'contacts-list');
  }

  createEditContactForm() {
    this.editContactForm = this.createContactForm('Edit');
  }

  createAddContactForm() {
    this.addContactForm = this.createContactForm('Add');
  }

  // Display methods

  displayTitle() {
    this.header.append(this.title);
  }

  displayEditContactForm(contact) {
    this.populateFormWithJSON(this.editContactForm, contact)
    this.main.append(this.editContactForm);
  }

  displayHomeDOMElements() {
    while (this.main.firstChild) {
      this.main.removeChild(this.main.firstChild);
    }
    this.main.append(this.addContactButton);
    this.main.append(this.searchInput);
    this.main.append(this.contactsList);
    this.displayContacts();
  }


  // Helper methods

  createContactForm(title, contact = {}) {
    let elem = this.createElement('div', `${title.toLowerCase()}-contact-form`);
    let heading = this.createTitle(title, 'h3');
    elem.innerHTML = this.formTemplate(contact);
    elem.insertBefore(heading, elem.firstChild)
    return elem;
  }

  createTitle(text, type) {
    let elem = this.createElement(type);
    elem.textContent = text;
    return elem;
  }

  clearMainDisplay() {
    while (this.main.firstChild) {
      this.main.removeChild(this.main.firstChild);
    }
  }

  // called every time a contact is changed, added or removed
  // called with `contacts` from Model to keep the view in sync with the Model
  displayContacts(contacts = []) {
    while (this.contactsList.firstChild) {
      this.contactsList.removeChild(this.contactsList.firstChild);
    }

    if (contacts.length === 0) {
      const p = this.createElement('p');
      p.textContent = "There are no contacts.";
      this.contactsList.append(p);
    } else {
      let template = contacts.map(contact => {
        return this.contactTemplate(contact);
      })
      this.contactsList.innerHTML = template.join("");
    }
  }

  bindSearchContact(handler) {
    this.searchInput.addEventListener('keyup', event => {
      event.preventDefault();
      handler(this._searchInputText)
    })
  }

  bindDeleteContact(handler) {
    this.contactsList.addEventListener('click', event => {
      if (event.target.classList.contains('delete')) {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    })
  }

  bindEditContact(handler) {
    this.contactsList.addEventListener('click', event => {
      event.preventDefault();
      if (event.target.classList.contains('edit')) {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    })
  }

  bindSubmitEditContact(handler) {
    this.editContactForm.addEventListener('submit', event => {
      event.preventDefault();
      let contact = this.prepareFormData(this.editContactForm.querySelector('form'));
      contact['id'] = this.editContactForm.id;
      handler(contact);
    })
  }

  bindCancelEditContact(handler) {
    this.editContactForm.querySelector('#cancel-add-contacts-btn').addEventListener('click', event => {
      event.preventDefault();
      handler();
    })
  }

  formDataToJson(formData) {
    let json = {};
    for (let pair of formData.entries()) {
      json[pair[0]] = pair[1];
    }
    return json;
  }

  prepareFormData(form) {
    let formData = new FormData(form);
    let json = this.formDataToJson(formData);
    return json;
  }

  populateFormWithJSON(form, data) {
    for (const k in data) {
      let input = form.querySelector('#' + k);
      if (input) {
        input.setAttribute('value', data[k]);
      }
    }
    form.id = data['id'];
  }

  createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)

    return element
  }

  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }

  _resetSearchInput() {
    this.searchInput.value = ''
  }

  get _searchInputText() {
    return this.searchInput.value
  }
}
