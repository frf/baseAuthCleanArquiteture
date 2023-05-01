import { InvalidParamError } from '../errros/invalid-param-error';
import { MissingParamError } from '../errros/missiing-param-error';
import { ServerError } from '../errros/server-error';
import {
  badRequest,
  serverError,
  successResponse
} from '../helpers/http-helpers';
import { Controller } from '../protocols/controller';
import { EmailValidator, HttpRequest, HttpResponse } from '../protocols';
import { AddAccount } from '../../domain/usecases/add-account';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
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

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password != passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      this.addAccount.add({ name, email, password });

      return successResponse({});
    } catch (error) {
      return serverError();
    }
  }
}
