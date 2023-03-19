import React from "react";
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
    const token = localStorage.getItem('accessToken')
  let auth = {'token':token}
  return (
    auth?.token ? <Outlet/> : <Navigate to='/login'/>
  )
}