import {
  InterpreterSpec,
  EvaluationContext,
  evaluate,
} from '@orioro/expression'
import { indefiniteObjectOfType } from '@orioro/typing'
import { SerializableURLObject, URLObjectInput, PlainObject } from './types'

import { serializableURLObject } from './util'

export * from './util'

const URL_OBJECT_INPUT_TYPE_SPEC = {
  protocol: ['string', 'undefined'],
  username: ['string', 'undefined'],
  password: ['string', 'undefined'],
  host: ['string', 'undefined'],
  hostname: ['string', 'undefined'],
  port: ['string', 'number', 'undefined'],
  pathname: ['string', 'undefined'],
  hash: ['string', 'undefined'],
  search: ['string', 'undefined'],
  searchParams: [indefiniteObjectOfType('string'), 'undefined'],
}

const _urlSet = (baseUrl: string, set: URLObjectInput): string => {
  if (!set.host && !set.hostname) {
    throw new TypeError('Either host or hostname must be provided')
  }

  const url = new URL(baseUrl)

  // protocol
  if (set.protocol !== undefined) {
    url.protocol = set.protocol
  }

  // auth - username:password
  if (set.username !== undefined) {
    url.username = set.username
  }

  if (set.password !== undefined) {
    url.password = set.password
  }

  // host - hostname:port
  url.host = set.hostname ? set.hostname : set.host // hostname:port have precedence over host

  if (set.port !== undefined) {
    url.port = set.port + ''
  }

  // pathname
  if (set.pathname !== undefined) {
    url.pathname = set.pathname
  }

  // search
  if (set.searchParams !== undefined) {
    url.search = new URLSearchParams(set.searchParams).toString()
  } else if (set.search !== undefined) {
    url.search = set.search
  }

  // hash
  if (set.hash) {
    url.hash = set.hash
  }

  return url.toString()
}

// From Node.js URL docs:
// https://nodejs.org/api/url.html#url_url_strings_and_url_objects
//
// ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
// │                                              href                                              │
// ├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
// │ protocol │  │        auth         │          host          │           path            │ hash  │
// │          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
// │          │  │                     │    hostname     │ port │ pathname │     search     │       │
// │          │  │                     │                 │      │          ├─┬──────────────┤       │
// │          │  │                     │                 │      │          │ │    query     │       │
// "  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
// │          │  │          │          │    hostname     │ port │          │                │       │
// │          │  │          │          ├─────────────────┴──────┤          │                │       │
// │ protocol │  │ username │ password │          host          │          │                │       │
// ├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
// │   origin    │                     │         origin         │ pathname │     search     │ hash  │
// ├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
// │                                              href                                              │
// └────────────────────────────────────────────────────────────────────────────────────────────────┘
//
/**
 * @function $url
 * @param {String | URLObjectInput} input
 * @param {String} [base]
 * @returns {URL}
 */
export const $url: InterpreterSpec = [
  (input: string | URLObjectInput, base?: string): string => {
    if (typeof input === 'string') {
      return new URL(input, base).toString()
    } else {
      // protocol defaults to https, others to empty ('')
      return _urlSet('https://host/', input)
    }
  },
  [
    ['string', URL_OBJECT_INPUT_TYPE_SPEC],
    ['string', 'undefined'],
  ],
  {
    defaultParam: 0,
  },
]

/**
 * @function $urlParse
 * @param {URL} [url=$$VALUE]
 * @returns {SerializableURLObject}
 */
export const $urlParse = [
  (url: string): SerializableURLObject => serializableURLObject(new URL(url)),
  ['string'],
]

/**
 * @function $urlMatches
 * @param {Object} criteriaByPath
 * @param {URL} [url=$$VALUE]
 * @returns {Boolean}
 */
export const $urlMatches = [
  (
    criteriaByPath: PlainObject,
    url: string,
    context: EvaluationContext
  ): boolean =>
    evaluate(
      {
        ...context,
        scope: {
          $$VALUE: serializableURLObject(new URL(url)),
        },
      },
      ['$objectMatches', criteriaByPath]
    ),
  [indefiniteObjectOfType('any'), 'string'],
]

/**
 * @function $urlSet
 * @param {URLObjectInput} input
 * @param {URL} url
 * @returns {URL}
 */
export const $urlSet = [
  (input: URLObjectInput, url: string): string => _urlSet(url, input),
  [URL_OBJECT_INPUT_TYPE_SPEC, 'string'],
]
