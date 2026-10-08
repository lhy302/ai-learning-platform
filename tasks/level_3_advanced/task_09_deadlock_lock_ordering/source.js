export async function transferFunds(accountA, accountB, amount) {
  // BUG: 按参数顺序加锁。当 A->B 和 B->A 并发时，A 拿了 A 的锁等 B，B 拿了 B 的锁等 A，死锁！
  await accountA.mutex.lock();
  try {
    await accountB.mutex.lock();
    try {
      accountA.balance -= amount;
      accountB.balance += amount;
      return true;
    } finally {
      accountB.mutex.unlock();
    }
  } finally {
    accountA.mutex.unlock();
  }
}