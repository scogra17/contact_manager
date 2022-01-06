const DOMAIN = 'http://localhost:3000';

export default class Model {
  // only handles data and modifying data
  // has no knowledge of what's modifying it
  // has no knowledge of how data will be displayed
  // sufficient for CRUD app CLI

  // should know nothing about the DOM, HTML elements, CSS, etc.
  constructor() {
    this.contacts = [];
    this.tags = {};
    this.getContacts();
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

  async updateTags() {
    this.contacts.forEach(contact => {
      let tags = contact.tags.split(',');
      tags.forEach(tag => {
        if (!this.tags[tag]) {
          this.tags[tag] = true;
        }
      })
    })
  }

  addTag(tag) {
    if (!this.tags[tag]) {
      this.tags[tag] = true;
    }
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
      full_name: contact.full_name,
      email: contact.email,
      phone_number: contact.phone_number,
      tags: contact.tags,
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
    let json = JSON.stringify(contact);

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

  bindContactsListChanged(callback) {
    this.onContactsListChanged = callback;
  }
}
