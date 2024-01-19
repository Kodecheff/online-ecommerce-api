import http, {Server, IncomingMessage, ServerResponse} from 'http'
import os from 'os'

let hostname: string = '127.0.0.1'
let port: number = 1204

let server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

  // OS module
  const OSData = {
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    homeDir: os.homedir(),
    owner: os.hostname()
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end(`<pre>${JSON.stringify(OSData)}</pre>`)
})

server.listen(port, hostname, () => {
  console.log(`Now running server on http://${hostname}:${port}`)
})