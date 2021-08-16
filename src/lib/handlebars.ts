export const parseHandlebars = (
  input: string,
  parameters: Record<string, string>
): string => input.replace(/{{([^}]+)}}/g, (_, key) => parameters[key] || key);
