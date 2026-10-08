export function parseEnvPlaceholders(template, envMap = {}) {
  if (template === null || template === undefined) throw new TypeError("Invalid template");
  return template.replace(/\${([A-Z0-9_]+)(?::-([^}]+))?\}/g, (match, key, defVal) => {
    const val = envMap[key];
    return val || (defVal !== undefined ? defVal : "");
  });
}