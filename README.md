# expressionUrl

```
npm install @orioro/expression-url
yarn add @orioro/expression-url
```

# API Docs

- [`$url(input, base)`](#urlinput-base)
- [`$urlParse(url)`](#urlparseurl)
- [`$urlMatches(criteriaByPath, url)`](#urlmatchescriteriabypath-url)
- [`$urlSet(input, url)`](#urlsetinput-url)
- [`URL_EXPRESSIONS`](#url_expressions)
- [`serializableSearchParams(searchParams)`](#serializablesearchparamssearchparams)
- [`serializableURLObject(url)`](#serializableurlobjecturl)

##### `$url(input, base)`

- `input` {String | URLObjectInput}
- `base` {String}
- Returns: {URL} 

##### `$urlParse(url)`

- `url` {URL}
- Returns: {SerializableURLObject} 

##### `$urlMatches(criteriaByPath, url)`

- `criteriaByPath` {Object}
- `url` {URL}
- Returns: {Boolean} 

##### `$urlSet(input, url)`

- `input` {URLObjectInput}
- `url` {URL}
- Returns: {URL} 

##### `URL_EXPRESSIONS`



##### `serializableSearchParams(searchParams)`

- `searchParams` {URLSearchParams}
- Returns: {SerializableSearchParams} 

##### `serializableURLObject(url)`

https://developer.mozilla.org/en-US/docs/Web/API/URL

- `url` {Whatwg URL}
- Returns: {SerializableURLObject}
