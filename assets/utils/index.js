/**
 * 生成默认分页对象
 */
export function getDefaultPagination() {
  return {
    pageNo: 1,
    pageSize: 20,
    total: 0,
  };
}

/**
 * 评分保留一位小数
 */
export function formatRate(rate) {
  return typeof rate === 'number' ? rate.toFixed(1) : '';
}
