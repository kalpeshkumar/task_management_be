const { pgTable, serial, varchar, timestamp, pgEnum, text, boolean } = require("drizzle-orm/pg-core");
const { RoleList, Role } = require("../enums/role.enum");

const roleEnum = pgEnum("role", RoleList);

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }), // Nullable prior to first-login setup
  role: roleEnum("role").notNull().default(Role.USER),
  isPasswordSet: boolean("is_password_set").notNull().default(false),
  passwordChangedAt: timestamp("password_changed_at"),
  isActive: boolean("is_active").notNull().default(true),
  logoutAt: timestamp("logout_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

module.exports = {
  users,
  roleEnum
};
