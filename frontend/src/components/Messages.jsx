import { useEffect, useRef } from "react"

export default function Messages({ messages }) {
  const messagesContainer = useRef(null)

  useEffect(() => {
    messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight
  }, [messages])

  return (
    <ul ref={messagesContainer} className='h-full overflow-auto text-white gap-1 p-2 flex flex-col messages-container'>
      {messages.map((message, index) => (
        <li key={index} className={`rounded-md p-1 animate-fade-up animate-once animate-ease-out animate-duration-[600ms]
             px-3 max-w-[80%] break-words w-fit ${message.from === 'Me' ? 'bg-blue-700 self-end' : 'bg-gray-700'}`}>
          <small className='opacity-90 font-semibold'>{message.from}</small>
          <br />
          {message.data}
        </li>
      ))}
    </ul>
  )
}