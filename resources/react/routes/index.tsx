import React, { useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigate, useOutletContext } from 'react-router-dom'

import { Context } from '../interfaces/Context'

import { App } from '../App'

import { ClientListPage } from '../pages/client-list'
import { SignInPage } from '../pages/sign-in'
import { SignUpPage } from '../pages/sign-up'
import { Error404Page } from '../pages/404'

function AuthenticatedRoutes() {
  const context = useOutletContext<Context>()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!context.user) {
      navigate('/auth', { state: `${location.pathname}${location.search}`, replace: true })
    }
  }, [context])

  return <Outlet context={context} />
}

function PreAuthenticatedRoutes() {
  const context = useOutletContext<Context>()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (context.user) {
      navigate((location.state as string) || '/', { state: undefined, replace: true })
    }
  }, [context])

  return <Outlet context={context} />
}

export default function BaseRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/auth" element={<PreAuthenticatedRoutes />}>
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/auth" element={<SignInPage />} />
          </Route>
          <Route path="/" element={<AuthenticatedRoutes />}>
            <Route path="/" element={<ClientListPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </BrowserRouter>
  )
}
