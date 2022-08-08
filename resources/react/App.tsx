import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Axios from 'axios'

import { Alert, Snackbar } from '@mui/material'

import { Context } from './interfaces/Context'
import { User } from './interfaces/User'
import { SnackbarMessage } from './interfaces/SnackbarMessage'

import { LoadingPage } from './pages/loading'

export function App() {
  const [user, setUser] = useState<User | null | undefined>()
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([])
  const [open, setOpen] = useState(false)
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const context: Context = {
    user,
    setUser,
    addSnack,
  }

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] })
      setSnackPack((prev) => prev.slice(1))
      setOpen(true)
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false)
    }
  }, [snackPack, messageInfo, open])

  function addSnack(message: string, severity: 'error' | 'warning' | 'info' | 'success') {
    setSnackPack((prev) => [...prev, { message, severity, key: new Date().getTime() }])
  }

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const handleExited = () => {
    setMessageInfo(undefined)
  }

  function signOut() {
    Axios.get('/api/signout').then(() => setUser(undefined))
  }

  useEffect(() => {
    Axios.get('/api/me')
      .then((result) => {
        if (result.data) {
          setUser(result.data as User)
        }
      })
      .catch((err) => {
        switch (err.code) {
          case 401:
            // Do Nothing
            break
          default:
            // TODO 500 error page
            break
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <LoadingPage />

  return (
    <>
      {user && (
        <Alert>
          Hi {user.firstName} {user.lastName}, welcome to your admin account.{' '}
          {
            <a style={{ cursor: 'pointer', fontWeight: 500 }} onClick={signOut}>
              (Sign out)
            </a>
          }
        </Alert>
      )}
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
      >
        <Alert onClose={handleClose} severity={messageInfo ? messageInfo.severity : 'info'} sx={{ width: '100%' }}>
          {messageInfo ? messageInfo.message : ''}
        </Alert>
      </Snackbar>
      <Outlet context={context} />
    </>
  )
}
