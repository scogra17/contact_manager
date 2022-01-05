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
    this.view.displayContacts(this.model.contacts);
  }

  bindEvents() {
    this.model.bindContactsListChanged(this.getAndDisplayContacts);
    this.view.bindSearchContact(this.handleSearchContacts);
    this.view.bindEditContact(this.handleEditContact);
    this.view.bindDeleteContact(this.handleDeleteContact);
    this.view.bindSubmitEditContact(this.handleSubmitEditContact);
    this.view.bindCancelEditContact(this.handleCancelEditContact);
    this.view.bindAddContact(this.handleAddContact);
    this.view.bindCancelAddContact(this.handleCancelAddContact);
    this.view.bindSubmitAddContact(this.handleSubmitAddContact);
  }

  // Using arrow function here allow this to be called
  // from the View using the `this` context of the controller
  handleSearchContacts = (searchText) => {
    this.view.displayContacts(this.model.contacts.filter(contact => {
      return contact.full_name.toLowerCase().includes(searchText.toLowerCase());
    })
  )}

  handleDeleteContact = (id) => {
    this.model.deleteContact(id);
  }

  handleEditContact = async (id) => {
    let contact = await this.model.getContact(id);
    this.view.clearMainDisplay();
    this.view.displayEditContactForm(contact);
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
    this.view.displayAddContactForm();
  }

  handleCancelAddContact = () => {
    this.view.displayHomeDOMElements();
    this.getAndDisplayContacts();
  }

  handleSubmitAddContact = (contact) => {
    this.model.addContact(contact);
    this.view.displayHomeDOMElements();
  }
}
