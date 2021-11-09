export const parseHandlebars = (
  input: string,
  parameters: Record<string, string>,
  fallback?: Record<string, string>
): string => input.replace(/{{([^}]+)}}/g, (_, key) => parameters[key] || fallback?.[key] || key);
