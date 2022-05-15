export const createCookieInHours = (
  cookieName: string,
  cookieValue: string,
  hoursToExpire: number
) => {
  const date = new Date();
  date.setTime(date.getTime() + hoursToExpire * 60 * 60 * 1000);
  document.cookie = cookieName + ' = ' + cookieValue + ';Path=/; Expires = ' + date.toUTCString();
};

export const getCookie = (cname: string) => {
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

export const hasCookie = (cname: string) => {
  const cookie = getCookie(cname);

  return cookie !== null;
};

export const deleteCookieByName = (cname: string) => {
  console.info('DELETE COOkIE ' + cname + ' - ' + window.location.hostname);
  document.cookie =
    cname +
    '=; Path=/; Domain=' +
    window.location.hostname +
    '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
