import Cookies, { type CookieSetOptions } from "universal-cookie";

const defaultCookieOptions: CookieSetOptions = {
  path: "/",
  secure: import.meta.env.MODE === "production",
  sameSite: "lax",
};

export const accessTokenCookieOptions: CookieSetOptions = {
  maxAge: 60 * 60 * 24 * 30,
};

export const cookies = () => {
  const c = new Cookies(null, defaultCookieOptions);
  const get = (name: string) => {
    return c.get(name);
  };

  const set = (name: string, value: string, options?: CookieSetOptions) => {
    return c.set(name, value, { ...defaultCookieOptions, ...options });
  };

  const remove = (name: string, options?: CookieSetOptions) => {
    return c.remove(name, { ...defaultCookieOptions, ...options });
  };

  return { get, set, remove };
};
