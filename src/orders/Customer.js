export class Customer {
  constructor(id, dropoffPos) {
    this.id = id;
    this.name = `Customer #${id}`;
    this.dropoffPos = dropoffPos;
  }
}