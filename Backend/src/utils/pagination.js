export default function getPagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function getSort(query, defaultSort = 'created_at', defaultOrder = 'DESC') {
  const sortBy = query.sortBy || defaultSort;
  const sortOrder = (query.sortOrder || defaultOrder).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  return { sortBy, sortOrder };
}
