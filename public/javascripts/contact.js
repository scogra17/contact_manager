"use strict";

const EMAIL_REGEXP = new RegExp('[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}', 'i'),
      PHONE_REGEXP = new RegExp('[0-9]{3}-[0-9]{3}-[0-9]{4}');

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
    } else if (!EMAIL_REGEXP.test(this.email)) {
      return 'Must be in the form username@server.domain';
    }
  }

  phoneNumberValidationError() {
    if (!this.phoneNumber) {
      return 'Must be greater than 0 characters';
    } else if (!PHONE_REGEXP.test(this.phoneNumber)) {
      return 'Must be in the form ###-###-####';
    }
  }
}
