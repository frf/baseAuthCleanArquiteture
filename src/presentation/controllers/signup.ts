import { InvalidParamError } from '../errros/invalid-param-error';
import { MissingParamError } from '../errros/missiing-param-error';
import { ServerError } from '../errros/server-error';
import {
  badRequest,
  serverErrorRequest,
  successResponse
} from '../helpers/http-helpers';
import { Controller } from '../protocols/controller';
import { EmailValidator, HttpRequest, HttpResponse } from '../protocols';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      if (httpRequest.body.password != httpRequest.body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      return successResponse({});
    } catch (error) {
      return serverErrorRequest();
    }
  }
}
