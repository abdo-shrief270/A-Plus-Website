import Cookies from 'js-cookie'

export const Cookie = {
  get(name: string): string | undefined {
    return Cookies.get(name)
  },

  set(name: string, value: string, options?: Cookies.CookieAttributes): void {
    Cookies.set(name, value, {
      expires: 7, // 7 days
      sameSite: 'strict',
      ...options
    })
  },

  remove(name: string): void {
    Cookies.remove(name)
  }
}
