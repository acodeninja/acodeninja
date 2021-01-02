export const set = (key, value) => {
  window.localStorage.setItem(key, value);
};

export const get = (key, defaultValue = null) => {
  let value = window.localStorage.getItem(key);

  if (["true", "false"].includes(value)) {
    value = value === "true";
  }

  if (!isNaN(parseInt(value))) {
    value = parseInt(value);
  }

  return value === undefined ? defaultValue : value;
}
