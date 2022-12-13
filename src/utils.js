export const isInvalidMove = (game, playerId, position) => {
  const { board, playerTurn } = game
  return board[position] !== 9 || playerTurn !== playerId || game.state === 'FINISHED'
}

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

export const isGameFinished = ({ players, board }) => {
  let isFinished = false
  let winner = null

  for (const line of lines) {
    const [firstPlayer, secondPlayer] = players
    const [a, b, c] = line

    if (board[a] !== 9 && board[a] === board[b] && board[a] === board[c]) {
      isFinished = true
      winner = firstPlayer.piece === board[a] ? firstPlayer.id : secondPlayer.id
      break
    }
  }

  if (stalemate(board)) {
    isFinished = true
  }

  return [isFinished, winner]
}

const stalemate = (board) => {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === 9) return false
  }
  return true
}
