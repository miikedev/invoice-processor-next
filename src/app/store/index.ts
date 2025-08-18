import { Provider, atom, useAtom, useSetAtom } from 'jotai'

const uploadMethodAtom = atom<'file' | 'camera' | null>(null);
const capturingAtom = atom(false)
const uploadingAtom = atom(false)
const authUserIdAtom = atom(null);

export { Provider, uploadingAtom, capturingAtom, uploadMethodAtom, useAtom, authUserIdAtom }