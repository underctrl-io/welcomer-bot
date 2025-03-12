import { atom } from 'jotai';
import type { APIUser } from '../data/user';

export const userAtom = atom<APIUser | null>(null);
