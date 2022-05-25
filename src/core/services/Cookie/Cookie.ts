import {CookieKeyEnum} from 'core/enums';

class Cookie {
  create(cookieName: CookieKeyEnum, cookieValue: string): void {
    const date = new Date();
    date.setTime(date.getTime() + 60 * 60 * 1000);
    document.cookie = cookieName + ' = ' + cookieValue + ';Path=/; Expires = ' + date.toUTCString();
  }

  get(cname: CookieKeyEnum): string | null {
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
  }

  has(cname: CookieKeyEnum): boolean {
    return this.get(cname) !== null;
  }

  delete(cname: CookieKeyEnum): void {
    console.info('DELETE COOkIE ' + cname + ' - ' + window.location.hostname);
    document.cookie =
      cname +
      '=; Path=/; Domain=' +
      window.location.hostname +
      '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}

const cookie = new Cookie();

export {cookie};
