export class OrderFSM {
  constructor() {
    this.state = 'PENDING';
  }
  transition(action) {
    // BUG: 脆弱的散乱分支，缺少前置状态严格限制！
    if (action === 'PAY' && this.state === 'PENDING') this.state = 'PAID';
    else if (action === 'SHIP') this.state = 'SHIPPED';
    else if (action === 'COMPLETE') this.state = 'COMPLETED';
    else if (action === 'CANCEL') this.state = 'CANCELLED';
    else if (action === 'REFUND') this.state = 'REFUNDED'; // 漏洞：PENDING 直接被退款！
    else throw new Error("Invalid transition: " + action);
    return this.state;
  }
}