const { eq, asc, desc, and, inArray, ilike, or, gte, lte, count } = require("drizzle-orm");
const { alias } = require("drizzle-orm/pg-core");
const { db } = require("../configs/db.config");
const { tasks } = require("../models/task.model");
const { projects } = require("../models/project.model");
const { users } = require("../models/user.model");
const commonUtils = require("../utils/common.utils");
const pageUtils = require("../utils/page.utils");
const { SortBy } = require("../enums/sort.enum");

const assignee = alias(users, "assignee");
const creator = alias(users, "creator");

class TaskRepository {
  constructor(database = db) {
    this.db = database;

    this.taskSelection = {
      id: tasks.id,
      title: tasks.title,
      description: tasks.description,
      projectId: tasks.projectId,
      assignedTo: tasks.assignedTo,
      status: tasks.status,
      dueDate: tasks.dueDate,
      createdBy: tasks.createdBy,
      createdAt: tasks.createdAt,
      updatedAt: tasks.updatedAt,
    };

    this.DEFAULT_SORT_COLUMN = "created_at";
    this.DEFAULT_SORT_BY = SortBy.DESC;
  }

  // Insert a new task
  async create(taskData) {
    const [newTask] = await this.db.insert(tasks).values(taskData).returning(this.taskSelection);
    return newTask;
  }

  // Select a task by id
  async findById(id) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId)) return null;

    const rows = await this.db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        projectId: tasks.projectId,
        projectName: projects.name,
        assignedTo: tasks.assignedTo,
        assignedToName: assignee.name,
        assignedToEmail: assignee.email,
        status: tasks.status,
        dueDate: tasks.dueDate,
        createdBy: tasks.createdBy,
        createdByName: creator.name,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(assignee, eq(tasks.assignedTo, assignee.id))
      .leftJoin(creator, eq(tasks.createdBy, creator.id))
      .where(eq(tasks.id, parsedId))
      .limit(1);

    return rows[0] || null;
  }

  // Delete a task by id
  async deleteTask(id) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId)) return null;

    const [deletedTask] = await this.db
      .delete(tasks)
      .where(eq(tasks.id, parsedId))
      .returning(this.taskSelection);

    return deletedTask || null;
  }

  // Update a task by id
  async updateTask(id, updateData = {}) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId)) return null;

    const [updatedTask] = await this.db
      .update(tasks)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(tasks.id, parsedId))
      .returning(this.taskSelection);

    return updatedTask || null;
  }

  // Update status column of an existing task (helper)
  async updateStatus(id, status) {
    return await this.updateTask(id, { status });
  }

  // Select all tasks with joined project and user details
  async findAll({ projectId } = {}) {
    let query = this.db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        projectId: tasks.projectId,
        projectName: projects.name,
        assignedTo: tasks.assignedTo,
        assignedToName: assignee.name,
        assignedToEmail: assignee.email,
        status: tasks.status,
        dueDate: tasks.dueDate,
        createdBy: tasks.createdBy,
        createdByName: creator.name,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(assignee, eq(tasks.assignedTo, assignee.id))
      .leftJoin(creator, eq(tasks.createdBy, creator.id));

    if (projectId) {
      query = query.where(eq(tasks.projectId, Number(projectId)));
    }

    return await query.orderBy(desc(tasks.createdAt));
  }

  // Select task statuses (used for dashboard metric counts)
  async findStatuses({ projectId } = {}) {
    let query = this.db.select({ status: tasks.status }).from(tasks);
    if (projectId) {
      query = query.where(eq(tasks.projectId, Number(projectId)));
    }
    return await query;
  }

  // Filter where clause
  whereClause(filter = {}) {
    const conditions = [];
    const { ids, titles, projectIds, assignedTos, statuses, search, createdAt, updatedAt } = filter || {};

    if (commonUtils.isValidArray(ids)) {
      conditions.push(inArray(tasks.id, ids));
    }

    if (commonUtils.isValidArray(titles)) {
      conditions.push(inArray(tasks.title, titles));
    }

    if (commonUtils.isValidArray(projectIds)) {
      conditions.push(inArray(tasks.projectId, projectIds));
    }

    if (commonUtils.isValidArray(assignedTos)) {
      conditions.push(inArray(tasks.assignedTo, assignedTos));
    }

    if (commonUtils.isValidArray(statuses)) {
      conditions.push(inArray(tasks.status, statuses));
    }

    if (!commonUtils.isNullOrUndefined(search) && String(search).trim() !== "") {
      const term = `%${String(search).trim()}%`;
      conditions.push(or(ilike(tasks.title, term), ilike(tasks.description, term)));
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

    const createdAtCondition = dateRangeCondition(tasks.createdAt, createdAt);
    if (createdAtCondition) conditions.push(createdAtCondition);

    const updatedAtCondition = dateRangeCondition(tasks.updatedAt, updatedAt);
    if (updatedAtCondition) conditions.push(updatedAtCondition);

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  // Filter tasks without pagination
  async filterTask(filter = {}, sort = {}) {
    const where = this.whereClause(filter);
    const sorting = pageUtils.getSorting(sort, Object.keys(this.taskSelection));
    const sortColumn = this.taskSelection[sorting.sort] || this.taskSelection[this.DEFAULT_SORT_COLUMN] || tasks.createdAt;
    const orderBy = sorting.sortBy === SortBy.ASC ? asc(sortColumn) : desc(sortColumn);

    let query = this.db.select(this.taskSelection).from(tasks);
    if (where) {
      query = query.where(where);
    }
    const data = await query.orderBy(orderBy);

    return { data, sort };
  }

  // Filter tasks with pagination
  async filterTaskWithPagination(filter = {}, page = {}, sort = {}) {
    const where = this.whereClause(filter);
    const pagination = pageUtils.getPagination(page);
    const sorting = pageUtils.getSorting(sort, Object.keys(this.taskSelection));
    const sortColumn = this.taskSelection[sorting.sort] || this.taskSelection[this.DEFAULT_SORT_COLUMN] || tasks.createdAt;
    const orderBy = sorting.sortBy === SortBy.ASC ? asc(sortColumn) : desc(sortColumn);

    let dataQuery = this.db.select(this.taskSelection).from(tasks);
    if (where) {
      dataQuery = dataQuery.where(where);
    }

    let countQuery = this.db.select({ totalRecords: count() }).from(tasks);
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

module.exports = new TaskRepository();
