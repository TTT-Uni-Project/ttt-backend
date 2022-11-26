import express from 'express'

const port = 8086
const app = express()
app.use(express.json())

app.listen(port)
console.log(`Tic-Tac-Toe backend started and listening on port ${port} 👈🥸`)
