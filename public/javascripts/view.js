export default class View {
  constructor() {
    this.app = document.querySelector('#root');
    this.contactTemplate = Handlebars.compile(document.querySelector('#contact-template').innerHTML);

    this.title = this.createElement('h1');
    this.title.textContent = 'Contact Manager';
    this.app.append(this.title);

    this.searchInput = this.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.placeholder = 'Search';
    this.searchInput.name = 'search';
    this.app.append(this.searchInput);

    this.contactsList = this.createElement('ul', 'contacts-list');
    this.app.append(this.contactsList);

    this.displayContacts();
  }

  // called every time a contact is changed, added or removed
  // called with `contacts` from Model to keep the view in sync with the Model
  displayContacts(contacts = []) {
    while (this.contactsList.firstChild) {
      this.contactsList.removeChild(this.contactsList.firstChild);
    }

    if (contacts.length === 0) {
      const p = this.createElement('p');
      p.textContent = "There are no contacts.";
      this.contactsList.append(p);
    } else {
      let template = contacts.map(contact => {
        return this.contactTemplate(contact);
      })
      this.contactsList.innerHTML = template.join("");
    }
  }

  bindSearchContact(handler) {
    this.searchInput.addEventListener('keyup', event => {
      event.preventDefault();
      handler(this._searchInputText)
    })
  }

  bindDeleteContact(handler) {
    this.contactsList.addEventListener('click', event => {
      if (event.target.classList.contains('delete')) {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    })
  }

  bindEditContact(handler) {
    this.contactsList.addEventListener('click', event => {
      event.preventDefault();
      if (event.target.classList.contains('edit')) {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    })
  }

  createElement(tag, className) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)

    return element
  }

  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }

  _resetSearchInput() {
    this.searchInput.value = ''
  }

  get _searchInputText() {
    return this.searchInput.value
  }
}
