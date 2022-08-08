import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.scss'
import BaseRoutes from './routes'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('app')!)

root.render(<BaseRoutes />)
