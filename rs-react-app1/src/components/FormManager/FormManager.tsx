import type { FormEvent, ReactNode } from 'react';
import React, { useMemo } from 'react';
import type { InferType, AnyObjectSchema } from 'yup';

import type { InputWrap } from './createInputWrap';
import { createInputWrap } from './createInputWrap';
import { ValidationError } from '~lib/Errors';
import { useFormManagerHandlers } from './FormManagerHandlers';
import { useDefaultProps } from '../../hooks';

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

  validationTrigger?: ValidationTrigger;
  inputDebounceMs?: number;

  useBrowserValidationErrorMessages?: boolean;

  children: (passProps: PassProps) => ReactNode;
};
export type Props<D extends AnyObjectSchema> = Omit<
  ReactNativeFormProps,
  keyof OwnProps<D>
> &
  OwnProps<D>;

export type State = {
  validationError?: ValidationError;
};

type PassProps = {
  InputWrap: InputWrap;
  validationError?: ValidationError;
};

const defaultProps = {
  validationTrigger: 'submit',
  useBrowserValidationErrorMessages: true,
  // https://stackoverflow.com/a/39485162/406725
  // iOS cares about "action" being set + "#" is a noop action
  action: '#',
} as const;

export const FormManager = <D extends AnyObjectSchema>(_props: Props<D>) => {
  const props = useDefaultProps(_props, defaultProps);
  const { validationTrigger, action } = props;

  const handlers = useFormManagerHandlers(props);

  const InputWrap: InputWrap = useMemo(
    () =>
      createInputWrap(
        {
          onChange: handlers.handleChange,
          onInput: handlers.handleInput,
        },
        validationTrigger
      ),
    [validationTrigger, handlers]
  );

  return (
    <form
      action={action}
      ref={handlers.formRef}
      onSubmit={handlers.handleSubmit}
    >
      {props.children({
        InputWrap: InputWrap,
        validationError: handlers.state.validationError,
      })}
    </form>
  );
};
