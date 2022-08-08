export interface SnackbarMessage {
  message: string
  key: number
  severity: 'error' | 'warning' | 'info' | 'success'
}
