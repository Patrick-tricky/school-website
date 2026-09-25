const http = require('http')
const fs = require('fs')
const path = require('path')

// Map file extensions to their correct content-type
const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

const server = http.createServer((req, res) => {
  // Treat "/" as a request for the homepage
  let urlPath = req.url === '/' ? '/SHM.html' : req.url

  // Strip any query string (e.g. /shm1.png?v=2)
  urlPath = urlPath.split('?')[0]

  // Resolve the file path safely inside the current directory
  const filePath = path.join(__dirname, urlPath)

  // Prevent directory traversal (e.g. /../../etc/passwd)
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'content-type': 'text/plain' })
    res.end('403 Forbidden')
    return
  }

  const ext = path.extname(filePath).toLowerCase()
  const contentType = contentTypes[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(`404: ${req.url}`)
      res.writeHead(404, { 'content-type': 'text/html' })
      res.end('<h1>404 - Page Not Found</h1>')
      return
    }

    console.log(`200: ${req.url}`)
    res.writeHead(200, { 'content-type': contentType })
    res.end(data)
  })
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})