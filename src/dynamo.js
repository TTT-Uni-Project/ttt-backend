import { DynamoDB } from '@aws-sdk/client-dynamodb'
const client = new DynamoDB({ endpoint: 'http://localhost:8000/' })
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import crypto from 'crypto'
export class Dynamo {
  async addUserToOnlineList(id, username) {
    const params = {
      TableName: 'OnlineUsers',
      Item: marshall({
        id: id,
        username: username,
        lastHeartbeat: new Date().getTime()
      })
    }
    await client.putItem(params)
  }

  async getOnlineUsers() {
    const params = {
      TableName: 'OnlineUsers'
    }
    const users = await client.scan(params).catch((e) => console.error(e))
    return users.Items.map((user) => unmarshall(user))
  }

  async deleteStaleUsers() {
    const users = await this.getOnlineUsers()
    const now = new Date().getTime()
    const userDeleteRequests = users
      .filter((user) => now - user.lastHeartbeat > 15 * 1000)
      .map((user) => ({
        DeleteRequest: {
          Key: marshall({
            id: user.id
          })
        }
      }))

    if (!userDeleteRequests.length) {
      console.log('No stale users to delete')
      return
    }

    console.log(`Deleting ${userDeleteRequests.length} users`)
    let params = {
      RequestItems: {
        OnlineUsers: userDeleteRequests
      }
    }
    await client.batchWriteItem(params).catch((e) => console.error('Error while deleting stale users', e))
  }

  async getPlayerById(id) {
    const params = {
      TableName: 'OnlineUsers',
      Key: marshall({ id })
    }
    return await client
      .getItem(params)
      .then((data) => unmarshall(data.Item))
      .catch((e) => console.error(e))
  }

  async createGame(players) {
    const shuffledPlayers = players.sort(() => Math.random() - 0.5)

    const [first, second] = shuffledPlayers

    const playerOne = await this.getPlayerById(first)
    playerOne.piece = 'X'
    const playerTwo = await this.getPlayerById(second)
    playerTwo.piece = 'O'

    const params = {
      TableName: 'Games',
      Item: marshall({
        id: crypto.randomUUID(),
        players: [playerOne, playerTwo],
        playerTurn: first,
        winner: null,
        state: 'STARTED',
        board: [9, 9, 9, 9, 9, 9, 9, 9, 9]
      })
    }
    await client.putItem(params)
  }

  async getStartedGames(userId) {
    const params = {
      TableName: 'Games'
    }
    const games = await client.scan(params).catch((e) => console.error(e))
    const regularGames = games?.Items?.map((game) => unmarshall(game))

    if (!regularGames) return null

    const userGames = regularGames.filter((game) => game.players.map((p) => p.id).includes(userId))
    const startedGames = userGames.filter((game) => game.state === 'STARTED')

    if (startedGames.length === 0) return null
    else return startedGames
  }

  async getGameById(id) {
    const params = {
      TableName: 'Games',
      Key: marshall({ id })
    }
    return await client
      .getItem(params)
      .then((data) => unmarshall(data.Item))
      .catch((e) => console.error(e))
  }

  async updateGame(game) {
    const params = {
      TableName: 'Games',
      Item: marshall({ id: game.id, ...game })
    }
    await client.putItem(params).catch((e) => console.error(e))
  }
}
