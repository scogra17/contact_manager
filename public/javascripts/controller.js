export default class Controller {
  // should know nothing about the DOM, HTML elements, CSS, etc.

  constructor(model, view) {
    this.model = model
    this.view = view

    // Display initial contacts
    this.onContactsListChanged();
    this.bindEvents();
  }

  bindEvents() {
    this.model.bindContactsListChanged(this.onTodoListChanged)
    this.view.bindSearchContact(this.handleSearchContacts);
    this.view.bindEditContact(this.handleEditContact);
    this.view.bindDeleteContact(this.handleDeleteContact);
  }

  onContactsListChanged = async () => {
    await this.model.getContacts();
    this.view.displayContacts(this.model.contacts);
  }

  // Using arrow function here allow this to be called
  // from the View using the `this` context of the controller
  handleSearchContacts = (searchText) => {
    this.view.displayContacts(this.model.contacts.filter(contact => {
      return contact.full_name.toLowerCase().includes(searchText.toLowerCase());
    })
  )}

  handleEditContact = (id) => {
    this.view.displayForm()
  }

  handleDeleteContact = (id) => {
    this.model.deleteContact(id);
    this.view.displayContacts(this.model.contacts)
  }
}
