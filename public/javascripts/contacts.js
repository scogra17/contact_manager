"use strict";

class Contacts {
  constructor(contacts) {
    this.contacts = contacts || [];
  }

  isEmpty() {
    return this.contacts.length === 0;
  }

  addContact() {
    this.contacts.push(contact);
  }

  getContact(id) {
    let contact = this.contacts.filter(contact => contact.id === id);
    if (contact) return contact[0];
  }

  getAllUniqueContactsTags() {
    let tags = {};
    this.contacts.forEach(contact => {
      if (contact.tags) {
        contact.tags.forEach(tag => {
          if (!tags[tag]) { tags[tag] = true }
        })
      }
    })
    return tags;
  }
}
