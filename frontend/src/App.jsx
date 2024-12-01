import React, { useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Settings from './pages/Settings.jsx'
import Profile from './pages/Profile.jsx'
import Home from './pages/Home.jsx'
import { useAuth } from './store/useAuth.js'
import { Toaster } from 'react-hot-toast'
import { useTheme } from './store/useTheme.js'
function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuth();
  const {theme} = useTheme();
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) {
    return (<div>Loading....</div>)
  }
  
  return (
    <div data-theme={theme? theme :"coffee"}>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to={'/login'} />} />
        <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to={'/'} />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to={'/'} />} />
        <Route path='/settings' element={<Settings />} />

        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to={'/login'} />} />

      </Routes>
      <Toaster />
    </div>
  )
}

export default App