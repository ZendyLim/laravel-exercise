import React from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import Axios, { AxiosResponse } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { Link, useOutletContext } from 'react-router-dom'
import * as Yup from 'yup'

import { Button, TextField } from '@mui/material'

import { Context } from '../../interfaces/Context'
import { User } from '../../interfaces/User'

import styles from './styles.module.scss'

interface SignInForm {
  email: string
  password: string
}

const schema = Yup.object({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().label('Password'),
}).required()

export function SignInPage() {
  const { control, handleSubmit } = useForm<SignInForm>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  })

  const context = useOutletContext<Context>()

  function onSubmit(data: SignInForm) {
    Axios.post<SignInForm, AxiosResponse<User>>('/api/signin', data, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((result) => {
        if (result.data) {
          context.setUser(result.data as User)
        }
      })
      .catch((err) => {
        switch (err.response?.status) {
          case 401:
          case 422:
            context.addSnack('Invalid credentials.', 'error')
            break
          default:
            context.addSnack('Something has gone wrong!', 'error')
            break
        }
      })
  }

  return (
    <div className={styles.signIn}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <span className={styles.title}>Login</span>
        <div>
          <Controller
            name="email"
            control={control}
            render={({ field, formState }) => (
              <TextField
                {...field}
                className={styles.input}
                variant="standard"
                label="Email address"
                size="small"
                error={!!formState.errors?.email}
                helperText={formState.errors?.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, formState }) => (
              <TextField
                {...field}
                className={styles.input}
                variant="standard"
                label="Password"
                size="small"
                type="password"
                error={!!formState.errors?.password}
                helperText={formState.errors?.password?.message}
              />
            )}
          />
        </div>
        <Button type="submit" className={styles.button} variant="contained" disableElevation>
          Login
        </Button>
        <p className={styles.createAccount}>
          No account yet?{' '}
          <Link className={styles.createAccountLink} to={'/auth/signup'}>
            Create one here
          </Link>
          .
        </p>
      </form>
    </div>
  )
}
