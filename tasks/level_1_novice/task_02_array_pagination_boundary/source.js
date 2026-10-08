export function paginate(items = [], page = 1, pageSize = 10) {
  const safePage = Math.max(1, page);
  const safeSize = Math.max(1, pageSize);
  const total = items.length;
  const totalPages = Math.ceil(total / safeSize);
  const start = (safePage - 1) * safeSize;
  const pagedItems = items.slice(start, start + safeSize);
  // BUG: 使用了 <=，导致刚好满页时最后一页被误判为还有下一页！
  const hasNext = (safePage * safeSize) <= total;
  return { items: pagedItems, page: safePage, totalPages, total, hasNext };
}