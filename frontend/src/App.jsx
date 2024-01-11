import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import Messages from './components/Messages'

const socket = io('/')

export default function App() {
  const [username, setUsername] = useState(window.localStorage.getItem('username') || '')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!username) return alert('Please enter a username')
    if (!(message.trim())) return alert('Please enter a message')

    socket.emit('message', { username, message })

    const newMessage = {
      data: message,
      from: 'Me'
    }

    handleStopTyping()
    setMessages(prev => [...prev, newMessage])
    setMessage('')
    window.localStorage.setItem('username', username)
  }

  const handleMessageChange = e => {
    if (!(username.trim())) return alert('Please enter a username')
    setMessage(e.target.value)
    socket.emit('typing', username)
  }

  const handleStopTyping = () => {
    socket.emit('stopTyping', username)
  }

  useEffect(() => {
    socket.on('message', message => setMessages(prev => [...prev, message]))
    socket.on('typing', username => 
      setTyping(prev => [...new Set([...prev, username])])
    )
    socket.on('stopTyping', username => {
      setTyping(prev => prev.filter(user => user !== username))
    })

    return () => {
      socket.off('message')
      socket.off('typing')
      socket.off('stopTyping')
    }
  }, [])

  return (
    <div className='h-screen flex-col bg-neutral-950 flex justify-center items-center'>
      <div className='bg-slate-800 max-h-[80%] md:max-h-[50%] md:max-w-[50%] max-w-[80%] gap-3 md:w-1/2 md:h-1/2 w-4/5 h-4/5 flex flex-col p-3 rounded-md'>
        <h2 className='text-white text-center text-2xl'>Live Chat</h2>
        <input
          type="text"
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='p-1 rounded w-1/3 bg-transparent border-b border-white focus:border-blue-400 transition-colors text-white outline-none'
        />
        
        <Messages messages={messages} />

        <div>
          {typing.length > 0 && (
            <small className='text-gray-400'>
              {typing.length === 1 ? `${typing[0]} is typing...` : `${typing.join(', ')} are typing...`}
            </small>          
          )}
        </div>
        
        <form onSubmit={handleSubmit} className='flex gap-2'>
          <input
            type="text"
            value={message}
            placeholder='Write your message'
            onBlur={handleStopTyping}
            onChange={handleMessageChange}
            className='p-1 rounded w-full bg-transparent border-b border-white focus:border-blue-400 transition-colors text-white outline-none'
          />
          <button className='p-1 px-4 bg-green-600 text-white rounded'>Send</button>
        </form>
      </div>
    </div>
  )
}