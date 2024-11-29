import JSEncrypt from 'jsencrypt'

const publicKey =
  'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAvDtzi37fGre3M8RKdyLJIAon56tUCN5LOQcmYeYDjLQAzX9ZNMUcGU3cKzJc5/nZ+4T8oQ1Gkkn1QaS72w3xvQIDAQABAkEAoPhCdn+38ZQ8gnORrtI7pz+oIpE8mxzmvU0lAMGANZjeRnIP2pFARiQi4eYHDOsz/DlgJZjqPBqlF5C2M82A4QIhANxtPgvKgJtR2NntAXBiY0WoLRAuG9U+38HZkKc9eunFAiEA2pweW5FVzBvaiUUwd6WX5ApFeQbE6rycYZzv+4uZ/5kCIGczzoT+vs/5tinySWYw6oHGh7K3o9hno6PDFXL32gBxAiAyRZqZlhdz46fiz11w9kyyrUYCqfLYxFz1+aAaaaUVaQIgEa+46yPJ3n9wnedIoTi1LrzM4a/nqkYTL36GteUq2EA='

const privateKey =
  'MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEA0vfvyTdGJkdbHkB8\n' +
  'mp0f3FE0GYP3AYPaJF7jUd1M0XxFSE2ceK3k2kw20YvQ09NJKk+OMjWQl9WitG9p\n' +
  'B6tSCQIDAQABAkA2SimBrWC2/wvauBuYqjCFwLvYiRYqZKThUS3MZlebXJiLB+Ue\n' +
  '/gUifAAKIg1avttUZsHBHrop4qfJCwAI0+YRAiEA+W3NK/RaXtnRqmoUUkb59zsZ\n' +
  'UBLpvZgQPfj1MhyHDz0CIQDYhsAhPJ3mgS64NbUZmGWuuNKp5coY2GIj/zYDMJp6\n' +
  'vQIgUueLFXv/eZ1ekgz2Oi67MNCk5jeTF2BurZqNLR3MSmUCIFT3Q6uHMtsB9Eha\n' +
  '4u7hS31tj1UWE+D+ADzp59MGnoftAiBeHT7gDMuqeJHPL4b+kC+gzV4FGTfhR9q3\n' +
  'tTbklZkD2A=='

// 加密
export function encrypt(txt: string = '') {
  const encryptor = new JSEncrypt({})
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) || '' // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt: string) {
  const encryptor = new JSEncrypt({})
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}
