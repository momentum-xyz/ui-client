export const createCookieInHours = (cookieName, cookieValue, hoursToExpire) => {
  const date = new Date();
  date.setTime(date.getTime() + hoursToExpire * 60 * 60 * 1000);
  document.cookie = cookieName + ' = ' + cookieValue + ';Path=/; Expires = ' + date.toUTCString();
};

export const getCookie = (cname) => {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};

export const hasCookie = (cname) => {
  const cookie = getCookie(cname);

  if (cookie === null) return false;

  return true;
};

export const deleteCookieByName = (cname) => {
  console.info('DELETE COOkIE ' + cname + ' - ' + window.location.hostname);
  document.cookie =
    cname +
    '=; Path=/; Domain=' +
    window.location.hostname +
    '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
