const Role = Object.freeze({
  ADMIN: "ADMIN",
  USER: "USER",
});

const RoleList = Object.keys(Role);

module.exports = { Role, RoleList };
