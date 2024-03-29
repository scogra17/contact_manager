class Controller {
  constructor(model, view, contacts) {
    this.model = model;
    this.view = view;
    this.contacts = contacts;

    this.searchTerm = '';
    this.tagFilter = '';

    this.displayFilteredContactsAndTags();
    this.bindEvents();
  }

  filterContacts() {
    return new Contacts(
      this.contacts.contacts.filter((contact) => {
        if (!this.tagFilter) return true;
        return contact.containsTag(this.tagFilter);
      }).filter((contact) => {
        if (!this.searchTerm) return true;
        return contact.matchesSearch(this.searchTerm);
      }),
    );
  }

  resetFilters() {
    this.searchTerm = '';
    this.tagFilter = '';
  }

  modelContactsToEntityContacts(contacts) {
    return new Contacts(
      contacts.map((contact) => this.modelContactToEntityContact(contact)),
    );
  }

  modelContactToEntityContact(contact) { return new Contact(contact); }

  entityContactToModelContact(contact) {
    const contactJSON = {
      full_name: contact.full_name || contact.fullName,
      email: contact.email,
      phone_number: contact.phone_number || contact.phoneNumber,
      tags: contact.tags.join(',') || '',
    };
    if (contact.id) contactJSON.id = contact.id;
    return contactJSON;
  }

  getAndMapContactsAndTags = async () => {
    this.model.contacts = await this.model.getContacts();
    this.contacts = this.modelContactsToEntityContacts(this.model.contacts);
    this.model.addTags(this.contacts.getAllUniqueContactsTags());
  };

  displayFilteredContactsAndTags = async () => {
    await this.getAndMapContactsAndTags();
    this.view.displayResetTags(this.contacts.getAllUniqueContactsTags());
    this.view.displayContacts(
      this.filterContacts(),
      this.contacts.isEmpty(),
      { searchTerm: this.searchTerm, tagFilter: this.tagFilter },
    );
  };

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
    this.view.displayContacts(
      this.filterContacts(),
      this.contacts.isEmpty(),
      { searchTerm: this.searchTerm, tagFilter: this.tagFilter },
    );
  };

  handleFilterByTag = (tag) => {
    this.tagFilter = tag;
    this.view.displayContacts(
      this.filterContacts(),
      this.contacts.isEmpty(),
      { searchTerm: this.searchTerm, tagFilter: this.tagFilter },
    );
  };

  handleDeleteContact = (id) => {
    if (confirm('Do you want to delete the contact?')) {
      this.model.deleteContact(id);
      this.view.clearSearchInput();
      this.resetFilters();
    }
  };

  handleEditContact = (id) => {
    this.resetFilters();
    const contact = this.contacts.getContact(id);
    this.view.displayEditContactForm(contact, this.model.tags);
    this.view.displayAddTagForm();
  };

  handleSubmitEditContact = (contactJSON) => {
    const contact = new Contact(contactJSON);
    if (contact.isValid()) {
      this.model.editContact(this.entityContactToModelContact(contact));
      this.view.clearAddTagForm();
      this.view.displayHomeElements();
      this.displayFilteredContactsAndTags();
    } else {
      this.view.displayValidationErrors(contact.validationErrors());
    }
  };

  handleCancelEditContact = () => {
    this.view.clearAddTagForm();
    this.view.displayHomeElements();
    this.displayFilteredContactsAndTags();
  };

  handleAddContact = () => {
    this.resetFilters();
    this.view.displayAddContactForm(this.model.tags);
    this.view.displayAddTagForm();
  };

  handleSubmitAddContact = (contactJSON) => {
    const contact = new Contact(contactJSON);
    if (contact.isValid()) {
      this.model.addContact(this.entityContactToModelContact(contact));
      this.view.clearAddTagForm();
      this.view.displayHomeElements();
      this.displayFilteredContactsAndTags();
    } else {
      this.view.displayValidationErrors(contact.validationErrors());
    }
  };

  handleCancelAddContact = () => {
    this.view.clearAddContactForm();
    this.view.clearAddTagForm();
    this.view.displayHomeElements();
    this.displayFilteredContactsAndTags();
  };

  handleSubmitAddTag = (tag) => {
    this.model.addTag(tag);
    this.view.displayNewTagOption(tag);
  };
}
