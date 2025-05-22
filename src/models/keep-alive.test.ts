import { setLatest } from './keep-alive'

describe('setLatest', () => {
  it('should add a new key-value pair to the map', () => {
    const map = new Map()
    setLatest(map, 'key1', 'value1')
    expect(map.get('key1')).toBe('value1')
  })

  it('should update the value if the key already exists', () => {
    const map = new Map([['key1', 'oldValue']])
    setLatest(map, 'key1', 'newValue')
    expect(map.get('key1')).toBe('newValue')
  })

  it('should delete the earliest inserted data when the map exceeds MAX_CACHE_PAGES', () => {
    const map = new Map()
    const MAX_CACHE_PAGES = 3 // 假设 MAX_CACHE_PAGES 为 3

    setLatest(map, 'key1', 'value1')
    setLatest(map, 'key2', 'value2')
    setLatest(map, 'key3', 'value3')
    setLatest(map, 'key4', 'value4')

    expect(map.size).toBe(MAX_CACHE_PAGES)
    expect(map.has('key1')).toBe(false)
    expect(map.has('key2')).toBe(true)
    expect(map.has('key3')).toBe(true)
    expect(map.has('key4')).toBe(true)
  })

  it('should handle adding multiple entries beyond the limit', () => {
    const map = new Map()
    const MAX_CACHE_PAGES = 3

    setLatest(map, 'key1', 'value1')
    setLatest(map, 'key2', 'value2')
    setLatest(map, 'key3', 'value3')
    setLatest(map, 'key4', 'value4')
    setLatest(map, 'key5', 'value5')

    expect(map.size).toBe(MAX_CACHE_PAGES)
    expect(map.has('key1')).toBe(false)
    expect(map.has('key2')).toBe(false)
    expect(map.has('key3')).toBe(true)
    expect(map.has('key4')).toBe(true)
    expect(map.has('key5')).toBe(true)
  })

  it('should work correctly when MAX_CACHE_PAGES is 1', () => {
    const map = new Map()
    map.set('key1', 'value1')
    map.set('key2', 'value2')
    map.set('key3', 'value3')
    map.set('key4', 'value4')
    map.set('key5', 'value5')

    setLatest(map, 'key6', 'value6')
    expect(map.size).toBe(3)
    expect(map.has('key1')).toBe(false)
    expect(map.has('key2')).toBe(false)
    expect(map.has('key3')).toBe(false)
    expect(map.has('key4')).toBe(true)
    expect(map.has('key5')).toBe(true)
    expect(map.has('key6')).toBe(true)
  })
})
