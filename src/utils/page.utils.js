const { SortByList, SortBy } = require("../enums/sort.enum");
const commonUtils = require("./common.utils");

class PageUtils {
  constructor(
    defaultLimit = 10,
    maxLimit = 100,
    defaultSort = "created_at",
    defaultSortBy = SortBy.DESC,
  ) {
    this.defaultLimit = defaultLimit;
    this.maxLimit = maxLimit;
    this.defaultSort = defaultSort;
    this.defaultSortBy = defaultSortBy;
  }

  // Get normalized pagination parameters
  getPagination(query = {}) {
    const page = commonUtils.toPositiveInteger(query.page, 1);

    const requestedLimit = commonUtils.toPositiveInteger(query.limit, this.defaultLimit);

    const limit = Math.min(requestedLimit, this.maxLimit);

    return {
      page,
      limit,
      offset: this.getOffset(page, limit),
    };
  }

  // Calculate offset for PostgreSQL
  getOffset(page, limit) {
    return page * limit;
  }

  // Normalize sorting parameters
  getSorting(query = {}, allowedSortFields = []) {
    const requestedSort = query.sort || this.defaultSort;

    const sortBy = String(query.sortBy || this.defaultSortBy).toLowerCase();

    const sort = allowedSortFields.includes(requestedSort) ? requestedSort : this.defaultSort;

    return {
      sort,
      sortBy: SortByList.includes(sortBy) ? sortBy : this.defaultSortBy,
    };
  }

  // Get total pages
  getTotalPages(totalRecords, limit) {
    return Math.ceil(totalRecords / limit);
  }

  // Generate pagination metadata
  getPaginationMeta(page, limit, totalRecords) {
    const totalPages = this.getTotalPages(totalRecords, limit);

    return {
      currentPage: page,
      limit,
      totalRecords,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
    };
  }

  // Get complete pagination and sorting options
  getQueryOptions(query = {}, allowedSortFields = []) {
    return {
      ...this.getPagination(query),
      ...this.getSorting(query, allowedSortFields),
    };
  }

  // Get default pagination
  getDefaultPagination() {
    return {
      page: 0,
      limit: this.defaultLimit,
      offset: 0,
    };
  }

  // Get default sorting
  getDefaultSorting() {
    return {
      sort: this.defaultSort,
      sortBy: this.defaultSortBy,
    };
  }
}

module.exports = new PageUtils();
