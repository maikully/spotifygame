import logo from './logo.svg'
import './App.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import LocalGame from './LocalGame'
const CLIENT_ID = 'aa5381ee14f541b8a0774244d2eff5c0'
const REDIRECT_URI = 'http://localhost:3000/'
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
const RESPONSE_TYPE = 'token'
function App () {
  const [token, setToken] = useState('')
  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem('token')

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token'))
        .split('=')[1]

      window.location.hash = ''
      window.localStorage.setItem('token', token)
    }

    setToken(token)
  }, [])
  const logout = () => {
    setToken('')
    window.localStorage.removeItem('token')
  }
  const [mode, setMode] = useState(0)
  return (
    <div className='App'>
      <header className='App-header'>
        {(token === '' || token === null) && (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
          <Button>
            Login to Spotify
          </Button></a>
        )}
        {token !== "" && token !== null && mode === 0 && (
          <div>
            <Button variant='contained' onClick={() => setMode(1)}>
              Local
            </Button>
            <br></br>
            <br></br>
            <Button variant='contained' disabled>
              Online
            </Button>
          </div>
        )}
        {token !== "" && token !== null && mode === 1 && <LocalGame token={token} />}
        {token !== "" && token !== null && (
          <Button onClick={() => logout()}>Log out</Button>
        )}
      </header>
    </div>
  )
}

export default App
