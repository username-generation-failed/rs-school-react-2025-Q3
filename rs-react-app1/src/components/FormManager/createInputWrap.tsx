import type {
  ChangeEvent,
  ComponentType,
  FormEventHandler,
  InputEvent,
} from 'react';
import React, { useEffect } from 'react';
import type { ValidationTrigger } from './FormManager';
import { assert } from '~utils/assert';

export type InputLike = {
  onChange?: FormEventHandler<HTMLElement>;
  onInput?: FormEventHandler<HTMLElement>;
  name?: string;
};

type Handlers = {
  onChange?: (event: ChangeEvent<HTMLElement>) => void;
  onInput?: (event: InputEvent<HTMLElement>) => void;
};

type TagToElementMap = {
  input: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  textarea: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >;
  select: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >;
};

export type AllowedTags = 'input' | 'textarea' | 'select';

type PropsByTag<T extends AllowedTags> = TagToElementMap[T];

type Props<T extends InputLike | AllowedTags> = T extends AllowedTags
  ? PropsByTag<T> & {
      Wrap: T;
    }
  : T extends InputLike
    ? T & {
        Wrap: ComponentType<T>;
      }
    : never;

export type InputWrap = <T extends InputLike | AllowedTags>(
  props: Props<T>
) => React.ReactNode;

export const createInputWrap = (
  handlers: Handlers,
  validationTrigger: ValidationTrigger
): InputWrap => {
  const WithInputWrapper = <T extends InputLike | AllowedTags>(
    props: Props<T>
  ) => {
    const { onChange, onInput, Wrap, ...rest } = props;

    const handleChange = (event: ChangeEvent<HTMLElement>) => {
      handlers.onChange?.(event);
      (onChange as FormEventHandler<HTMLElement>)?.(event);
    };

    const handleInput = (event: InputEvent<HTMLElement>) => {
      handlers.onInput?.(event);
      (onInput as FormEventHandler<HTMLElement>)?.(event);
    };

    useEffect(() => {
      assert(
        validationTrigger === 'submit',
        'Not implemented yet, use validationTrigger submit'
      );
    }, []);

    const wrappedProps = {
      ...rest,
      onInput: handleInput,
      onChange: handleChange,
    };

    if (typeof Wrap === 'string') {
      return React.createElement(Wrap, wrappedProps);
    }

    return <Wrap {...wrappedProps} key={wrappedProps.name} />;
  };

  return WithInputWrapper as unknown as InputWrap;
};
