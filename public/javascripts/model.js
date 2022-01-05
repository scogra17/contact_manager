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

  bindContactsListChanged(callback) {
    this.onContactsListChanged = callback
  }

  getContacts() {
    return fetch(DOMAIN + '/api/contacts', {
      method: 'GET',
      headers: { 'Response-Type': 'json' }})
    .then((rawResponse) => rawResponse.json())
    .then(response => {
      this.contacts = response;
    })
  }

  getContact(id) {
    fetch(DOMAIN + `/api/contacts/${id}`, {
      method: 'GET',
      headers: { 'Response-Type': 'json' }})
    .then((rawResponse) => rawResponse.json())
    .then(response => {
      console.log(response);
    })
  }

  editContact(id, full_name, email, phone_number, tags) {
    let json = JSON.stringify({
      id: id,
      full_name: full_name,
      email: email,
      phone_number: phone_number,
      tags: tags,
    })

    fetch(DOMAIN + `/api/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Response-Type': 'json'
      },
      body: json,
    })
    .then(rawResponse => rawResponse.json())
    .then(response => {
      console.log(response)
    })
  }

  addContact(full_name, email, phone_number, tags) {
    let json = JSON.stringify({
      full_name: full_name,
      email: email,
      phone_number: phone_number,
      tags: tags,
    })

    fetch(DOMAIN + '/api/contacts', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Response-Type': 'json'
      },
      body: json,
    })
    .then(rawResponse => rawResponse.json())
    .then(response => {
      console.log(response)
    })
  }

  deleteContact(id) {
    fetch(DOMAIN + `/api/contacts/${id}`, {
      method: 'DELETE'})
    .then((rawResponse) => rawResponse.json())
    .then(response => {
      console.log(response);
    })
  }
}
