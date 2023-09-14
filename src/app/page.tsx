import Image from 'next/image'

export default function Home() {
  return (
    <div className='w-96 border p-4'>
      <div className='chat chat-start'>
        <div className='chat-bubble'>
          It's over Anakin, <br />I have the high ground.
        </div>
      </div>
      <div className='chat chat-end'>
        <div className='chat-bubble'>You underestimate my power!</div>
      </div>
    </div>
  )
}
