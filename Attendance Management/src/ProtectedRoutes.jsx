import React from 'react'
import useAppStore from './Store'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({children}) => {
    const {userId} = useAppStore()
    if(!userId) {
        return <Navigate to={'/login'} replace />
    }

    return children
}

export default ProtectedRoutes