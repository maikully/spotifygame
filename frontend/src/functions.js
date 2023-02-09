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

const factor = 508.486
const exponent = 0.129915
export function getListeners (popularity) {
    return factor * Math.exp(exponent * popularity)
}
