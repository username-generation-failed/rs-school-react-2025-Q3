import type { ValidationError } from '~lib/Errors';
import { guard } from '~utils/guard';

export const reportCustomValidity = (
  form: HTMLFormElement,
  validationError: ValidationError
) => {
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
        (value) => 'tagName' in value && tags.includes(value.tagName as string)
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
};
