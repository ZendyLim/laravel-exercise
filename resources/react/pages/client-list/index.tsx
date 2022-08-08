import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material'
import Axios, { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import { Client } from '../../interfaces/Client'
import { Paginated } from '../../interfaces/Paginated'

import { ClientCreate } from '../../components/client-create'
import { ClientEdit } from '../../components/client-edit'

import styles from './styles.module.scss'

interface Column {
  id: 'id' | 'name' | 'email' | 'profile_picture' | 'actions'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

export function ClientListPage() {
  const [clients, setClients] = useState<Paginated<Client> | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [clientToDelete, setClientToDelete] = useState<Client | undefined>()
  const [clientToEdit, setClientToEdit] = useState<Client | undefined>()
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [search, setSearch] = useState<string | undefined>()

  useEffect(() => {
    onLoad()
  }, [currentPage])

  useEffect(() => {
    if (clientToDelete) {
      setDeleteOpen(true)
    }
  }, [clientToDelete])

  useEffect(() => {
    if (clientToEdit) {
      setEditOpen(true)
    }
  }, [clientToEdit])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1)
      onLoad()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  function onDelete() {
    Axios.delete(`/api/clients/${clientToDelete?.id}`)
      .then(() => {
        setDeleteOpen(false)
      })
      .finally(() => onLoad())
  }

  function onLoad() {
    setLoading(true)
    Axios.get<any, AxiosResponse<Paginated<Client>>>('/api/clients', {
      params: {
        search: search,
        page: currentPage,
      },
    })
      .then((result) => {
        if (result.data) {
          setClients(result.data)
        }
      })
      .finally(() => setLoading(false))
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setCurrentPage(page + 1)
  }

  const columns: readonly Column[] = [
    { id: 'profile_picture', label: '', minWidth: 0 },
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'actions', label: 'Action', minWidth: 0 },
  ]

  return (
    <div className={styles.clientList}>
      <div className={styles.actions}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Add
        </Button>
        <TextField
          onChange={(event) => setSearch(event.target.value)}
          className={styles.input}
          variant="standard"
          label="Search"
          size="small"
        />
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: '75vh' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow hover role="checkbox" tabIndex={-1}>
                  <TableCell colSpan={4}>
                    <div className={styles.loading}>
                      <CircularProgress />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clients?.items.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell>
                        <Avatar alt={row.name} src={row.profile_picture} />
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => setClientToEdit(row)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => setClientToDelete(row)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[]}
          count={clients?.total || -1}
          rowsPerPage={clients?.perPage || 15}
          page={(clients?.currentPage || 1) - 1}
          onPageChange={handleChangePage}
        />
      </Paper>
      <Dialog open={isDeleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle id="alert-dialog-title">Delete client?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this client? ({clientToDelete && clientToDelete.name},{' '}
            {clientToDelete && clientToDelete.email})
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Go Back</Button>
          <Button onClick={onDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <ClientCreate
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={() => {
          onLoad()
          setCreateOpen(false)
        }}
      />
      <ClientEdit
        open={isEditOpen}
        client={clientToEdit}
        onClose={() => setEditOpen(false)}
        onEdit={() => {
          onLoad()
          setEditOpen(false)
        }}
      />
    </div>
  )
}
