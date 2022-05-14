export const validateEmail = (email) => {
  const re = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+$/;
  return re.test(String(email).toLowerCase());
};
