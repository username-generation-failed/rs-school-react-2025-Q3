import { expect, describe, it, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '~test-utils/testing-react';

import userEvent from '@testing-library/user-event';
import { mockConsole } from '~test-utils/mockConsole';
import { FormManager, type ValidationTrigger } from './FormManager';
import {
  number,
  object,
  string,
  type AnyObjectSchema,
  type InferType,
} from 'yup';
import { faker } from '@faker-js/faker';
import { ValidationError } from '~lib/Errors';

const INPUT_NAME = 'input';
const wrongSchema = object({
  [INPUT_NAME]: number().defined(),
});

const rightSchema = object({
  [INPUT_NAME]: string().defined(),
});

type Data = InferType<typeof rightSchema>;
type SetupConfig = {
  schema?: AnyObjectSchema;
  name?: string;
  validationTrigger?: ValidationTrigger;
};
const TESTID = 'INPUT_TESTID';
const setup = async (config: SetupConfig = {}) => {
  const {
    schema = rightSchema,
    name = INPUT_NAME,
    validationTrigger = 'submit',
  } = config;

  const onSubmitMock = vi.fn<(a: Data, b: HTMLFormElement) => void>();
  const onSubmit = (a: Data, b: HTMLFormElement) => {
    onSubmitMock(a, b);
  };
  const validationErrorConsumerMock = vi.fn<(e: ValidationError) => void>();

  const utils = await act(async () =>
    render(
      <FormManager
        schema={schema}
        onSubmit={onSubmit}
        validationTrigger={validationTrigger}
      >
        {({ InputWrap, validationError }) => {
          if (validationError !== undefined)
            validationErrorConsumerMock(validationError);
          return <InputWrap Wrap={'input'} name={name} data-testid={TESTID} />;
        }}
      </FormManager>
    )
  );

  return {
    utils,
    onSubmitMock,
    validationErrorConsumerMock,
  };
};

afterEach(() => {
  vi.resetAllMocks();
});

mockConsole('error');

describe('FormManager', {}, () => {
  it('Renders child success', async () => {
    await setup();

    expect(screen.getByTestId(TESTID)).toBeInTheDocument();
  });

  it('Submit proper data', async () => {
    const { onSubmitMock } = await setup();

    const input = screen.getByTestId(TESTID) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    const value = faker.word.noun();
    fireEvent.change(input, { target: { value } });

    expect(input.form).not.toBe(null);
    const form = input.form as HTMLFormElement;
    fireEvent.submit(form);

    expect(onSubmitMock).toBeCalledWith(
      {
        [INPUT_NAME]: value,
      },
      input.form
    );
  });

  it('Handle invalid data', async () => {
    const { onSubmitMock, validationErrorConsumerMock } = await setup({
      schema: wrongSchema,
    });

    const input = screen.getByTestId(TESTID) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    const value = faker.word.noun();
    fireEvent.change(input, { target: { value } });

    expect(input.form).not.toBe(null);
    const form = input.form as HTMLFormElement;

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(onSubmitMock).not.toBeCalled();
    expect(validationErrorConsumerMock).toBeCalled();

    const validationErrorMessage = input.validationMessage;
    const validationError = new ValidationError('');
    validationError.messages[INPUT_NAME] = validationErrorMessage;

    expect(validationErrorConsumerMock).toHaveBeenLastCalledWith(
      validationError
    );
    expect(input.validity.valid).toBe(false);

    await userEvent.type(input, 'a');

    expect(input.validity.valid).toBe(true);
  });

  it('Validation strategy other than submit throws', async () => {
    const triggers: ValidationTrigger[] = ['change', 'input'];

    for (const trigger of triggers) {
      await expect(() =>
        setup({ validationTrigger: trigger })
      ).rejects.toThrowError('validationTrigger');
    }
  });
});
