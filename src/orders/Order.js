export class Order {
  constructor(id, product, customer) {
    this.id = id;
    this.product = product;
    this.customer = customer;
    this.status = 'PENDING'; // PENDING, DISPATCHED, COMPLETED
  }
}