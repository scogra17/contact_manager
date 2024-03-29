class View {
  constructor() {
    this.contactTemplate = Handlebars.compile(document.querySelector('#contact-template').innerHTML);
    this.formTemplate = Handlebars.compile(document.querySelector('#form-template').innerHTML);
    this.addTagTemplate = Handlebars.compile(document.querySelector('#add-tag-template').innerHTML);

    this.createElements();
    this.displayTitle();
    this.displayHomeElements();
  }

  createElements() {
    // root container elements
    this.main = document.querySelector('main');
    this.header = document.querySelector('header');

    // non-root container elements
    this.controlBar = this.createControlBar();
    this.formsContainer = this.createFormsContainer();
    this.contactsList = this.createContactsList();
    this.editContactForm = this.createEditContactForm();
    this.addContactForm = this.createAddContactForm();
    this.addTagFormContainer = this.createAddTagForm();

    // non-container elements
    this.title = this.createTitle('h1', 'Contact Manager');
    this.editFormHeading = this.createTitle('h2', 'Edit Contact');
    this.addFormHeading = this.createTitle('h2', 'Add Contact');
    this.searchInput = this.createSearchInput();
    this.tagDropdown = this.createTagDropdown();
    this.addContactButton = this.createAddContactButton();
    this.noContactsMessage = this.createNoContactsMessage();
    this.filterTagsPlaceholder = this.createFilterTagsPlaceholder();
    this.cancelEditContactButton = this.editContactForm.querySelector('#cancel-contacts-btn');
    this.cancelAddContactButton = this.addContactForm.querySelector('#cancel-contacts-btn');
    this.addTagForm = this.addTagFormContainer.querySelector('form');
  }

  createControlBar() {
    return this.createElement({ tag: 'div', id: 'control-bar' });
  }

  createAddContactButton() {
    return this.createElement({
      tag: 'a',
      classes: ['btn'],
      textContent: 'Add Contact',
      attributes: { href: '#' },
    });
  }

  createSearchInput() {
    return this.createElement({
      tag: 'input',
      attributes: { type: 'text', name: 'search', placeholder: 'Search' },
    });
  }

  createTagDropdown() {
    return this.createElement({ tag: 'select', attributes: { name: 'tags' } });
  }

  createFormsContainer() {
    return this.createElement({ tag: 'div', id: 'forms-container' });
  }

  createContactsList() {
    return this.createElement({ tag: 'ul', id: 'contacts-list' });
  }

  createEditContactForm() { return this.createContactForm('Save'); }

  createAddContactForm() { return this.createContactForm('Save new contact'); }

  createAddTagForm() {
    const elem = this.createElement({ tag: 'div', classes: ['tag-form'] });
    elem.innerHTML = this.addTagTemplate();
    return elem;
  }

  createNoContactsMessage() {
    return this.createElement({ tag: 'p', textContent: 'There are no contacts.' });
  }

  createNoContactsWithFilterMessage(searchTerm, tagFilter) {
    let message = '';
    const textContent = [];
    if (searchTerm) { textContent.push(`that start with <strong>${searchTerm}</strong>`); }
    if (tagFilter) { textContent.push(`that have the tag <strong>${tagFilter}</strong>`); }
    message = `There are no contacts that ${textContent.join(' and ')}.`;
    return this.createElement({ tag: 'p', innerHTML: message });
  }

  createFilterTagsPlaceholder() {
    return this.createElement({
      tag: 'option',
      textContent: 'Filter by tag',
      attributes: { value: '', selected: null },
    });
  }

  displayTitle() { this.header.append(this.title); }

  displayHomeElements() {
    this.clearElementChildren(this.main);
    this.clearSearchInput();
    this.controlBar.append(this.addContactButton, this.searchInput, this.tagDropdown);
    this.main.append(this.controlBar, this.contactsList);
  }

  displayContacts(contacts, noContacts = false, filters = {}) {
    this.clearElementChildren(this.contactsList);
    if (contacts.isEmpty()) {
      if (noContacts) {
        this.contactsList.append(this.noContactsMessage);
      } else {
        this.contactsList.append(
          this.createNoContactsWithFilterMessage(filters.searchTerm, filters.tagFilter),
        );
      }
    } else {
      const template = contacts.contacts.map((contact) => this.contactTemplate(contact));
      this.contactsList.innerHTML = template.join('');
    }
  }

  displayResetTags(tags) {
    this.clearElementChildren(this.tagDropdown);
    this.tagDropdown.appendChild(this.filterTagsPlaceholder);
    let option;
    Object.keys(tags).forEach((tag) => {
      option = this.createElement(
        { tag: 'option', textContent: tag, attributes: { value: tag } },
      );
      this.tagDropdown.appendChild(option);
    });
  }

  displayEditContactForm(contact, tags) {
    this.clearValidationErrors();
    this.clearElementChildren(this.main);
    this.clearElementChildren(this.formsContainer);

    this.populateContactFormContact(this.editContactForm, contact);
    this.populateContactFormTags(this.editContactForm, tags);
    this.markContactFormSelectedTags(this.editContactForm, contact);
    this.formsContainer.append(this.editContactForm);
    this.main.append(this.editFormHeading);
    this.main.append(this.formsContainer);
  }

  displayAddContactForm(tags) {
    this.clearValidationErrors();
    this.clearAddContactForm();
    this.clearElementChildren(this.main);
    this.clearElementChildren(this.formsContainer);

    this.populateContactFormTags(this.addContactForm, tags);
    this.formsContainer.append(this.addContactForm);
    this.main.append(this.addFormHeading);
    this.main.append(this.formsContainer);
  }

  displayAddTagForm() { this.formsContainer.append(this.addTagFormContainer); }

  displayNewTagOption(tag) {
    this.clearAddTagForm();
    const option = this.createOptionElement(tag, tag);
    document.querySelector('#tags')
      .insertBefore(option, document.querySelector('#tags').firstChild);
  }

  displayValidationErrors(errors) {
    this.clearValidationErrors();
    const labels = document.querySelector('#contact-form').querySelectorAll('label');
    let validationError;
    let message;

    labels.forEach((label) => {
      validationError = errors[label.getAttribute('for')];
      if (validationError) {
        message = this.createElement({ tag: 'p', textContent: `Invalid. ${validationError}`, classes: ['error-message'] });
        label.insertAdjacentElement('afterend', message);
      }
    });
  }

  clearElementChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  clearSearchInput() {
    this.searchInput.value = '';
  }

  clearValidationErrors() {
    const errorMessages = this.formsContainer.querySelectorAll('.error-message');
    if (errorMessages) errorMessages.forEach((e) => e.remove());
  }

  clearAddContactForm() {
    this.addContactForm.querySelector('#fullName').value = '';
    this.addContactForm.querySelector('#email').value = '';
    this.addContactForm.querySelector('#phoneNumber').value = '';
    this.addContactForm.querySelector('#tags').value = '';
  }

  clearAddTagForm() { this.addTagForm.querySelector('#new-tag').value = ''; }

  populateContactFormContact(form, contact) {
    let input;
    Object.keys(contact).forEach((k) => {
      input = form.querySelector(`#${k}`);
      if (input) input.value = contact[k];
    });
    form.id = contact.id;
  }

  populateContactFormTags(form, tags) {
    const selectElement = form.querySelector('#tags');
    this.clearElementChildren(selectElement);

    let option;
    Object.keys(tags).forEach((tag) => {
      option = this.createOptionElement(tag, tag);
      selectElement.append(option);
    });
  }

  markContactFormSelectedTags(form, contact) {
    if (!contact.tags) return;
    const options = form.querySelector('select').querySelectorAll('option');
    let option;
    for (let i = 0; i < options.length; i += 1) {
      option = options[i];
      if (contact.tags.includes(option.value)) {
        option.setAttribute('selected', true);
      }
    }
  }

  bindSearchContact(handler) {
    this.searchInput.addEventListener('keyup', (event) => {
      event.preventDefault();
      handler(this.searchInput.value);
    });
  }

  bindFilterByTag(handler) {
    this.tagDropdown.addEventListener('change', (event) => {
      event.preventDefault();
      handler(event.target.options[event.target.options.selectedIndex].value);
    });
  }

  bindDeleteContact(handler) {
    this.contactsList.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete')) {
        const contactID = parseInt(event.target.parentElement.id);
        handler(contactID);
      }
    });
  }

  bindEditContact(handler) {
    this.contactsList.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target.classList.contains('edit')) {
        const contactID = parseInt(event.target.parentElement.id);
        handler(contactID);
      }
    });
  }

  bindSubmitEditContact(handler) {
    this.editContactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const contact = this.prepareFormData(this.editContactForm.querySelector('form'));
      contact.id = this.editContactForm.id;
      handler(contact);
    });
  }

  bindCancelEditContact(handler) {
    this.cancelEditContactButton.addEventListener('click', (event) => {
      event.preventDefault();
      handler();
    });
  }

  bindAddContact(handler) {
    this.addContactButton.addEventListener('click', (event) => {
      event.preventDefault();
      handler();
    });
  }

  bindCancelAddContact(handler) {
    this.cancelAddContactButton.addEventListener('click', (event) => {
      event.preventDefault();
      handler();
    });
  }

  bindSubmitAddContact(handler) {
    this.addContactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const contact = this.prepareFormData(this.addContactForm.querySelector('form'));
      handler(contact);
    });
  }

  bindSubmitAddTag(handler) {
    this.addTagForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const tag = Object.values(this.prepareFormData(this.addTagForm))[0];
      handler(tag);
    });
  }

  // Helper methods

  createContactForm(saveButtonText, contact = {}) {
    const elem = this.createElement({ tag: 'div', classes: ['contact-form'] });
    elem.innerHTML = this.formTemplate(Object.assign(contact, { action: saveButtonText }));
    return elem;
  }

  createOptionElement(value, text) {
    const option = this.createElement({ tag: 'option', textContent: text, attributes: { value } });
    return option;
  }

  createTitle(type, text) { return this.createElement({ tag: type, textContent: text }); }

  formDataToJson(formData) {
    const json = {};
    for (const pair of formData.entries()) {
      if (json[pair[0]]) {
        json[pair[0]] = [json[pair[0]], pair[1]].join(',');
      } else {
        json[pair[0]] = pair[1];
      }
    }
    return json;
  }

  prepareFormData(form) {
    const formData = new FormData(form);
    const json = this.formDataToJson(formData);
    return json;
  }

  createElement(elem) {
    const element = document.createElement(elem.tag);
    if (elem.classes) elem.classes.forEach((c) => element.classList.add(c));
    if (elem.id) element.id = elem.id;
    if (elem.attributes) {
      Object.keys(elem.attributes).forEach((a) => {
        element.setAttribute(a, elem.attributes[a]);
      });
    }
    if (elem.textContent) element.textContent = elem.textContent;
    if (elem.innerHTML) element.innerHTML = elem.innerHTML;
    return element;
  }
}
