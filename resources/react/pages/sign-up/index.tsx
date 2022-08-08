import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Controller, useForm } from 'react-hook-form'
import Axios, { AxiosResponse } from 'axios'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useOutletContext } from 'react-router-dom'

import TextField from '@mui/material/TextField'
import { Button } from '@mui/material'

import { User } from '../../interfaces/User'
import { Context } from '../../interfaces/Context'

import styles from './styles.module.scss'

interface SignUpForm {
  firstName: string
  lastName: string
  email: string
  emailConfirm: string
  password: string
  passwordConfirm: string
  recaptcha: string | null
}

const schema = Yup.object({
  firstName: Yup.string().required().max(255).label('First name'),
  lastName: Yup.string().required().max(255).label('Surname'),
  email: Yup.string().required().email().max(255).label('Email'),
  emailConfirm: Yup.string()
    .required()
    .label('Email')
    .oneOf([Yup.ref('email'), null], 'Email must match'),
  password: Yup.string().required().min(8).label('Password'),
  passwordConfirm: Yup.string()
    .required()
    .label('Password')
    .oneOf([Yup.ref('password'), null], 'Password must match'),
  recaptcha: Yup.string().required('Please confirm that you are not a robot'),
}).required()

export function SignUpPage() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  })

  const context = useOutletContext<Context>()

  function onSubmit(data: SignUpForm) {
    Axios.post<SignUpForm, AxiosResponse<User>>('/api/signup', data, {
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
          case 422:
            context.addSnack(err.response.data.message, 'error')
            break
          default:
            context.addSnack('Something has gone wrong!', 'error')
            break
        }
      })
  }

  return (
    <div className={styles.signUp}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <span className={styles.title}>Create your account</span>
        <div>
          <Controller
            name="firstName"
            control={control}
            render={({ field, formState }) => (
              <TextField
                {...field}
                className={styles.input}
                variant="standard"
                label="First name"
                size="small"
                error={!!formState.errors?.firstName}
                helperText={formState.errors?.firstName?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field, formState }) => (
              <TextField
                {...field}
                className={styles.input}
                variant="standard"
                label="Surname"
                size="small"
                error={!!formState.errors?.lastName}
                helperText={formState.errors?.lastName?.message}
              />
            )}
          />
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
            name="emailConfirm"
            control={control}
            render={({ field, formState }) => (
              <TextField
                {...field}
                className={styles.input}
                variant="standard"
                label="Confirm Email address"
                size="small"
                error={!!formState.errors?.emailConfirm}
                helperText={formState.errors?.emailConfirm?.message}
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
          <Controller
            name="passwordConfirm"
            control={control}
            render={({ field, formState }) => (
              <TextField
                {...field}
                className={styles.input}
                variant="standard"
                label="Confirm Password"
                size="small"
                type="password"
                error={!!formState.errors?.passwordConfirm}
                helperText={formState.errors?.passwordConfirm?.message}
              />
            )}
          />
        </div>
        <ReCAPTCHA
          className={styles.recaptcha}
          sitekey="6LcFfFAhAAAAAFkxBeqVCgoC7ksLl9KKP2zHGdqZ"
          onChange={(value) => setValue('recaptcha', value)}
        />
        {errors.recaptcha?.message && <span className={styles.captchaError}>{errors.recaptcha?.message}</span>}

        <Button type="submit" className={styles.button} variant="contained" disableElevation>
          Submit
        </Button>
        <p className={styles.login}>
          Already own an account?
          <Link className={styles.loginLink} to={'/auth'}>
            Login here
          </Link>
          .
        </p>
      </form>
    </div>
  )
}
