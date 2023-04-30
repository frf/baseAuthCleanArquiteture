import { ServerError } from '../errros/server-error';
import { HttpResponse } from '../protocols/http';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const serverErrorRequest = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
});

export const successResponse = (data: any): HttpResponse => ({
  statusCode: 400,
  body: data
});
