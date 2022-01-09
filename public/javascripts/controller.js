"use strict";

class Controller {
  constructor(model, view, contacts) {
    this.model = model
    this.view = view
    this.contacts = contacts

    this.searchTerm = '';
    this.tagFilter = '';
    this.filteredContacts = this.filterContacts();

    this.getAndDisplayContacts();
    this.bindEvents();
  }

  filterContacts() {
    return new Contacts(
      this.contacts.contacts.filter(contact => {
        if (!this.tagFilter) return true;
        return contact.containsTag(this.tagFilter);
      }).filter(contact => {
        if (!this.searchTerm) return true;
        return contact.matchesSearch(this.searchTerm);
      })
    )
  }

  modelContactsToEntityContacts(contacts) {
    return new Contacts(
      contacts.map(contact => this.modelContactToEntityContact(contact)));
  }

  modelContactToEntityContact(contact) { return new Contact(contact) };

  getAndDisplayContacts = async () => {
    this.model.contacts = await this.model.getContacts();
    this.contacts = this.modelContactsToEntityContacts(this.model.contacts);
    this.model.addTags(this.contacts.getAllUniqueContactsTags());

    this.filteredContacts = this.filterContacts();
    this.view.displayTags(this.filteredContacts.getAllUniqueContactsTags());
    this.view.displayContacts(this.filteredContacts);
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

  handleSearchContacts = (searchText) => {
    this.searchTerm = searchText;
    this.view.displayContacts(this.filterContacts());
  }

  handleFilterByTag = (tag) => {
    this.tagFilter = tag;
    this.view.displayContacts(this.filterContacts());
  }

  handleDeleteContact = (id) => {
    if (confirm('Do you want to delete the contact?')) {
      this.model.deleteContact(id);
    }
  }

  handleEditContact = (id) => {
    let contact = this.contacts.getContact(id);
    this.view.displayEditContactForm(contact, this.model.tags);
    this.view.displayAddTagForm();
  }

  handleSubmitEditContact = (contactJSON) => {
    let contact = new Contact(contactJSON);
    if (contact.isValid()) {
      this.model.editContact(contact);
      this.view.displayHomeElements();
    } else {
      this.view.clearValidationErrors();
      this.view.displayValidationError(contact.validationErrors());
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

  handleSubmitAddContact = (contactJSON) => {
    let contact = new Contact(contactJSON);
    if (contact.isValid()) {
      this.model.addContact(contact);
      this.view.clearAddContactForm(); // TODO: delete? redundant?
      this.view.displayHomeElements();
    } else {
      this.view.clearValidationErrors();
      this.view.displayValidationError(contact.validationErrors());
    }
  }

  handleSubmitAddTag = (tag) => {
    this.model.addTag(tag);
    this.view.displayNewTagOption(tag);
    this.view.clearAddTagForm();
  }
}
