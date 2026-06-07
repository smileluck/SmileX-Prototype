import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

const WEBSITE_DIR = path.resolve(__dirname, 'website')

function websiteApi(): Plugin {
  return {
    name: 'website-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', `http://${req.headers.host}`)

        // GET /api/projects - list all projects
        if (url.pathname === '/api/projects' && req.method === 'GET') {
          try {
            if (!fs.existsSync(WEBSITE_DIR)) {
              sendJson(res, [])
              return
            }
            const dirs = fs.readdirSync(WEBSITE_DIR, { withFileTypes: true })
              .filter(d => d.isDirectory() && fs.existsSync(path.join(WEBSITE_DIR, d.name, 'index.json')))
            const projects = dirs.map(d => {
              try {
                const raw = fs.readFileSync(path.join(WEBSITE_DIR, d.name, 'index.json'), 'utf-8')
                return JSON.parse(raw)
              } catch { return null }
            }).filter(Boolean)
            sendJson(res, projects)
          } catch (e) {
            sendJson(res, { error: String(e) }, 500)
          }
          return
        }

        // match /api/projects/:slug/images/:filename — serve image file
        const imageMatch = url.pathname.match(/^\/api\/projects\/([^/]+)\/images\/(.+)$/)
        if (imageMatch && req.method === 'GET') {
          const slug = imageMatch[1]
          const filename = decodeURIComponent(imageMatch[2])
          const filePath = path.join(WEBSITE_DIR, slug, 'images', filename)
          if (!fs.existsSync(filePath)) {
            sendJson(res, { error: 'Not found' }, 404)
            return
          }
          const ext = path.extname(filename).toLowerCase()
          const mimeMap: Record<string, string> = {
            '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
            '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
            '.md': 'text/plain; charset=utf-8',
          }
          const data = fs.readFileSync(filePath)
          res.statusCode = 200
          res.setHeader('Content-Type', mimeMap[ext] ?? 'application/octet-stream')
          res.setHeader('Content-Length', data.length)
          res.end(data)
          return
        }

        // match /api/projects/:slug/images — list images
        const imagesListMatch = url.pathname.match(/^\/api\/projects\/([^/]+)\/images$/)
        if (imagesListMatch && req.method === 'GET') {
          const slug = imagesListMatch[1]
          const imagesDir = path.join(WEBSITE_DIR, slug, 'images')
          if (!fs.existsSync(imagesDir)) {
            sendJson(res, { images: [] })
            return
          }
          const files = fs.readdirSync(imagesDir).filter(f =>
            fs.statSync(path.join(imagesDir, f)).isFile()
          )
          const images = files.map(f => ({
            name: f,
            url: `/api/projects/${encodeURIComponent(slug)}/images/${encodeURIComponent(f)}`,
          }))
          sendJson(res, { images })
          return
        }

        // match /api/projects/:slug
        const match = url.pathname.match(/^\/api\/projects\/([^/]+)$/)
        if (match) {
          const slug = match[1]
          const projectDir = path.join(WEBSITE_DIR, slug)
          const jsonPath = path.join(projectDir, 'index.json')
          const htmlPath = path.join(projectDir, 'index.html')

          // GET - load project
          if (req.method === 'GET') {
            try {
              if (!fs.existsSync(jsonPath)) {
                sendJson(res, { error: 'Not found' }, 404)
                return
              }
              const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
              let generatedCode = ''
              if (fs.existsSync(htmlPath)) {
                generatedCode = fs.readFileSync(htmlPath, 'utf-8')
              }
              sendJson(res, { ...meta, generatedCode })
            } catch (e) {
              sendJson(res, { error: String(e) }, 500)
            }
            return
          }

          // POST - save project
          if (req.method === 'POST') {
            try {
              const body = await readBody(req)
              const data = JSON.parse(body)
              const { generatedCode, ...meta } = data

              fs.mkdirSync(projectDir, { recursive: true })
              fs.writeFileSync(jsonPath, JSON.stringify(meta, null, 2), 'utf-8')
              if (generatedCode) {
                fs.writeFileSync(htmlPath, generatedCode, 'utf-8')
              }
              sendJson(res, { ok: true })
            } catch (e) {
              sendJson(res, { error: String(e) }, 500)
            }
            return
          }

          // DELETE - remove project
          if (req.method === 'DELETE') {
            try {
              if (fs.existsSync(projectDir)) {
                fs.rmSync(projectDir, { recursive: true, force: true })
              }
              sendJson(res, { ok: true })
            } catch (e) {
              sendJson(res, { error: String(e) }, 500)
            }
            return
          }
        }

        next()
      })
    },
  }
}

function sendJson(res: any, data: any, status = 200) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

function readBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    req.on('error', reject)
  })
}

export default defineConfig({
  plugins: [react(), tailwindcss(), websiteApi()],
})
