const { DynamoDBService } = require('../utils/dynamodb');
const { validateUser } = require('../utils/validation');

const dynamoDBService = new DynamoDBService();

const getUserHandler = async (event) => {
    const { pathParameters, queryStringParameters } = event;
    
    try {
        if (pathParameters && pathParameters.id) {
            // Get single user
            const user = await dynamoDBService.getUser(pathParameters.id);
            if (!user) {
                return {
                    statusCode: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ message: 'User not found' })
                };
            }
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(user)
            };
        } else {
            // Get all users with pagination
            const limit = queryStringParameters?.limit ? parseInt(queryStringParameters.limit) : 10;
            const lastEvaluatedKey = queryStringParameters?.lastKey || null;
            
            const result = await dynamoDBService.getAllUsers(limit, lastEvaluatedKey);
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(result)
            };
        }
    } catch (error) {
        console.error('Error in getUserHandler:', error);
        throw error;
    }
};

const createUserHandler = async (event) => {
    try {
        const userData = JSON.parse(event.body);
        
        // Validate user data
        const validation = validateUser(userData);
        if (!validation.isValid) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    message: 'Validation failed',
                    errors: validation.errors 
                })
            };
        }
        
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
