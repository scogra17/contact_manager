"use strict";
const DOMAIN = 'http://localhost:3000';

class Model {
  constructor() {
    this.contacts = [];
    this.tags = {};
    // this.getContacts();
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

  async getContacts() {
    let response = await fetch(
      DOMAIN + '/api/contacts', {
        method: 'GET',
        headers: { 'Response-Type': 'json' }
      })

    let contacts = await response.json();
    return contacts;
  }

  async getContact(id) {
    let response = await fetch(DOMAIN + `/api/contacts/${id}`, {
      method: 'GET',
      headers: { 'Response-Type': 'json' }})

    let contact = await response.json();
    return contact;
  }

  async editContact(contact) {
    let json = JSON.stringify({
      id: contact.id,
      full_name: contact.full_name || contact.fullName,
      email: contact.email,
      phone_number: contact.phone_number || contact.phoneNumber,
      tags: contact.tags.join(',') || '',
    })

    let response = await fetch(DOMAIN + `/api/contacts/${contact.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Response-Type': 'json'
      },
      body: json,
    })

    await response.json();
    this.onContactsListChanged();
  }

  async addContact(contact) {
    let json = JSON.stringify({
      full_name: contact.full_name || contact.fullName,
      email: contact.email,
      phone_number: contact.phone_number || contact.phoneNumber,
      tags: contact.tags.join(',') || '',
    })

    let response = await fetch(DOMAIN + '/api/contacts', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Response-Type': 'json'
      },
      body: json,
    })

    await response.json()
    this.onContactsListChanged();
  }

  async deleteContact(id) {
    await fetch(DOMAIN + `/api/contacts/${id}`, {
      method: 'DELETE'})

    this.onContactsListChanged();
  }

  bindContactsListChanged(handler) {
    this.onContactsListChanged = handler;
  }

  contactTags(contacts) {
    let contactTags = [];
    contacts.forEach(contact => {
      if (!contact.tags) return;
      let tags = contact.tags.split(',');
      tags.forEach(tag => {
        if (!contactTags[tag]) {
          contactTags[tag] = true;
        }
      })
    })
    return contactTags;
  }

  updateTags() {
    Object.assign(this.tags, this.contactTags(this.contacts));
  }

  addTag(tag) {
    if (!this.tags[tag]) {
      this.tags[tag] = true;
    }
  }

  addTags(tags) {
    Object.assign(this.tags, tags);
  }
}
