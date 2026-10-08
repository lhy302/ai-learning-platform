export class OrderFSM {
  constructor() {
    this.state = 'PENDING';
    this.transitions = {
      PENDING: { PAY: 'PAID', CANCEL: 'CANCELLED' },
      PAID: { SHIP: 'SHIPPED', REFUND: 'REFUNDED' },
      SHIPPED: { COMPLETE: 'COMPLETED' },
      COMPLETED: {},
      CANCELLED: {},
      REFUNDED: {}
    };
  }
  transition(action) {
    const allowed = this.transitions[this.state];
    if (!allowed || !allowed[action]) {
      throw new Error("Invalid transition: " + action + " in state " + this.state);
    }
    this.state = allowed[action];
    return this.state;
  }
}