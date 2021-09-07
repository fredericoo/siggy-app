import slugify from 'slugify';

export const toSlug = (str: string): string =>
  slugify(str || '', { lower: true, strict: true });

export const validateSlug = (str: string): boolean => str === toSlug(str);
