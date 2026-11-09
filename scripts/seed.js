const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const bcrypt = require("bcryptjs");
const { eq } = require("drizzle-orm");
const { db, pool } = require("../src/configs/db.config");
const { users } = require("../src/models/user.model");
const { Role } = require("../src/enums/role.enum");

async function seedAdmin() {
  try {
    const adminName = process.env.ADMIN_NAME || "System Administrator";
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

    console.log(`Checking if admin user exists (${adminEmail})...`);

    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (existingUsers.length > 0) {
      console.log(`Admin already exists: ${adminEmail}. Skipping seed.`);
      await pool.end();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const [newAdmin] = await db
      .insert(users)
      .values({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
        isPasswordSet: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isPasswordSet: users.isPasswordSet,
        isActive: users.isActive,
      });

    console.log(`Admin created successfully:`, newAdmin);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("Error during admin seed:", error);
    try {
      await pool.end();
    } catch (poolErr) {
      // ignore
    }
    process.exit(1);
  }
}

seedAdmin();

