import { getSafePathname } from './common'

describe('getSafePathname', () => {
  const originalWindow = { ...window }

  beforeEach(() => {
    // 在每个测试用例前重置 window 对象
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '/' },
    })
  })

  afterEach(() => {
    // 测试后恢复原始 window 对象
    window = { ...originalWindow }
  })

  it('should remove base prefix from pathname', () => {
    window.base = '/admin'
    expect(getSafePathname('/admin/users')).toBe('/users')
  })

  it('should remove base prefix from pathname', () => {
    window.base = '/admin/'
    expect(getSafePathname('/admin/users')).toBe('/users')
  })

  it('should remove trailing slash from pathname', () => {
    expect(getSafePathname('/users/')).toBe('/users')
    expect(getSafePathname('/users//')).toBe('/users')
  })

  it('should not remove trailing slash from root path', () => {
    expect(getSafePathname('/')).toBe('/')
  })

  it('should handle empty base and pathname', () => {
    window.base = ''
    expect(getSafePathname('/')).toBe('/')
    expect(getSafePathname('/home')).toBe('/home')
  })

  it('should handle root base and pathname', () => {
    window.base = '/'
    expect(getSafePathname('/')).toBe('/')
    expect(getSafePathname('/home')).toBe('/home')
  })

  it('should handle pathname equal to base', () => {
    window.base = '/admin'
    expect(getSafePathname('/admin')).toBe('/')
  })

  it('should work with default window.location.pathname', () => {
    // 设置测试用例的 pathname
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '/app/dashboard' },
    })
    window.base = ''
    expect(getSafePathname()).toBe('/app/dashboard')
  })

  it('should work with default window.location.pathname with base', () => {
    // 设置测试用例的 pathname
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { pathname: '/app/dashboard' },
    })
    window.base = '/app'
    expect(getSafePathname()).toBe('/dashboard')
  })

  it('should remove base and trailing slash', () => {
    window.base = '/admin'
    expect(getSafePathname('/admin/users/')).toBe('/users')
  })
})
