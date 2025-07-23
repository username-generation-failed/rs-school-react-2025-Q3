import type {
  ChangeEvent,
  ComponentType,
  FormEventHandler,
  InputEvent,
  ReactNode,
} from 'react';
import React from 'react';
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
  class WithInputWrapper<
    T extends InputLike | AllowedTags,
  > extends React.PureComponent<Props<T>> {
    passHandlers: Handlers;

    constructor(props: Props<T>) {
      super(props);
      this.passHandlers = {
        onChange: handlers.onChange ?? this.handleChange,
        onInput: handlers.onInput ?? this.handleInput,
      };

      assert(
        validationTrigger === 'submit',
        'Not implemented yet, use validationTrigger submit'
      );
    }

    handleChange = (event: ChangeEvent<HTMLElement>) => {
      handlers.onChange?.(event);
      const props = this.props as InputLike;
      props.onChange?.(event);
    };

    handleInput = (event: InputEvent<HTMLElement>) => {
      handlers.onInput?.(event);
      const props = this.props as InputLike;
      props.onInput?.(event);
    };

    render(): ReactNode {
      const { Wrap, ...rest } = this.props;

      const props = { ...rest, ...this.passHandlers };

      if (typeof Wrap === 'string') {
        return React.createElement(Wrap, props);
      }

      const WrapCasted = Wrap as React.ComponentType<
        Omit<Readonly<Props<T>>, 'Wrap'> & Handlers
      >;

      return <WrapCasted {...props} />;
    }
  }

  return WithInputWrapper as unknown as InputWrap;
};
