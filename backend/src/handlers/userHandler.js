const { DynamoDBService } = require('../utils/dynamodb');

const dynamoDBService = new DynamoDBService();

const getUserHandler = async (event) => {
    try {
        const result = await dynamoDBService.getAllUsers();
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(result)
        };
    } catch (error) {
        console.error('Error in getUserHandler:', error);
        throw error;
    }
};

const createUserHandler = async (event) => {
    try {
        const userData = JSON.parse(event.body);
        const user = await dynamoDBService.createUser(userData);
        
        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(user)
        };
    } catch (error) {
        console.error('Error in createUserHandler:', error);
        throw error;
    }
};

module.exports = {
    getUserHandler,
    createUserHandler
};
