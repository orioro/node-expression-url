import { ALL_EXPRESSIONS } from '@orioro/expression'
import { $url, $urlParse, $urlMatches, $urlSet } from './'
import * as PUBLIC_API from './'
import { prepareEvaluateTestCases } from '@orioro/jest-util-expression'

const evTestCases = prepareEvaluateTestCases({
  ...ALL_EXPRESSIONS,
  $url,
  $urlParse,
  $urlMatches,
  $urlSet,
})

const FULL_URL_EXAMPLE =
  'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'

test('public api', () => {
  expect(Object.keys(PUBLIC_API)).toMatchSnapshot()
})

describe('$url', () => {
  evTestCases([
    ['https://example.com', ['$url'], 'https://example.com/'],
    [{}, ['$url'], TypeError],
    [
      {
        protocol: 'ftp',
        host: 'example.com',
      },
      ['$url'],
      'ftp://example.com/',
    ],
    [{ host: 'localhost:9000' }, ['$url'], 'https://localhost:9000/'],
    [{ hostname: 'localhost', port: '80' }, ['$url'], 'https://localhost:80/'],
    [
      { hostname: 'localhost', username: 'user', password: 'pwd' },
      ['$url'],
      'https://user:pwd@localhost/',
    ],
    [
      { host: 'localhost:9000', pathname: 'some/path' },
      ['$url'],
      'https://localhost:9000/some/path',
    ],
    [
      { host: 'localhost:9000', search: '?key=value' },
      ['$url'],
      'https://localhost:9000/?key=value',
    ],
    [
      { host: 'localhost:9000', searchParams: { key: 'value' } },
      ['$url'],
      'https://localhost:9000/?key=value',
    ],
    [
      {
        host: 'localhost:9000',
        searchParams: { key: 'value' },
        hash: 'some-hash-value',
      },
      ['$url'],
      'https://localhost:9000/?key=value#some-hash-value',
    ],
  ])
})

describe('$urlParse', () => {
  evTestCases([
    [
      'https://example.com',
      ['$urlParse'],
      {
        href: 'https://example.com/',
        origin: 'https://example.com',
        protocol: 'https:',
        username: '',
        password: '',
        host: 'example.com',
        hostname: 'example.com',
        port: '',
        pathname: '/',
        search: '',
        searchParams: {},
        hash: '',
      },
    ],
    [
      'https://user:pass@example.com:9000/path/to/somewhere?key1=value1&key2=value2#hash-value',
      ['$urlParse'],
      {
        href:
          'https://user:pass@example.com:9000/path/to/somewhere?key1=value1&key2=value2#hash-value',
        origin: 'https://example.com:9000',
        protocol: 'https:',
        username: 'user',
        password: 'pass',
        host: 'example.com:9000',
        hostname: 'example.com',
        port: '9000',
        pathname: '/path/to/somewhere',
        search: '?key1=value1&key2=value2',
        searchParams: {
          key1: 'value1',
          key2: 'value2',
        },
        hash: '#hash-value',
      },
    ],
  ])
})

describe('$urlMatches', () => {
  evTestCases([
    ['https://example.com', ['$urlMatches', { hostname: 'example.com' }], true],
    ['https://example.com', ['$urlMatches', { protocol: 'https:' }], true],
    ['sftp://example.com', ['$urlMatches', { protocol: 'https:' }], false],
    ['sftp://example.com', ['$urlMatches', { protocol: 'sftp:' }], true],
    [
      FULL_URL_EXAMPLE,
      [
        '$urlMatches',
        {
          'searchParams.query': 'string',
        },
      ],
      true,
    ],
    [
      FULL_URL_EXAMPLE,
      [
        '$urlMatches',
        {
          hostname: 'sub.example.com',
          'searchParams.query': 'string',
        },
      ],
      true,
    ],
    [
      FULL_URL_EXAMPLE,
      [
        '$urlMatches',
        {
          hostname: 'example.com',
          'searchParams.query': 'string',
        },
      ],
      false,
    ],
    [
      FULL_URL_EXAMPLE,
      [
        '$urlMatches',
        {
          hostname: { $stringEndsWith: 'example.com' },
          'searchParams.query': 'string',
        },
      ],
      true,
    ],
    [FULL_URL_EXAMPLE, ['$urlMatches', { port: '8080' }], true],
    [FULL_URL_EXAMPLE, ['$urlMatches', { port: '80' }], false],
  ])
})

describe('$urlSet', () => {
  evTestCases([
    [
      'https://example.com:8080/',
      ['$urlSet', { hostname: 'subdomain.example.com' }],
      'https://subdomain.example.com:8080/',
    ],
    [
      FULL_URL_EXAMPLE,
      ['$urlSet', { host: 'test.org' }],
      'https://user:pass@test.org:8080/p/a/t/h?query=string#hash',
    ],
    [
      FULL_URL_EXAMPLE,
      ['$urlSet', { host: 'test.org', port: '' }],
      'https://user:pass@test.org/p/a/t/h?query=string#hash',
    ],
  ])
})
