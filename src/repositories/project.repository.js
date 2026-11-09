const { eq, asc, desc, and, inArray, ilike, or, gte, lte, count } = require("drizzle-orm");
const { db } = require("../configs/db.config");
const { projects } = require("../models/project.model");
const { users } = require("../models/user.model");
const { tasks } = require("../models/task.model");
const commonUtils = require("../utils/common.utils");
const pageUtils = require("../utils/page.utils");
const { SortBy } = require("../enums/sort.enum");

class ProjectRepository {
  constructor(database = db) {
    this.db = database;

    this.projectSelection = {
      id: projects.id,
      name: projects.name,
      description: projects.description,
      createdBy: projects.createdBy,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    };

    this.DEFAULT_SORT_COLUMN = "createdAt";
    this.DEFAULT_SORT_BY = SortBy.DESC;
  }

  // Insert a new project
  async create(projectData) {
    const [newProject] = await this.db
      .insert(projects)
      .values(projectData)
      .returning(this.projectSelection);
    return newProject;
  }

  // Select a single project by id
  async findById(id) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId)) return null;

    const rows = await this.db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        createdBy: projects.createdBy,
        creatorName: users.name,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .leftJoin(users, eq(projects.createdBy, users.id))
      .where(eq(projects.id, parsedId))
      .limit(1);

    return rows[0] || null;
  }

  // Delete project by id
  async deleteProject(id) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId)) return null;

    const [deletedProject] = await this.db
      .delete(projects)
      .where(eq(projects.id, parsedId))
      .returning(this.projectSelection);

    return deletedProject || null;
  }

  // Update project by id
  async updateProject(id, updateData = {}) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId)) return null;

    const [updatedProject] = await this.db
      .update(projects)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(projects.id, parsedId))
      .returning(this.projectSelection);

    return updatedProject || null;
  }

  // Select all projects with task counts and creator info (helper)
  async findAll() {
    const rows = await this.db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        createdBy: projects.createdBy,
        created_by: projects.createdBy,
        creatorName: users.name,
        creator_name: users.name,
        createdAt: projects.createdAt,
        created_at: projects.createdAt,
        taskCount: count(tasks.id),
        task_count: count(tasks.id),
      })
      .from(projects)
      .leftJoin(users, eq(projects.createdBy, users.id))
      .leftJoin(tasks, eq(projects.id, tasks.projectId))
      .groupBy(projects.id, users.name)
      .orderBy(desc(projects.createdAt));

    return rows;
  }

  // Filter where clause
  whereClause(filter = {}) {
    const conditions = [];
    const { ids, names, createdBys, search, createdAt, updatedAt } = filter || {};

    if (commonUtils.isValidArray(ids)) {
      conditions.push(inArray(projects.id, ids));
    }

    if (commonUtils.isValidArray(names)) {
      conditions.push(inArray(projects.name, names));
    }

    if (commonUtils.isValidArray(createdBys)) {
      conditions.push(inArray(projects.createdBy, createdBys));
    }

    if (!commonUtils.isNullOrUndefined(search) && String(search).trim() !== "") {
      const term = `%${String(search).trim()}%`;
      conditions.push(or(ilike(projects.name, term), ilike(projects.description, term)));
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

    const createdAtCondition = dateRangeCondition(projects.createdAt, createdAt);
    if (createdAtCondition) conditions.push(createdAtCondition);

    const updatedAtCondition = dateRangeCondition(projects.updatedAt, updatedAt);
    if (updatedAtCondition) conditions.push(updatedAtCondition);

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  // Filter projects without pagination
  async filterProject(filter = {}, sort = {}) {
    const where = this.whereClause(filter);
    const sorting = pageUtils.getSorting(sort, Object.keys(this.projectSelection));
    const sortColumn = this.projectSelection[sorting.sort] || this.projectSelection[this.DEFAULT_SORT_COLUMN] || projects.createdAt;
    const orderBy = sorting.sortBy === SortBy.ASC ? asc(sortColumn) : desc(sortColumn);

    let query = this.db.select(this.projectSelection).from(projects);
    if (where) {
      query = query.where(where);
    }
    const data = await query.orderBy(orderBy);

    return { data, sort };
  }

  // Filter projects with pagination
  async filterProjectWithPagination(filter = {}, page = {}, sort = {}) {
    const where = this.whereClause(filter);
    const pagination = pageUtils.getPagination(page);
    const sorting = pageUtils.getSorting(sort, Object.keys(this.projectSelection));
    const sortColumn = this.projectSelection[sorting.sort] || this.projectSelection[this.DEFAULT_SORT_COLUMN] || projects.createdAt;
    const orderBy = sorting.sortBy === SortBy.ASC ? asc(sortColumn) : desc(sortColumn);

    let dataQuery = this.db.select(this.projectSelection).from(projects);
    if (where) {
      dataQuery = dataQuery.where(where);
    }

    let countQuery = this.db.select({ totalRecords: count() }).from(projects);
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

module.exports = new ProjectRepository();
