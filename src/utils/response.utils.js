const { StatusCodes } = require("http-status-codes");
const MessageConstant = require("../constants/message.constant");
const ErrorMessageConstant = require("../constants/error.constant");

class ResponseUtil {

  constructor() {
    this.SUCCESS = "SUCCESS";
    this.ERROR = "ERROR"
  }
  //COMMON SEND MESSAGE
  send(res, statusCode, status, message, data = null) {
    return res.status(statusCode).json({
      data,
      status: {
        statusCode,
        status,
        message,
      },
    });
  }

  //ERROR RESPONSE
  errorResponse(
    res,
    message = MessageConstant.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    return this.send(res, statusCode, this.ERROR, message);
  }

  //PAGINATION RESPONSE
  paginationResponse(res, result, message = MessageConstant.SUCCESS) {
    const { data = [], pagination = {}, sort = {} } = result || {};
    return res.status(StatusCodes.OK).json({
      data,
      pagination,
      sort,
      status: {
        statusCode: StatusCodes.OK,
        status: this.SUCCESS,
        message,
      },
    });
  }

  // LIST RESPONSE WITH SORTING
  listResponse(res, result, message = MessageConstant.SUCCESS) {
    const { data = [], sort = {} } = result || {};

    return res.status(StatusCodes.OK).json({
      data,
      sort,
      status: {
        statusCode: StatusCodes.OK,
        status: this.SUCCESS,
        message,
      },
    });
  }

  //COMMON USE METHODS
  okResponse(res, data = null, message = MessageConstant.SUCCESS) {
    return this.send(res, StatusCodes.OK, this.SUCCESS, message, data);
  }

  createdResponse(res, data = null, message = MessageConstant.CREATED_SUCCESSFULLY) {
    return this.send(res, StatusCodes.CREATED, this.SUCCESS, message, data);
  }

  updatedResponse(res, data = null, message = MessageConstant.UPDATED_SUCCESSFULLY) {
    return this.send(res, StatusCodes.OK, this.SUCCESS, message, data);
  }

  deletedResponse(res, data = null, message = MessageConstant.DELETED_SUCCESSFULLY) {
    return this.send(res, StatusCodes.OK, this.SUCCESS, message, data);
  }
}

module.exports = new ResponseUtil();
