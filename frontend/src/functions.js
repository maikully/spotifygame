import axios from 'axios'

export async function searchArtist (query, token) {
  //query = encodeURIComponent(query)
  //console.log(api_url);
  console.log(token)
  const { data } = await axios.get(`https://api.spotify.com/v1/search`, {
    params: { q: query, type: 'artist', limit: 5},
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  })
  return data.artists.items
}
//based on curve 173.1x^0.02984 - 205.8
const factorMult = 9.77338 * Math.pow(10, -76)
const factorAdd = 205.8
const exponent = 33.51206434316354
export function getListeners (popularity) {
    if(popularity <= 95){
    return factorMult * Math.pow(popularity + factorAdd, exponent)
    } else {
    return (7 * Math.pow(popularity, 4)/24 - (1349 * Math.pow(popularity, 3))/12 + (389945 * Math.pow(popularity, 2))/24 - (12523819 * popularity)/12 + 25138211
    }
}

export function sortArtists (hostArtist, playerArtists){
    var hostListeners = getListeners(hostArtist.popularity)
    hostArtist.listeners = hostListeners
    for (let i = 0; i < playerArtists.length; i++) {
        playerArtists[i].listeners = getListeners(playerArtists[i].artist.popularity)
    }
    playerArtists.sort(function(a, b){return Math.abs(a.listeners - hostListeners)
        - Math.abs(b.listeners - hostListeners)})
    return [playerArtists, hostListeners]
}
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function getListenersScore(guesses,target){
    for(i=0;i<guesses.length;i++){
            pct = Math.abs(guesses[i].listeners/target.listeners-1
            guesses[i].score = (100 - 10*i)+(i===0 ? 25 : 0)+pct<.25 ? 50 :0+pct<.05 ? 100 :0);
    }
    return guesses;
}

export function getSimilarityScore (hostArtist, playerArtists){

}