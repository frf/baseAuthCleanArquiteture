/// Imports
import { describe, expect, test, vi } from 'vitest';
import { SignUpController } from './signup';
import { MissingParamError } from '../errros/missiing-param-error';
import { InvalidParamError } from '../errros/invalid-param-error';
import { ServerError } from '../errros/server-error';
import { EmailValidator } from '../protocols';
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account';
import { AccountModel } from '../../domain/models/account';

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const accountModelFake = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      };

      return accountModelFake;
    }
  }

  return new AddAccountStub();
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return false;
    }
  }

  return new EmailValidatorStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  };
};
// Tests
describe('Signup Controller', async () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
  test('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });
  test('Should return 400 if no password confirmation fail is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    );
  });
  test('Should return 400 if email invalid is provided', async () => {
    const { emailValidatorStub, sut } = makeSut();
    vi.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });
  test('Should call EmailValidator wtesth correct email', async () => {
    const { emailValidatorStub, sut } = makeSut();
    const isValidSpy = vi
      .spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
  });
  test('Should return 500 EmailValidator throw', async () => {
    const { emailValidatorStub, sut } = makeSut();
    vi.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  //   test('Should return 500 if account addAccount', async () => {
  //     const { addAccountStub, sut } = makeSut();
  //     vi.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
  //       throw new Error();
  //     });

  //     const httpRequest = {
  //       body: {
  //         name: 'any_name',
  //         email: 'any_email@email.com',
  //         password: 'any_password',
  //         passwordConfirmation: 'any_password'
  //       }
  //     };
  //     const httpResponse = sut.handle(httpRequest);

  //     expect(httpResponse.statusCode).toBe(500);
  //     // expect(httpResponse.body).toEqual(new ServerError());
  //   });

  //   test('Should call addAccount wtesth correct values', async () => {
  //     const { sut, addAccountStub } = makeSut();
  //     const spy = vi.spyOn(addAccountStub, 'add');

  //     const httpRequest = {
  //       body: {
  //         name: 'any_name',
  //         email: 'any_email@email.com',
  //         password: 'any_password'
  //       }
  //     };

  //     sut.handle(httpRequest);
  //     expect(spy).toHaveBeenCalledWith({
  //       name: 'any_name',
  //       email: 'any_email@email.com',
  //       password: 'any_password'
  //     });
  //   });
});
