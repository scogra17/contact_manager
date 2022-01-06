export default class View {
  constructor() {
    this.contactTemplate = Handlebars.compile(document.querySelector('#contact-template').innerHTML);
    this.formTemplate = Handlebars.compile(document.querySelector('#form-template').innerHTML);

    this.createDOMElements();
    this.displayTitle();
    this.displayHomeDOMElements();
  }

  // DOM element creation methods

  createDOMElements() {
    this.main = document.querySelector('main');
    this.header = document.querySelector('header');
    this.title = this.createTitle('Contact Manager', 'h1');
    this.searchInput = this.createSearchInput();
    this.tagDropdown = this.createTagDropdown();
    this.addContactButton = this.createButton('Add Contact');
    this.contactsList = this.createContactsList();
    this.editContactForm = this.createEditContactForm();
    this.addContactForm = this.createAddContactForm();
    this.addTagsForm = this.createAddTagsForm();
  }

  createSearchInput() {
    let elem = this.createElement('input');
    elem.type = 'text';
    elem.placeholder = 'Search';
    elem.name = 'search';
    return elem;
  }

  createTagDropdown() {
    let elem = this.createElement('select');
    elem.name = 'tags'

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
    return this.createContactForm('Edit');
  }

  createAddContactForm() {
    return this.createContactForm('Add');
  }

  createAddTagsForm() {
    let elem = this.createElement('form');
    elem.setAttribute('id', 'tag-form');
    let label = this.createElement('label');
    label.setAttribute('for', 'new-tag');
    label.textContent = 'Add new tag';
    let textInput = this.createElement('input');
    textInput.setAttribute('type', 'text');
    textInput.setAttribute('name', 'new-tag');
    textInput.setAttribute('id', 'new-tag');
    textInput.setAttribute('placeholder', 'New tag...');
    let submitInput = this.createElement('input');
    submitInput.setAttribute('type', 'submit');
    submitInput.setAttribute('value', 'Add tag');
    elem.appendChild(label);
    elem.appendChild(textInput);
    elem.appendChild(submitInput);
    return elem;
  }

  // Display methods

  displayTitle() {
    this.header.append(this.title);
  }

  displayEditContactForm(contact, tags) {
    this.populateFormWithJSON(this.editContactForm, contact);
    this.populateFormWithTags(this.editContactForm, tags);
    this.markSelectedTags(this.editContactForm, contact);
    this.main.append(this.editContactForm);
  }

  displayAddContactForm(tags) {
    this.populateFormWithTags(this.addContactForm, tags)
    this.main.append(this.addContactForm);
  }

  displayTag(tag) {
    let option = this.createOptionElement(tag, tag);
    this.getElement('select').append(option);
  }

  displayAddTagForm() {
    this.main.append(this.addTagsForm);
  }

  displayHomeDOMElements() {
    this.clearMainDisplay();
    this.main.append(
      this.addContactButton,
      this.searchInput,
      this.tagDropdown,
      this.contactsList);
    this.displayContacts();
  }

  displayTags(tags) {
    this.clearElementChildren(this.tagDropdown);

    let placeholder = this.createElement('option');
    placeholder.value = ''
    placeholder.setAttribute('selected', null);
    placeholder.textContent = "Filter by tag"

    let elems = [placeholder];
    let option;
    for (const tag in tags) {
      option = this.createElement('option');
      option.value = tag;
      option.textContent = tag;
      elems.push(option);
    }
    elems.forEach(elem => {
      this.tagDropdown.appendChild(elem);
    })
  }

  displayValidationError(validationErrors) {
    let labels = this.getElement('#contact-form').querySelectorAll('label');
    let label;
    let validationError;
    let message;

    for (let i = 0; i < labels.length; i += 1) {
      label = labels[i];
      validationError = validationErrors[label.getAttribute('for')];
      if (validationError) {
        message = this.createElement('p');
        message.classList.add('error-message');
        message.textContent = validationError;
        label.appendChild(message);
      }
    }
  }

  clearValidationErrors() {
    let errorMessages = document.querySelectorAll('.error-message');
    if (errorMessages) {
      for (let i = 0; i < errorMessages.length; i += 1) {
        errorMessages[i].remove();
      }
    }
  }

  clearAddContactForm() {
    this.addContactForm.querySelector('#full_name').value = '';
    this.addContactForm.querySelector('#email').value = '';
    this.addContactForm.querySelector('#phone_number').value = '';
    this.addContactForm.querySelector('#tags').value = '';
  }

  clearAddTagForm() {
    this.addTagsForm.querySelector('#new-tag').value = '';
  }

  clearMainDisplay() {
    // this._resetSearchInput();
    this.clearElementChildren(this.main);
  }

  clearElementChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
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


  // Event listeners

  bindSearchContact(handler) {
    this.searchInput.addEventListener('keyup', event => {
      event.preventDefault();
      handler(this._searchInputText)
    })
  }

  bindFilterByTag(handler) {
    this.tagDropdown.addEventListener('change', event => {
      event.preventDefault();
      let name = event.target.options[event.target.options.selectedIndex].value
      handler(name)
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

  bindAddContact(handler) {
    this.addContactButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    })
  }

  bindCancelAddContact(handler) {
    this.addContactForm.querySelector('#cancel-add-contacts-btn').addEventListener('click', event => {
      event.preventDefault();
      handler();
    })
  }

  bindSubmitAddContact(handler) {
    this.addContactForm.addEventListener('submit', event => {
      event.preventDefault();
      let contact = this.prepareFormData(this.addContactForm.querySelector('form'));
      handler(contact);
    })
  }

  bindSubmitAddTag(handler) {
    this.addTagsForm.addEventListener('submit', event => {
      event.preventDefault();
      let tag = Object.values(this.prepareFormData(this.addTagsForm))[0];
      handler(tag)
    })
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

  formDataToJson(formData) {
    let json = {};
    for (let pair of formData.entries()) {
      if (json[pair[0]]) {
        json[pair[0]] = [json[pair[0]], pair[1]].join(',');
      } else {
        json[pair[0]] = pair[1];
      }
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

  populateFormWithTags(form, tags) {
    let select = form.querySelector('select');
    this.clearElementChildren(select);

    let tagOptions = [];
    let option;
    Object.keys(tags).forEach(tag => {
      option = this.createOptionElement(tag, tag);
      tagOptions.push(option);
    })

    tagOptions.forEach(tagOption => {
      select.append(tagOption);
    })
  }

  createOptionElement(value, text) {
    let option = this.createElement('option');
    option.value = value;
    option.textContent = text;
    return option;
  }

  markSelectedTags(form, contact) {
    let contactTags = contact.tags.split(',');
    let options = form.querySelector('select').querySelectorAll('option');
    let option;
    for (let i = 0; i < options.length; i += 1) {
      option = options[i];
      if (contactTags.includes(option.value)) {
        option.setAttribute('selected', true);
      }
    }
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
