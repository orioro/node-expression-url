export type PlainObject = { [key: string]: any }

export type SerializableSearchParams = { [key: string]: string }

export type SerializableURLObject = {
  hash?: string
  host: string
  hostname: string
  href: string
  origin: string
  password?: string
  pathname: string
  port?: string
  protocol: string
  search?: string
  searchParams?: SerializableSearchParams
  username?: string
}

export type URLObjectInput = {
  protocol?: string
  username?: string
  password?: string
  host: string
  hostname?: string
  port?: string
  pathname?: string
  search?: string
  searchParams?: SerializableSearchParams
  hash?: string
}
