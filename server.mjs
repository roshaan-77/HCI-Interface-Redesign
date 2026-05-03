import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const root = process.cwd()
const port = Number(process.env.PORT || 5173)

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

const resolvePath = async (urlPath) => {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '')
  const requested = clean === '/' ? '/public/preview.html' : clean
  const candidates = [
    join(root, requested),
    join(root, 'public', requested),
  ]

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate)
      if (info.isFile()) return candidate
    } catch {
      // Try the next candidate.
    }
  }

  return join(root, 'public', 'preview.html')
}

createServer(async (request, response) => {
  const filePath = await resolvePath(request.url || '/')
  response.setHeader('Content-Type', mime[extname(filePath)] || 'application/octet-stream')
  createReadStream(filePath).pipe(response)
}).listen(port, () => {
  console.log(`Yale Art redesign preview running at http://localhost:${port}`)
})
