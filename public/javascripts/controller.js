export default class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view
    this.searchTerm = '';
    this.filterTag = '';

    this.getAndDisplayContacts();
    this.bindEvents();
  }

  filteredContacts() {
    let filteredContacts = Object.assign(this.model.contacts);
    if (this.searchTerm) {
      filteredContacts = filteredContacts.filter(contact => {
        return contact.full_name.toLowerCase().includes(this.searchTerm.toLocaleLowerCase());
      })
    }

    if (this.filterTag) {
      filteredContacts = filteredContacts.filter(contact => {
        return contact.tags && contact.tags.split(',').includes(this.filterTag);
      })
    }
    return filteredContacts;
  }

  getAndDisplayContacts = async () => {
    this.model.contacts = await this.model.getContacts();
    this.model.updateTags();
    this.view.displayTags(this.model.tags);
    this.view.displayContacts(this.filteredContacts());
  }

  bindEvents() {
    this.model.bindContactsListChanged(this.getAndDisplayContacts);
    this.view.bindSearchContact(this.handleSearchContacts);
    this.view.bindFilterByTag(this.handleFilterByTag);
    this.view.bindEditContact(this.handleEditContact);
    this.view.bindDeleteContact(this.handleDeleteContact);
    this.view.bindSubmitEditContact(this.handleSubmitEditContact);
    this.view.bindCancelEditContact(this.handleCancelEditContact);
    this.view.bindAddContact(this.handleAddContact);
    this.view.bindCancelAddContact(this.handleCancelAddContact);
    this.view.bindSubmitAddContact(this.handleSubmitAddContact);
    this.view.bindSubmitAddTag(this.handleSubmitAddTag);
  }

  // Using arrow function here allow this to be called
  // from the View using the `this` context of the controller
  handleSearchContacts = (searchText) => {
    this.searchTerm = searchText;
    this.view.displayContacts(this.filteredContacts());
  }

  handleFilterByTag = (tag) => {
    this.filterTag = tag;
    this.view.displayContacts(this.filteredContacts());
  }

  validateContact = (contact) => {
    let validationError = {};
    for (const k in contact) {
      if (k != "tags") {
        if (!contact[k]) {
          validationError[k] = 'Invalid. Please enter a value.'
        }
      }
    }
    return validationError;
  }

  handleDeleteContact = (id) => {
    this.model.deleteContact(id);
  }

  handleEditContact = async (id) => {
    let contact = await this.model.getContact(id);
    this.view.displayEditContactForm(contact, this.model.tags);
    this.view.displayAddTagForm();
  }

  handleSubmitEditContact = (contact) => {
    let validationError = this.validateContact(contact);
    if (!Object.keys(validationError).length) {
      this.model.editContact(contact);
      this.view.displayHomeElements();
    } else {
      this.view.clearValidationErrors();
      this.view.displayValidationError(validationError);
    }
  }

  handleCancelEditContact = () => {
    this.view.displayHomeElements();
    this.getAndDisplayContacts();
  }

  handleAddContact = () => {
    this.view.displayAddContactForm(this.model.tags);
    this.view.displayAddTagForm();
  }

  handleCancelAddContact = () => {
    this.view.displayHomeElements();
    this.getAndDisplayContacts();
  }

  handleSubmitAddContact = (contact) => {
    let validationError = this.validateContact(contact);
    if (!Object.keys(validationError).length) {
      this.model.addContact(contact);
      this.view.clearAddContactForm();
      this.view.displayHomeElements();
    } else {
      this.view.clearValidationErrors();
      this.view.displayValidationError(validationError);
    }
  }

  handleSubmitAddTag = (tag) => {
    this.model.addTag(tag);
    this.view.displayNewTagOption(tag);
    this.view.clearAddTagForm();
  }
}
