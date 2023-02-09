import logo from './logo.svg'
import './App.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import {
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField
} from '@mui/material'
import { useEffect, useState } from 'react'
import { searchArtist } from './functions'

const MAX_PLAYERS = 8
var menuitems = []
var players = []

function LocalGame (props) {
  const [numPlayers, setNumPlayers] = useState(3)
  const [gameState, setGameState] = useState(0)
  const [hostID, setHostID] = useState(1)
  const [inputs, setInputs] = useState([])
  const [options, setOptions] = useState([])
  useEffect(() => {
    for (var i = 2; i <= MAX_PLAYERS; i++) {
      if (menuitems.length < MAX_PLAYERS) {
        menuitems.push(<MenuItem value={i}>{i}</MenuItem>)
      }
    }
  }, [])
  const handleSubmit = () => {
    players = []
    let arr = []
    for (let i = 1; i <= numPlayers; i++) {
      if (i === hostID) {
        players.push({ id: i, guess: '', score: 0, isHost: true })
        setInputs(...inputs, '')
        options.push([])
      } else {
        players.push({ id: i, guess: '', score: 0, isHost: false })
        setInputs(...inputs, '')
        options.push([])
      }
    }
    setGameState(1)
    setOptions(options)
  }
  const updatePlayerGuess = (id, guess) => {
    const newList = [...inputs]
    newList[id - 1] = guess
    setInputs(newList)
  }
  const submitPlayerGuess = async id => {
    let artists = await searchArtist(inputs[id - 1], props.token)
    console.log(artists)
    if (artists.length > 0) {
      const newList = [...options]
      newList[id - 1] = artists
      console.log(newList)

      setOptions(newList)
    }
    console.log(options)
  }
  return (
    <div className='App'>
      <header className='App-header'>
        {gameState === 0 && (
          <div>
            <div>How many players?</div> <br></br>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>
                Number of Players
              </InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={numPlayers}
                label='NumPlayers'
                onChange={e => setNumPlayers(e.target.value)}
              >
                {menuitems}
              </Select>
              <Button onClick={() => handleSubmit()}>Submit</Button>
            </FormControl>
          </div>
        )}
        {gameState === 1 &&
          players.map(player =>
            player.isHost ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems:"end"
                }}
              >
                <div style={{ marginBottom: '5vh' }}>
                  <p>Host</p>
                  <p className='score'>
                    player {player.id} score: {player.score}
                  </p>
                  <TextField
                    id='filled-basic'
                    label={player.id}
                    value={inputs[player.id - 1]}
                    variant='filled'
                    onChange={e => updatePlayerGuess(player.id, e.target.value)}
                  />
                  <div>
                    <Button onClick={() => submitPlayerGuess(player.id)}>
                      Search
                    </Button>
                  </div>
                </div>
                <br></br>
                {options.length > 0 && (
                  <ul style={{ listStyleType: 'none' }}>
                    {options[player.id - 1].map(artist => (
                      <li className='score'><Button>{artist.name}</Button></li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems:"end"
                }}
              >
                <div style={{ marginBottom: '5vh' }}>
                  <p className='score'>
                    player {player.id} score: {player.score}
                  </p>
                  <TextField
                    id='filled-basic'
                    label={player.id}
                    value={inputs[player.id - 1]}
                    variant='filled'
                    onChange={e => updatePlayerGuess(player.id, e.target.value)}
                  />
                  <div>
                    <Button onClick={() => submitPlayerGuess(player.id)}>
                      Search
                    </Button>
                  </div>
                </div>
                {options.length > 0 && (
                  <ul style={{ listStyleType: 'none' }}>
                    {options[player.id - 1].map(artist => (
                        
                      <li className='score'><Button>{artist.name}</Button></li>
                    ))}
                  </ul>
                )}
              </div>
            )
          )}
      </header>
    </div>
  )
}

export default LocalGame
