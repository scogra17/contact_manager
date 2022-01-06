export default class Controller {
  // should know nothing about the DOM, HTML elements, CSS, etc.

  constructor(model, view) {
    this.model = model
    this.view = view

    this.getAndDisplayContacts();
    this.bindEvents();
  }

  getAndDisplayContacts = async () => {
    this.model.contacts = await this.model.getContacts();
    this.model.updateTags();
    this.view.displayTags(this.model.tags);
    this.view.displayContacts(this.model.contacts);
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
    this.view.displayContacts(this.model.contacts.filter(contact => {
      return contact.full_name.toLowerCase().includes(searchText.toLowerCase());
    })
  )}

  handleFilterByTag = (tag) => {
    if (this.model.tags[tag]) {
      this.view.displayContacts(this.model.contacts.filter(contact => {
        return contact.tags.split(',').includes(tag);
      }))
    } else {
      this.view.displayContacts(this.model.contacts);
    }
  }

  handleDeleteContact = (id) => {
    this.model.deleteContact(id);
  }

  handleEditContact = async (id) => {
    let contact = await this.model.getContact(id);
    this.view.clearMainDisplay();
    this.view.displayEditContactForm(contact, this.model.tags);
    this.view.displayAddTagForm();
  }

  handleSubmitEditContact = (contact) => {
    this.model.editContact(contact);
    this.view.displayHomeDOMElements();
  }

  handleCancelEditContact = () => {
    this.view.displayHomeDOMElements();
    this.getAndDisplayContacts();
  }

  handleAddContact = () => {
    this.view.clearMainDisplay();
    this.view.displayAddContactForm(this.model.tags);
    this.view.displayAddTagForm();
  }

  handleCancelAddContact = () => {
    this.view.displayHomeDOMElements();
    this.getAndDisplayContacts();
  }

  handleSubmitAddContact = (contact) => {
    this.model.addContact(contact);
    this.view.clearAddContactForm();
    this.view.displayHomeDOMElements();
  }

  handleSubmitAddTag = (tag) => {
    this.model.addTag(tag);
    this.view.displayTag(tag);
    this.view.clearAddTagForm();
  }
}
