'use client'

import { useEffect, useRef, useState } from 'react'
import { useUser } from './UserProvider'
import { updateUser } from '@/services/firebase/firestore'
import { toast } from 'react-hot-toast'
import { useAtom } from 'jotai'
import { editAccountModalAtom } from '@/lib/state'

function MyAccount() {
  const user = useUser()
  const [showModal, setShowModal] = useAtom(editAccountModalAtom)
  const [name, setName] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (showModal) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [showModal])
  if (!user) return null
  if (user === 'loading')
    return (
      <div className='avatar'>
        <div className='w-12 rounded-full bg-gray-200 animate-pulse' />
      </div>
    )
  return (
    <div>
      <button className='avatar' onClick={() => setShowModal(true)}>
        <div className='w-12 rounded-full'>
          <img src={user.photoURL || ''} />
        </div>
      </button>
      <dialog ref={dialogRef} className='modal modal-middle'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Edit Your Name!</h3>
          <div className='flex gap-2'>
            <input
              id='name'
              type='text'
              className='input input-primary'
              placeholder={user.displayName || 'Your Name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className='btn btn-primary'
              onClick={async () => {
                await updateUser(user.uid, { displayName: name })
                toast.success('Name Updated!')
              }}
            >
              Save
            </button>
          </div>
          <div className='modal-action'>
            <form method='dialog'>
              <button className='btn' onClick={() => setShowModal(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default MyAccount
