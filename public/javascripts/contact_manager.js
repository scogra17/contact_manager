class ContactManager {
  constructor() {
    this.contacts = new Contacts();
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller(this.model, this.view, this.contacts);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ContactManager();
});
