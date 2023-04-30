import { InvalidParamError } from '../errros/invalid-param-error';
import { MissingParamError } from '../errros/missiing-param-error';
import { badRequest, successResponse } from '../helpers/http-helpers';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
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

    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);

    if (!isValidEmail) {
      return badRequest(new InvalidParamError('email'));
    }

    return successResponse({});
  }
}
