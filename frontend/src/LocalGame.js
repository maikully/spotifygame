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
import { searchArtist, sortArtists, numberWithCommas } from './functions'

const MAX_PLAYERS = 8
var menuitems = []
var players = []
var results = []
var target = {}
var hostID = 1

function LocalGame (props) {
  const [numPlayers, setNumPlayers] = useState(3)
  const [gameState, setGameState] = useState(0)
  const [inputs, setInputs] = useState([])
  const [options, setOptions] = useState([])
  useEffect(() => {
    for (var i = 3; i <= MAX_PLAYERS; i++) {
      if (menuitems.length < MAX_PLAYERS - 2) {
        menuitems.push(<MenuItem value={i}>{i}</MenuItem>)
      }
    }
  }, [])
  const handleContinue = () => {
    if (hostID < numPlayers) {
      hostID = hostID + 1
    } else {
      hostID = 1
    }
    setInputs([])
    setOptions([])
    results = []
    target = {}

    let newArr = []
    let newArrTwo = []
    for (let i = 1; i <= numPlayers; i++) {
      if (i === hostID) {
        newArr.push({
          id: i,
          guess: null,
          score: players[i - 1].score,
          isHost: true
        })
        newArrTwo.push('')
        options.push([])
      } else {
        newArr.push({
          id: i,
          guess: null,
          score: players[i - 1].score,
          isHost: false
        })
        newArrTwo.push('')
        options.push([])
      }
    }
    setInputs(newArrTwo)
    players = newArr
    setGameState(1)
  }
  const handleStartGame = () => {
    players = []
    for (let i = 1; i <= numPlayers; i++) {
      if (i === hostID) {
        players.push({ id: i, guess: null, score: 0, isHost: true })
        setInputs(...inputs, '')
        options.push([])
      } else {
        players.push({ id: i, guess: null, score: 0, isHost: false })
        setInputs(...inputs, '')
        options.push([])
      }
    }
    setGameState(1)
    setOptions(options)
  }
  const handleSubmitAnswers = () => {
    let targetArtist = players[hostID - 1].guess
    if (targetArtist === null) {
      alert('Must have a target artist!')
      return
    }
    let guessArtists = []
    players.map(player =>
      player.guess !== null && !player.isHost
        ? guessArtists.push({ id: player.id, artist: player.guess })
        : null
    )
    if (guessArtists.length >= 2) {
      let r = sortArtists(targetArtist, guessArtists)
      results = r[0]
      target = targetArtist
      target.listeners = r[1]
      console.log(results)
      console.log(target)
      setGameState(2)
    } else {
      alert('Must have at least two guesses!')
      return
    }
    //let sortedAnswers = sortArtists(targetArtist, guessArtists)
    //results = sortedAnswers
  }
  const handleSearchSelection = (id, artist) => {
    let newList = [...inputs]
    newList[id - 1] = artist.name
    setInputs(newList)
    players[id - 1].guess = artist
    newList = [...options]
    newList[id - 1] = []
    setOptions(newList)
  }
  const updatePlayerGuess = (id, guess) => {
    const newList = [...inputs]
    newList[id - 1] = guess
    setInputs(newList)
  }
  const submitPlayerGuess = async id => {
    let artists = await searchArtist(inputs[id - 1], props.token)
    if (artists.length > 0) {
      const newList = [...options]
      newList[id - 1] = artists
      setOptions(newList)
    }
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
              <Button onClick={() => handleStartGame()}>Submit</Button>
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
                  alignItems: 'end'
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
                      <li className='score'>
                        <Button
                          onClick={() =>
                            handleSearchSelection(player.id, artist)
                          }
                        >
                          {artist.name}
                        </Button>
                      </li>
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
                  alignItems: 'end'
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
                      <li className='score'>
                        <Button
                          onClick={() =>
                            handleSearchSelection(player.id, artist)
                          }
                        >
                          {artist.name}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          )}
        {gameState == 1 && (
          <Button onClick={() => handleSubmitAnswers()}>Submit answers</Button>
        )}
        {gameState == 2 && (
          <div>
            Target: {target.name} - {target.popularity} - {numberWithCommas(parseInt(target.listeners))} {' '}
            <ol className='score'>
              {results.map(result => (
                <li>
                  {result.artist.name} - {result.artist.popularity} - {numberWithCommas(parseInt(result.listeners))}
                </li>
              ))}
            </ol>
            <Button onClick={() => handleContinue()}>Continue</Button>
          </div>
        )}
      </header>
    </div>
  )
}

export default LocalGame
