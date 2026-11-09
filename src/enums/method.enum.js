const MethodType = Object.freeze({
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
});

const MethodTypeList = Object.values(MethodType);

module.exports = { MethodType, MethodTypeList };
