/**
 * Checks wether a provided string is in correct email format
 *
 * @param {string} email String to be validated
 * @returns {boolean} Retuns boolean wether provided string is in valid email format
 */
export const validateEmail = (email: string) => {
  const re = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+$/;
  return re.test(String(email).toLowerCase());
};
