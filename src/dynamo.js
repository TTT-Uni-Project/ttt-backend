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

  async deleteUser(userId) {
    console.log(`Deleting ${userId} user`)
    let params = {
      RequestItems: {
        OnlineUsers: [
          {
            DeleteRequest: {
              Key: marshall({
                id: userId
              })
            }
          }
        ]
      }
    }
    await client.batchWriteItem(params).catch((e) => console.error('Error while deleting user', e))
  }
}
