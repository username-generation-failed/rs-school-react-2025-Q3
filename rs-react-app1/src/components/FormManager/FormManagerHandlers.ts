import Handlers from '~hooks/Handlers';
import type { Props, State } from './FormManager';

import type { AnyObjectSchema } from 'yup';
import { createRef, type ChangeEvent, type FormEvent } from 'react';
import { ValidationError as YUPValidationError } from 'yup';
import { ValidationError } from '~lib/Errors';
import { reportCustomValidity } from './reportCustomValidity';
import { assert, guard } from '~utils';
import { createUseHandlers } from '~hooks/Handlers/Handlers';

export class FormManagersHandlers extends Handlers<
  Props<AnyObjectSchema>,
  State
> {
  state: State = { validationError: undefined };
  formRef = createRef<HTMLFormElement>();

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {
      validationTrigger,
      useBrowserValidationErrorMessages,
      schema,
      onSubmit,
    } = this.props;

    const formEl = this.formRef.current;
    if (formEl === null) return;

    this.setState((prev) =>
      prev.validationError !== undefined ? { validationError: undefined } : prev
    );

    if (validationTrigger === 'submit') {
      const formData = new FormData(formEl);
      const rawData = Object.fromEntries(formData.entries());

      try {
        const data = schema.validateSync(rawData, {
          abortEarly: false,
          stripUnknown: false,
        });
        onSubmit(data, formEl, event);
      } catch (err) {
        if (
          guard<YUPValidationError>()(
            err,
            'object',
            (err) => 'name' in err && err.name === 'ValidationError'
          )
        ) {
          const validationError = new ValidationError('');
          err.inner.forEach((innerErr) => {
            if (innerErr.path === undefined) {
              return;
            }
            validationError.messages[innerErr.path] = innerErr.message;
          });

          if (useBrowserValidationErrorMessages) {
            reportCustomValidity(formEl, validationError);
          }

          this.setState({ validationError });
          return;
        }

        throw err;
      }
    }
  };

  handleInput = () => {
    const { validationTrigger } = this.props;
    if (validationTrigger !== 'input') return;
    throw new Error('not implemented');
  };

  handleChange = (event: ChangeEvent<HTMLElement>) => {
    const { validationTrigger } = this.props;

    if (validationTrigger !== 'change') return;
    //todo: Formik assignes to target first and fallbacks to currentTarget, find out why and fix if necessary
    const target = event.currentTarget;

    assert('name' in target, '');
    assert('value' in target, '');

    throw new Error('not implemented');
  };
}

export const useFormManagerHandlers = createUseHandlers(
  () => new FormManagersHandlers()
);
