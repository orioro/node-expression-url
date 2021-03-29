import { SerializableSearchParams, SerializableURLObject } from './types'

/**
 * @function serializableSearchParams
 * @param {URLSearchParams} searchParams
 * @returns {SerializableSearchParams}
 */
export const serializableSearchParams = (
  searchParams: URLSearchParams
): SerializableSearchParams => {
  const _searchParams = {}

  if (searchParams) {
    for (const key of searchParams.keys()) {
      const lowerKey = key.toLowerCase()
      _searchParams[lowerKey] = searchParams.get(key)
    }
  }

  return _searchParams
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/URL
 * @function serializableURLObject
 * @param {Whatwg URL} url
 * @returns {SerializableURLObject}
 */
export const serializableURLObject = (url: URL): SerializableURLObject => {
  const {
    hash,
    host,
    hostname,
    href,
    origin,
    password,
    pathname,
    port,
    protocol,
    search,
    username,
  } = url

  return {
    hash,
    host,
    hostname,
    href,
    origin,
    password,
    pathname,
    port,
    protocol,
    search,
    username,
    searchParams: serializableSearchParams(url.searchParams),
  }
}
