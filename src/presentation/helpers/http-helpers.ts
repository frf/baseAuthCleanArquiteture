import { HttpResponse } from '../protocols/http';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const successResponse = (data: any): HttpResponse => ({
  statusCode: 400,
  body: data
});
