"use strict";
const DOMAIN = 'http://localhost:3000';

class Model {
  constructor() {
    this.contacts = [];
    this.tags = {};
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
    let response = await fetch(DOMAIN + `/api/contacts/${contact.id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Response-Type': 'json'
      },
      body: JSON.stringify(contact),
    })
    await response.json();
    this.onContactsListChanged();
  }

  async addContact(contact) {
    let response = await fetch(DOMAIN + '/api/contacts', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Response-Type': 'json'
      },
      body: JSON.stringify(contact),
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

  addTag(tag) { if (!this.tags[tag]) { this.tags[tag] = true } };

  addTags(tags) {
    Object.assign(this.tags, tags);
  }
}
