"use strict";

class Controller {
  constructor(model, view, contacts) {
    this.model = model
    this.view = view
    this.contacts = contacts

    this.searchTerm = '';
    this.tagFilter = '';
    this.filteredContacts = this.filterContacts();

    this.displayFilteredContactsAndTags();
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
      contacts.map(contact => this.modelContactToEntityContact(contact))
    );
  }

  modelContactToEntityContact(contact) { return new Contact(contact) };

  entityContactToModelContact(contact) {
    let contactJSON = {
      full_name: contact.full_name || contact.fullName,
      email: contact.email,
      phone_number: contact.phone_number || contact.phoneNumber,
      tags: contact.tags.join(',') || '',
    }
    if (contact.id) contactJSON.id = contact.id;
    return contactJSON;
  }

  getAndMapContacts = async () => {
    this.model.contacts = await this.model.getContacts();
    this.contacts = this.modelContactsToEntityContacts(this.model.contacts);
  }

  displayFilteredContactsAndTags = async () => {
    await this.getAndMapContacts();
    this.model.addTags(this.contacts.getAllUniqueContactsTags());
    this.filteredContacts = this.filterContacts();
    this.view.displayTags(this.filteredContacts.getAllUniqueContactsTags());
    this.view.displayContacts(this.filteredContacts);
  }

  displayCachedFilteredContactsAndTags() {
    this.view.displayTags(this.filteredContacts.getAllUniqueContactsTags());
    this.view.displayContacts(this.filteredContacts);
  }

  bindEvents() {
    this.model.bindContactsListChanged(this.displayFilteredContactsAndTags);
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
      this.model.editContact(this.entityContactToModelContact(contact));
      this.view.displayHomeElements();
    } else {
      this.view.displayValidationErrors(contact.validationErrors());
    }
  }

  handleCancelEditContact = () => {
    this.view.displayHomeElements();
    this.displayCachedFilteredContactsAndTags();
  }

  handleAddContact = () => {
    this.view.displayAddContactForm(this.model.tags);
    this.view.displayAddTagForm();
  }

  handleCancelAddContact = () => {
    this.view.displayHomeElements();
    this.displayCachedFilteredContactsAndTags();
  }

  handleSubmitAddContact = (contactJSON) => {
    let contact = new Contact(contactJSON);
    if (contact.isValid()) {
      this.model.addContact(this.entityContactToModelContact(contact));
      this.view.displayHomeElements();
    } else {
      this.view.displayValidationErrors(contact.validationErrors());
    }
  }

  handleSubmitAddTag = (tag) => {
    this.model.addTag(tag);
    this.view.displayNewTagOption(tag);
  }
}
