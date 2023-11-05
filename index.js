import { STATUS_CODES } from 'node:http'
import assert from 'node:assert'

const handler = async (req, res, apiKey, fetch, log) => {
  const address = req.url.split('/')[1].trim()
  const fetchRes = await fetch(
    `https://public.chainalysis.com/api/v1/address/${address}`,
    {
      headers: {
        'X-API-Key': apiKey,
        accept: 'application/json'
      }
    }
  )
  assert(fetchRes.ok, `Chainalysis API status ${fetchRes.status}`)
  const body = await fetchRes.json()
  res.statusCode = body.identifications.length > 0 ? 403 : 200
  res.end(STATUS_CODES[res.statusCode])
}

export const createHandler = ({
  apiKey,
  fetch = globalThis.fetch,
  log = console.log
}) => (req, res) => {
  handler(req, res, apiKey, fetch, log).catch(err => {
    log(err)
    res.statusCode = 500
    res.end('Internal Server Error')
  })
}
