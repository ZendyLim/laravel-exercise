import React from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.module.scss'

export function Error404Page() {
  return (
    <div className={styles.container}>
      <span className={styles.text}>404</span>
      <Link className={styles.homeUrl} to="/">
        Home
      </Link>
    </div>
  )
}
