import { InternalServerError, MethodNotAllowedError } from "infra/errors";

function onNoMatchHandler(request, response) {
  const publicErrorObjetct = new MethodNotAllowedError();
  response.status(publicErrorObjetct.statusCode).json(publicErrorObjetct);
}

function onErrorHandler(error, request, response) {
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
