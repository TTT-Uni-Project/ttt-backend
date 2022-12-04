import { DynamoDB } from '@aws-sdk/client-dynamodb'
const client = new DynamoDB({ endpoint: 'http://localhost:8000/' })

const onlineUsersParams = {
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  TableName: 'OnlineUsers'
}
await client.createTable(onlineUsersParams).catch((e) => console.error(e))

const gamesParams = {
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  TableName: 'Games'
}
await client.createTable(gamesParams).catch((e) => console.error(e))
