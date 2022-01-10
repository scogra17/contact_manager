class Contacts {
  constructor(contacts) {
    this.contacts = contacts || [];
  }

  isEmpty() {
    return this.contacts.length === 0;
  }

  getContact(id) {
    const contact = this.contacts.filter((c) => c.id === id);
    if (contact) return contact[0];
  }

  getAllUniqueContactsTags() {
    const tags = {};
    this.contacts.forEach((contact) => {
      contact.tags.forEach((tag) => { if (!tags[tag]) { tags[tag] = true; } });
    });
    return tags;
  }
}
