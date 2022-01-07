import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';

class ContactManager {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller(this.model, this.view);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ContactManager();
});
