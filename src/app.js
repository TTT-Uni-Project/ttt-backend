import express from 'express'
import { Dynamo } from './dynamo.js'

const port = 8086
const app = express()
app.use(express.json())
const dynamo = new Dynamo()

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

app.listen(port)
console.log(`Tic-Tac-Toe backend started and listening on port ${port} 👈🥸`)
