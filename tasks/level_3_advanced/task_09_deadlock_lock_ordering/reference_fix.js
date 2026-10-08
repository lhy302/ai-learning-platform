export async function transferFunds(accountA, accountB, amount) {
  // 按照账户 ID 的严格字典序排序加锁，彻底打破死锁循环等待条件
  const [first, second] = accountA.id < accountB.id ? [accountA, accountB] : [accountB, accountA];

  await first.mutex.lock();
  try {
    await second.mutex.lock();
    try {
      accountA.balance -= amount;
      accountB.balance += amount;
      return true;
    } finally {
      second.mutex.unlock();
    }
  } finally {
    first.mutex.unlock();
  }
}