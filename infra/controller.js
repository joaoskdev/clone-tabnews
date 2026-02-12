import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
} from "infra/errors";

function onNoMatchHandler(request, response) {
  const publicErrorObjetct = new MethodNotAllowedError();
  response.status(publicErrorObjetct.statusCode).json(publicErrorObjetct);
}

function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObjetct = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });
  console.error(publicErrorObjetct);

  response.status(publicErrorObjetct.statusCode).json(publicErrorObjetct);
}

const controller = {
  errosHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
