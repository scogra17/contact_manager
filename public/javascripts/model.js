const DOMAIN = 'http://localhost:3000';

export default class Model {
  // only handles data and modifying data
  // has no knowledge of what's modifying it
  // has no knowledge of how data will be displayed
  // sufficient for CRUD app CLI

  // should know nothing about the DOM, HTML elements, CSS, etc.
  constructor() {
    this.contacts = [];
    this.tags = [];
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

  async getContact(id) {
    let response = await fetch(DOMAIN + `/api/contacts/${id}`, {
      method: 'GET',
      headers: { 'Response-Type': 'json' }})

    let contact = await response.json();
    return contact;
  }

  async editContact(id, full_name, email, phone_number, tags) {
    let json = JSON.stringify({
      id: id,
      full_name: full_name,
      email: email,
      phone_number: phone_number,
      tags: tags,
    })

    let response = await fetch(DOMAIN + `/api/contacts/${id}`, {
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

  async addContact(full_name, email, phone_number, tags) {
    let json = JSON.stringify({
      full_name: full_name,
      email: email,
      phone_number: phone_number,
      tags: tags,
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

  bindContactsListChanged(callback) {
    this.onContactsListChanged = callback;
  }
}
