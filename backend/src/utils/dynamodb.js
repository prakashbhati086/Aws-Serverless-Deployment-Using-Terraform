const AWS = require('aws-sdk');

class DynamoDBService {
    constructor() {
        this.dynamoDB = new AWS.DynamoDB.DocumentClient();
        this.tableName = process.env.DYNAMODB_TABLE_NAME;
    }
    
    async getAllUsers() {
        const params = {
            TableName: this.tableName
        };
        
        const result = await this.dynamoDB.scan(params).promise();
        return {
            users: result.Items || []
        };
    }
    
    async createUser(userData) {
        const user = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            createdAt: new Date().toISOString()
        };
        
        const params = {
            TableName: this.tableName,
            Item: user
        };
        
        await this.dynamoDB.put(params).promise();
        return user;
    }
}

module.exports = { DynamoDBService };
