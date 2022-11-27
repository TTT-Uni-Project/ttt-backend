import { DynamoDB } from '@aws-sdk/client-dynamodb'
const client = new DynamoDB({ endpoint: 'http://localhost:8000/' })
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
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
}
