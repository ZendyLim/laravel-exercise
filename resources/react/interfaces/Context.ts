import React from 'react'
import { User } from './User'

export interface Context {
  user: User | null | undefined
  setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>
  addSnack: (message: string, severity: 'error' | 'warning' | 'info' | 'success') => void
}
