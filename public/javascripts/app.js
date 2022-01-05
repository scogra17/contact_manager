import Controller from './controller.js';
import Model from './model.js';
import View from './view.js';

class App {
  constructor() {
    this.model = new Model();
    this.view = new View();
    this.controller = new Controller(this.model, this.view);
  }
}

const app = new App();
console.log(app);
