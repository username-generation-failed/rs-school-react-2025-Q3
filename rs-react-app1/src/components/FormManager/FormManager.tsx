import type { ChangeEvent, FormEvent, ReactNode, RefObject } from 'react';
import React, { createRef } from 'react';
import type { InferType, AnyObjectSchema } from 'yup';
import { ValidationError as YUPValidationError } from 'yup';

import { guard, assert } from '~utils';

import type { InputWrap } from './createInputWrap';
import { createInputWrap } from './createInputWrap';
import { ValidationError } from '~lib/Errors';

export type ValidationTrigger = 'input' | 'change' | 'submit';

type ReactNativeFormProps = React.FormHTMLAttributes<HTMLFormElement>;
type OwnProps<D extends AnyObjectSchema> = {
  schema: D;
  onSubmit: (
    data: InferType<D>,
    ref: HTMLFormElement,
    event: FormEvent<HTMLFormElement>
  ) => void;
  ref?: React.RefObject<HTMLFormElement | null>;

  validationTrigger: ValidationTrigger;
  inputDebounceMs: number;

  useBrowserValidationErrorMessages: boolean;

  children: (passProps: PassProps) => ReactNode;
};
type Props<D extends AnyObjectSchema> = Omit<
  ReactNativeFormProps,
  keyof OwnProps<D>
> &
  OwnProps<D>;

type State = {
  validationError?: ValidationError;
};

type PassProps = {
  InputWrap: InputWrap;
  validationError?: ValidationError;
};

export class FormManager<D extends AnyObjectSchema> extends React.PureComponent<
  Props<D>,
  State
> {
  formRef: RefObject<HTMLFormElement | null>;
  InputWrap: InputWrap;

  constructor(props: Props<D>) {
    super(props);
    this.formRef = this.props.ref ?? createRef();
    this.InputWrap = createInputWrap(
      {
        onChange: undefined,
        onInput: undefined,
      },
      this.props.validationTrigger
    );
  }

  static defaultProps = {
    validationTrigger: 'submit',
    inputDebounceMs: 20,
    useBrowserValidationErrorMessages: true,
  };

  state = {
    validationError: undefined,
  };

  reportCustomValidity(
    form: HTMLFormElement,
    validationError: ValidationError
  ) {
    const elements: (
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    )[] = [];
    Object.keys(validationError.messages).forEach((k) => {
      const el = form.elements.namedItem(k);

      if (el === null) {
        throw new Error(
          `form have no element with name ${k}, it's required by schema.`
        );
      }

      const tags = ['input', 'select', 'textarea'].map(
        (e) => document.createElement(e).tagName
      );
      if (
        guard<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>()(
          el,
          'object',
          (value) =>
            'tagName' in value && tags.includes(value.tagName as string)
        )
      ) {
        el.setCustomValidity(validationError.messages[k]);
        elements.push(el);
        return;
      }

      throw new Error('RadioNodeList not implemented yet');
    });

    form.reportValidity();
    form.addEventListener(
      'input',
      () => {
        elements.forEach((el) => el.setCustomValidity(''));
        elements.length = 0;
      },
      { once: true }
    );
  }

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formEl = this.formRef.current;
    if (formEl === null) return;

    this.setState((prev) =>
      prev.validationError !== undefined ? { validationError: undefined } : prev
    );

    if (this.props.validationTrigger === 'submit') {
      const formData = new FormData(formEl);
      const rawData = Object.fromEntries(formData.entries());

      try {
        const data = this.props.schema.validateSync(rawData, {
          abortEarly: false,
          stripUnknown: false,
        });
        this.props.onSubmit(data, formEl, event);
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

          if (this.props.useBrowserValidationErrorMessages) {
            this.reportCustomValidity(formEl, validationError);
          }

          this.setState({ validationError });
          return;
        }

        throw err;
      }
    }
  };

  handleInput = () => {
    throw new Error('not implemented');
  };

  handleChange = (event: ChangeEvent<HTMLElement>) => {
    //todo: Formik assignes to target first and fallbacks to currentTarget, find out why and fix if necessary
    const target = event.currentTarget;

    assert('name' in target, '');
    assert('value' in target, '');

    throw new Error('not implemented');
  };

  render(): React.ReactNode {
    // https://stackoverflow.com/a/39485162/406725
    // iOS cares about "action" being set + "#" is a noop action
    const action = this.props.action ?? '#';
    return (
      <form action={action} ref={this.formRef} onSubmit={this.handleSubmit}>
        {this.props.children({
          InputWrap: this.InputWrap,
          validationError: this.state.validationError,
        })}
      </form>
    );
  }
}
