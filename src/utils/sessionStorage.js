export const ss = {
  set: (name, data) => {
    sessionStorage.setItem(name, JSON.stringify(data))
  },
  get: (name) => {
    return JSON.parse(sessionStorage.getItem(name))
  },
  remove: (name) => {
    sessionStorage.removeItem(name)
  },
  clear: () => {
    sessionStorage.clear()
  },
}
