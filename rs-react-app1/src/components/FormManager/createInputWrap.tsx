import type {
  ChangeEvent,
  FormEventHandler,
  InputEvent,
  ReactNode,
} from 'react';
import React from 'react';
import type { ValidationTrigger } from './FormManager';
import { assert } from '~utils/assert';
import type { ReactHTMLProps } from '~utils/types';

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
  input: HTMLInputElement;
  textarea: HTMLTextAreaElement;
  select: HTMLSelectElement;
};

export type AllowedTags = 'input' | 'textarea' | 'select';

type PropsByTag<T extends AllowedTags> = ReactHTMLProps<TagToElementMap[T]>;

type InferProps<T extends InputLike, T2 extends AllowedTags> = [never] extends [
  T2,
]
  ? T
  : PropsByTag<T2>;

type InferWrapType<T extends InputLike, T2 extends AllowedTags> = [
  never,
] extends [T2]
  ? React.ComponentType<T>
  : PropsByTag<T2>;

type Props<T extends InputLike, T2 extends AllowedTags = never> = InferProps<
  T,
  T2
> & {
  Wrap: InferWrapType<T, T2>;
  wrap?: T2;
};

export type InputWrap = <T extends InputLike, T2 extends AllowedTags = never>(
  props: Props<T, T2>
) => React.ReactNode;

export const createInputWrap = (
  handlers: Handlers,
  validationTrigger: ValidationTrigger
): InputWrap => {
  class WithInputWrapper<
    T extends InputLike,
    T2 extends AllowedTags = never,
  > extends React.PureComponent<Props<T, T2>> {
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
        Omit<Readonly<Props<T, T2>>, 'Wrap'> & Handlers
      >;

      return <WrapCasted {...props} />;
    }
  }

  return WithInputWrapper as unknown as InputWrap;
};
