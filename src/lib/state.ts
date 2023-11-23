import { atom } from 'jotai'
export const chatProgressAtom = atom({
  token: '',
  subtoken: 0
})

export const editAccountModalAtom = atom(false)
