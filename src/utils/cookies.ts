import Cookies, { type CookieSetOptions } from "universal-cookie";

export const cookies = () => {
  const c = new Cookies(null, {
    path: "/",
    secure: import.meta.env.MODE === "production",
    sameSite: "lax",
  });
  const get = (name: string) => {
    return c.get(name);
  };

  const set = (name: string, value: string, options?: CookieSetOptions) => {
    return c.set(name, value, options);
  };

  const remove = (name: string) => {
    return c.remove(name);
  };

  return { get, set, remove };
};
