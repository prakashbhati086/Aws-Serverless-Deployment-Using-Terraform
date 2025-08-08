const AWS = require('aws-sdk');

class DynamoDBService {
    constructor() {
        this.dynamoDB = new AWS.DynamoDB.DocumentClient();
        this.tableName = process.env.DYNAMODB_TABLE_NAME;
    }
    
    async getUser(userId) {
        const params = {
            TableName: this.tableName,
            Key: { id: userId }
        };
        
        const result = await this.dynamoDB.get(params).promise();
        return result.Item;
    }
    
    async getAllUsers(limit = 10, lastEvaluatedKey = null) {
        const params = {
            TableName: this.tableName,
            Limit: limit
        };
        
        if (lastEvaluatedKey) {
            params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastEvaluatedKey));
        }
        
        const result = await this.dynamoDB.scan(params).promise();
        
        return {
            users: result.Items,
            lastEvaluatedKey: result.LastEvaluatedKey ? 
                encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null
        };
    }
    
    async createUser(userData) {
        const user = {
            id: this.generateId(),
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const params = {
            TableName: this.tableName,
            Item: user
        };
        
        await this.dynamoDB.put(params).promise();
        return user;
    }
    
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
}

module.exports = { DynamoDBService };
