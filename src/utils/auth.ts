import { ls } from ".";

const key = "ras-token";

export const getToken = (): string | undefined => {
  return ls.get(key);
};

export const setToken = (token: string) => {
  ls.set(key, token);
};

export const clearToken = () => {
  ls.remove(key);
};

export const isLogin = () => {
  return !!getToken();
};

/**
 *
 * 判断路径是否在tree形数据里
 */
export function pathInTree(path, authedPaths: any = [], key = "path") {
  return authedPaths.some(
    (authedPath) =>
      authedPath[key] === path ||
      pathInTree(path, authedPath.children || [], key)
  );
}
