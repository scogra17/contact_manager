export default class View {
  constructor() {
    this.contactTemplate = Handlebars.compile(document.querySelector('#contact-template').innerHTML);
    this.formTemplate = Handlebars.compile(document.querySelector('#form-template').innerHTML);

    this.createDOMElements();
    this.displayTitle();
    this.displayHomeDOMElements();
  }

  createDOMElements() {
    // root container elements
    this.main = document.querySelector('main');
    this.header = document.querySelector('header');

    // non-root container elements
    this.controlBar = this.createControlBar();
    this.formsContainer = this.createFormsContainer();

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
    // let elem = this.createElement('input');
    let elem = this.createElement({tag: 'input'})
    elem.type = 'text';
    elem.placeholder = 'Search';
    elem.name = 'search';
    return elem;
  }

  createTagDropdown() {
    let elem = this.createElement({tag: 'select'});
    elem.name = 'tags'
    return elem;
  }

  createControlBar() {
    let elem = this.createElement({tag: 'div', id: 'control-bar'});
    return elem;
  }

  createFormsContainer() {
    let elem = this.createElement({tag: 'div', id: 'forms-container'});
    return elem;
  }

  createButton(text) {
    let elem = this.createElement({tag: 'a', attributes: {'href': '#'}});
    elem.setAttribute('href', '#');
    elem.textContent = text;
    return elem;
  }

  createContactsList() {
    let elem = this.createElement({tag: 'ul', id: 'contacts-list'});
    return elem;
  }

  createEditContactForm() {
    return this.createContactForm('Edit contact');
  }

  createAddContactForm() {
    return this.createContactForm('Add contact');
  }

  createAddTagsForm() {
    let elem = this.createElement({tag: 'form', id: 'tag-form'});
    let label = this.createElement({tag: 'label', attributes: {'for': 'new-tag'}});
    label.textContent = 'Add new tag';
    let textInput = this.createElement({tag: 'input', id: 'new-tag', attributes: {'type': 'text', 'name': 'new-tag', 'placeholder': 'New tag...'}});
    let submitInput = this.createElement({tag: 'input', attributes: {'type': 'submit', 'value': 'Add tag'}});

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
    this.clearElementChildren(this.formsContainer);
    this.populateFormWithJSON(this.editContactForm, contact);
    this.populateFormWithTags(this.editContactForm, tags);
    this.markSelectedTags(this.editContactForm, contact);
    this.formsContainer.append(this.editContactForm);
    this.main.append(this.formsContainer);
  }

  displayAddContactForm(tags) {
    this.clearElementChildren(this.formsContainer);
    this.populateFormWithTags(this.addContactForm, tags);
    this.formsContainer.append(this.addContactForm);
    this.main.append(this.formsContainer);
  }

  displayTag(tag) {
    let option = this.createOptionElement(tag, tag);
    this.getElement('select').append(option);
  }

  displayAddTagForm() {
    this.formsContainer.append(this.addTagsForm);
  }

  displayHomeDOMElements() {
    this.clearMainDisplay();
    this.controlBar.append(
      this.addContactButton,
      this.searchInput,
      this.tagDropdown,
    )
    this.main.append(
      this.controlBar,
      this.contactsList);
    this.displayContacts();
  }

  displayTags(tags) {
    this.clearElementChildren(this.tagDropdown);

    let placeholder = this.createElement({tag: 'option', attributes: {'value': '', 'selected': null}});
    placeholder.textContent = "Filter by tag"

    let elems = [placeholder];
    let option;
    for (const tag in tags) {
      option = this.createElement({tag: 'option', attributes: {'value': tag}});
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
        message = this.createElement({tag: 'p', classes: ['error-message']});
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
      const p = this.createElement({tag: 'p'});
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
    let elem = this.createElement({tag: 'div', classes: ['contact-form']});
    let heading = this.createTitle(title, 'h3');
    elem.innerHTML = this.formTemplate(contact);
    elem.insertBefore(heading, elem.firstChild)
    return elem;
  }

  createTitle(text, type) {
    let elem = this.createElement({tag: type});
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
    let option = this.createElement({tag: 'option', attributes: {'value': value}});
    option.textContent = text;
    return option;
  }

  markSelectedTags(form, contact) {
    if (!contact.tags) return;
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

  createElement(elem) {
    const element = document.createElement(elem.tag)
    if (elem.classes) elem.classes.forEach(c => element.classList.add(c))
    if (elem.id) element.id = elem.id;
    if (elem.attributes) Object.keys(elem.attributes).forEach(a => element.setAttribute(a, elem.attributes[a]))
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
