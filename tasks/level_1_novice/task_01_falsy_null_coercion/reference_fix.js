export function parseEnvPlaceholders(template, envMap = {}) {
  if (template === null || template === undefined) throw new TypeError("Invalid template");
  return template.replace(/\${([A-Z0-9_]+)(?::-([^}]+))?\}/g, (match, key, defVal) => {
    if (Object.prototype.hasOwnProperty.call(envMap, key) && envMap[key] !== undefined) {
      return envMap[key];
    }
    return defVal !== undefined ? defVal : "";
  });
}