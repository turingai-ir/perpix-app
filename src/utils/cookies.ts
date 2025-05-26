import Cookies from 'universal-cookie';

export const cookies = () => {
  const c = new Cookies(null, {
    path: '/',
    secure: import.meta.env.MODE === 'prodcution',
    httpOnly: import.meta.env.MODE === 'production',
  });
  const get = (name: string) => {
    return c.get(name);
  };

  const set = (name: string, value: string) => {
    return c.set(name, value);
  };

  const remove = (name: string) => {
    return c.remove(name);
  };

  return { get, set, remove };
};
