"use strict";

class Contact {
  constructor(contact) {
    this.id = contact.id;
    this.fullName = contact.full_name || contact.fullName;
    this.email = contact.email;
    this.phoneNumber = contact.phone_number || contact.phoneNumber;
    this.tags = contact.tags ? contact.tags.split(',') : [];
  }

  containsTag(tag) {
    return this.tags.includes(tag);
  }

  matchesSearch(searchTerm) {
    return this.fullName.toLowerCase().includes(searchTerm.toLowerCase());
  }

  isValid() {
    return !this.fullNameValidationError()
      && !this.emailValidationError()
      && !this.phoneNumberValidationError();
  }

  validationErrors() {
    return {
      'fullName': this.fullNameValidationError(),
      'email': this.emailValidationError(),
      'phoneNumber': this.phoneNumberValidationError(),
    }
  }

  fullNameValidationError() {
    if (!this.fullName) {
      return 'Must be greater than 0 characters'
    }
  }

  emailValidationError() {
    if (!this.email) {
      return 'Must be greater than 0 characters';
    } else if (!this.email.includes('@')) {
      return 'Must contain @ symbol';
    }
  }

  phoneNumberValidationError() {
    if (!this.phoneNumber) {
      return 'Must be greater than 0 characters';
    } else if (!this.phoneNumber.includes('-')) {
      return 'Must be in the form ###-###-####';
    }
  }
}
