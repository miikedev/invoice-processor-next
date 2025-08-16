import { Provider, atom, useAtom, useSetAtom } from 'jotai'

const uploadMethodAtom = atom<'file' | 'camera' | null>(null);
const capturingAtom = atom(false)
const uploadingAtom = atom(false)

export { Provider, uploadingAtom, capturingAtom, uploadMethodAtom, useAtom }