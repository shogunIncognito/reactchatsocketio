import express from 'express'
import http from 'http'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url';
import { Server as SocketServer } from 'socket.io'

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url));
const server = http.createServer(app)
const io = new SocketServer(server)
const PORT = process.env.PORT || 3000

app.use(express.static(join(__dirname, '../frontend/dist')));

io.on('connection', socket => {
  socket.on('typing', username => {
    socket.broadcast.emit('typing', username)
  })

  socket.on('stopTyping', username => {
    socket.broadcast.emit('stopTyping', username)
  })

  socket.on('message', data => {
    socket.broadcast.emit('message', {
      data: data.message,
      from: data.username
    })
  })
})

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})