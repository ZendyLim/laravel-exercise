import React, { useRef, useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import Axios, { AxiosResponse } from 'axios'

import { Box, Button, Modal, TextField } from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload'

import { Client } from '../../interfaces/Client'
import { Context } from '../../interfaces/Context'

import styles from './styles.module.scss'

interface ClientEditForm {
  name: string
  email: string
  profilePicture?: any
}

interface ClientEditProps {
  open: boolean
  client: Client | undefined
  onClose: () => void
  onEdit: () => void
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  background: '#FFFFFF',
}

const schema = Yup.object({
  name: Yup.string().required().max(255).label('Name'),
  email: Yup.string().required().email().max(255).label('Email'),
  profilePicture: Yup.mixed().test('fileSize', 'The file is too large', (value) => {
    if (!value) {
      return true
    }
    return value.size <= 5000000
  }),
}).required()

export function ClientEdit({ open, client, onClose, onEdit }: ClientEditProps) {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClientEditForm>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: client,
  })
  const fileInput = useRef<HTMLInputElement | null>(null)
  const context = useOutletContext<Context>()
  const [fileName, setfileName] = useState<string | undefined>()

  useEffect(() => {
    if (client) {
      reset()
      setValue('name', client.name)
      setValue('email', client.email)
    }
  }, [client])

  function onSubmit(data: ClientEditForm) {
    Axios.post<ClientEditForm, AxiosResponse<Client>>(
      `/api/clients/${client?.id}`,
      { ...data, _method: 'PUT' },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      },
    )
      .then((result) => {
        if (result.data) {
          context.addSnack('Client updated!', 'success')
          onEdit()
          reset()
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

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setfileName(event.target.files[0].name)
      setValue('profilePicture', event.target.files[0])
    }
  }

  function onUploadClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (fileInput && fileInput.current) {
      fileInput.current.click()
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {fileName && <span>{fileName}</span>}
          <Button className={styles.upload} startIcon={<UploadIcon />} variant="contained" onClick={onUploadClick}>
            <input style={{ display: 'none' }} type="file" onChange={handleChange} ref={fileInput} />
          </Button>
          {errors?.profilePicture?.message && <p>{`${errors?.profilePicture?.message}`}</p>}
          <Controller
            name="name"
            control={control}
            render={({ field, formState }) => (
              <TextField
                {...field}
                variant="standard"
                label="Name"
                size="small"
                error={!!formState.errors?.name}
                helperText={formState.errors?.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field, formState }) => (
              <TextField
                {...field}
                variant="standard"
                label="Email"
                size="small"
                error={!!formState.errors?.email}
                helperText={formState.errors?.email?.message}
              />
            )}
          />
          <Button className={styles.submit} variant="contained" type="submit">
            Save
          </Button>
        </form>
      </Box>
    </Modal>
  )
}
