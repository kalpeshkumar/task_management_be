const { eq, asc, desc, and, inArray, ilike, gte, lte, count } = require("drizzle-orm");
const { db } = require("../configs/db.config");
const { users } = require("../models/user.model");
const commonUtils = require("../utils/common.utils");
const pageUtils = require("../utils/page.utils");
const { SortBy } = require("../enums/sort.enum");

class userRepository {
  constructor(database = db) {
    this.db = database;

    // Reusable public user selection (excluding password & sensitive tokens)
    this.userSelection = {
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isPasswordSet: users.isPasswordSet,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    };

    this.DEFAULT_SORT_COLUMN = "created_at";
    this.DEFAULT_SORT_BY = SortBy.DESC;
  }

  // Insert a new user record
  async create(userData) {
    const [newUser] = await this.db.insert(users).values(userData).returning(this.userSelection);
    return newUser;
  }

  // Select a user by id
  async findById(id) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId)) return null;

    const result = await this.db
      .select(this.userSelection)
      .from(users)
      .where(eq(users.id, parsedId))
      .limit(1);
    return result[0] || null;
  }

  // Select a user by id including password hash
  async findByIdWithPassword(id) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId)) return null;

    const result = await this.db
      .select({
        ...this.userSelection,
        password: users.password,
      })
      .from(users)
      .where(eq(users.id, parsedId))
      .limit(1);
    return result[0] || null;
  }

  // Alias for findById
  async getUserById(id) {
    return await this.findById(id);
  }

  // Select a user by email (includes password hash for authentication)
  async findByEmail(email) {
    if (!email) return null;
    const result = await this.db
      .select({
        ...this.userSelection,
        password: users.password,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0] || null;
  }

  // Set initial password for user
  async setPassword(id, hashedPassword) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId)) return null;

    const [updatedUser] = await this.db
      .update(users)
      .set({
        password: hashedPassword,
        isPasswordSet: true,
        spasswordChangedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, parsedId))
      .returning(this.userSelection);

    return updatedUser || null;
  }

  // Update password (e.g. change password)
  async updatePassword(id, hashedPassword) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId)) return null;

    const [updatedUser] = await this.db
      .update(users)
      .set({
        password: hashedPassword,
        passwordChangedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, parsedId))
      .returning(this.userSelection);

    return updatedUser || null;
  }

  // Retrieve all users (for dropdowns / employee selection)
  async findAllEmployees() {
    return await this.db
      .select(this.userSelection)
      .from(users)
      .orderBy(asc(users.name));
  }

  // Delete user by id
  async deleteUser(id) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId)) return null;

    const [deletedUser] = await this.db
      .delete(users)
      .where(eq(users.id, parsedId))
      .returning(this.userSelection);
    return deletedUser || null;
  }

  // Update user by id
  async updateUser(id, updateData = {}) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId)) return null;

    const [updatedUser] = await this.db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, parsedId))
      .returning(this.userSelection);

    return updatedUser || null;
  }

  // Filter where clause
  whereClause(filter = {}) {
    const conditions = [];
    const { ids, emails, roles, search, createdAt, updatedAt } = filter || {};

    // Multiple IDs condition
    if (commonUtils.isValidArray(ids)) {
      conditions.push(inArray(users.id, ids));
    }

    // Name or Email search (case-insensitive)
    if (!commonUtils.isNullOrUndefined(search) && String(search).trim() !== "") {
      conditions.push(ilike(users.name, `%${search.trim()}%`));
    }

    // Multiple emails condition
    if (commonUtils.isValidArray(emails)) {
      conditions.push(inArray(users.email, emails));
    }

    // Role condition
    if (commonUtils.isValidArray(roles)) {
      conditions.push(inArray(users.role, roles));
    }

    const dateRangeCondition = (column, dateRange) => {
      if (commonUtils.isNullOrUndefined(dateRange)) {
        return null;
      }
      const { startDate, endDate } = dateRange;
      const dateConditions = [];

      if (!commonUtils.isNullOrUndefined(startDate)) {
        dateConditions.push(gte(column, new Date(startDate)));
      }

      if (!commonUtils.isNullOrUndefined(endDate)) {
        dateConditions.push(lte(column, new Date(endDate)));
      }

      if (dateConditions.length === 0) {
        return null;
      }

      return dateConditions.length === 1 ? dateConditions[0] : and(...dateConditions);
    };

    // createdAt condition
    const createdAtCondition = dateRangeCondition(users.createdAt, createdAt);
    if (createdAtCondition) {
      conditions.push(createdAtCondition);
    }

    // updatedAt condition
    const updatedAtCondition = dateRangeCondition(users.updatedAt, updatedAt);
    if (updatedAtCondition) {
      conditions.push(updatedAtCondition);
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  // Select all users matching filter
  async filterUser(filter = {}, sort = {}) {
    const where = this.whereClause(filter);
    const sorting = pageUtils.getSorting(sort, Object.keys(this.userSelection));
    const sortColumn =
      this.userSelection[sorting.sort] ||
      this.userSelection[this.DEFAULT_SORT_COLUMN] ||
      users.createdAt;
    const orderBy = sorting.sortBy === SortBy.ASC ? asc(sortColumn) : desc(sortColumn);

    let query = this.db.select(this.userSelection).from(users);
    if (where) {
      query = query.where(where);
    }
    const data = await query.orderBy(orderBy);

    return { data, sort };
  }

  // Select all users with pagination
  async filterUserWithPagination(filter = {}, page = {}, sort = {}) {
    const where = this.whereClause(filter);
    const pagination = pageUtils.getPagination(page);
    const sorting = pageUtils.getSorting(sort, Object.keys(this.userSelection));
    const sortColumn =
      this.userSelection[sorting.sort] ||
      this.userSelection[this.DEFAULT_SORT_COLUMN] ||
      users.createdAt;
    const orderBy = sorting.sortBy === SortBy.ASC ? asc(sortColumn) : desc(sortColumn);

    let dataQuery = this.db.select(this.userSelection).from(users);
    if (where) {
      dataQuery = dataQuery.where(where);
    }

    let countQuery = this.db.select({ totalRecords: count() }).from(users);
    if (where) {
      countQuery = countQuery.where(where);
    }

    const [data, countResult] = await Promise.all([
      dataQuery.orderBy(orderBy).limit(pagination.limit).offset(pagination.offset),
      countQuery,
    ]);

    const totalRecords = Number(countResult[0]?.totalRecords || 0);
    return {
      data,
      pagination: pageUtils.getPaginationMeta(pagination.page, pagination.limit, totalRecords),
      sort,
    };
  }
}

module.exports = new userRepository();
