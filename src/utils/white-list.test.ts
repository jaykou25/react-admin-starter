import { inWhiteList } from './whiteList'

test('whitelist', () => {
  expect(inWhiteList('/sso')).toBe(true)
  expect(inWhiteList('/login')).toBe(true)
  expect(inWhiteList('login')).toBe(false)
  expect(inWhiteList('/')).toBe(false)
})
