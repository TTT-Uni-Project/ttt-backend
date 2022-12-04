import express from 'express'
import { Dynamo } from './dynamo.js'

const port = 8086
const app = express()
app.use(express.json())
const dynamo = new Dynamo()

setInterval(async () => await dynamo.deleteStaleUsers(), 15 * 1000)

app.post('/heartbeat', async (req, res) => {
  try {
    const { id, username } = req.body

    if (!id && typeof id !== 'string') return res.status(400).send({ message: "Field 'id' is required, and must be a string" })

    if (!username && typeof username !== 'string') return res.status(400).send({ message: "Field 'username' is required, and must be a string" })

    await dynamo.addUserToOnlineList(id, username)
    return res.status(200).send()
  } catch (e) {
    console.error('Error while sending heartbeat 😬', e)
    res.status(500).send({ message: e.message })
  }
})

app.get('/online-users', async (req, res) => {
  try {
    const onlineUsers = await dynamo.getOnlineUsers()
    res.send(onlineUsers)
  } catch (e) {
    console.error('Error while getting online users 😬', e)
    res.status(500).send({ message: e.message })
  }
})

app.post('/game', async (req, res) => {
  try {
    const { players } = req.body

    if (!players || !Array.isArray(players) || players.length !== 2 || players.includes(''))
      return res.status(400).send({ message: "Field 'players' is not correct!" })

    await dynamo.createGame(players)
    res.status(200).send()
  } catch (e) {
    console.error('Error while creating game 😬', e)
    res.status(500).send({ message: e.message })
  }
})

app.get('/my-started-game', async (req, res) => {
  try {
    const { playerId } = req.query

    if (!playerId) return res.status(400).send({ message: 'Field playerId is required!' })

    const startedGames = await dynamo.getStartedGames(playerId)

    if (!startedGames) return res.status(404).send({ message: 'Not found started games 😬' })

    const gamesId = startedGames.map(({ id: gameId }) => {
      return { gameId }
    })
    res.send(gamesId)
  } catch (e) {
    console.error('Error while getting started games 😬', e)
    res.status(500).send({ message: e.message })
  }
})

app.listen(port)
console.log(`Tic-Tac-Toe backend started and listening on port ${port} 👈🥸`)
