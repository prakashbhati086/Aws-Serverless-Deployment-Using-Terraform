const AWS = require('aws-sdk');

/**
 * Simple AWS Lambda function for User Management
 * Perfect for demonstrating serverless architecture in interviews
 */
exports.handler = async (event) => {
    console.log('Lambda function called:', JSON.stringify(event, null, 2));
    
    // CORS headers for frontend communication
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    };
    
    try {
        // Handle CORS preflight requests
        if (event.httpMethod === 'OPTIONS') {
            return { statusCode: 200, headers, body: '{}' };
        }
        
        // Initialize DynamoDB client
        const dynamoDB = new AWS.DynamoDB.DocumentClient();
        const tableName = 'serverless-users';
        
        // GET /users - Retrieve all users
        if (event.httpMethod === 'GET' && event.path === '/users') {
            console.log('Getting all users from DynamoDB');
            
            const result = await dynamoDB.scan({
                TableName: tableName
            }).promise();
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    users: result.Items || [],
                    count: result.Items ? result.Items.length : 0
                })
            };
        }
        
        // POST /users - Create new user
        if (event.httpMethod === 'POST' && event.path === '/users') {
            console.log('Creating new user');
            
            const userData = JSON.parse(event.body || '{}');
            
            // Simple validation
            if (!userData.name || !userData.email) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: 'Name and email are required'
                    })
                };
            }
            
            // Create user object
            const user = {
                id: Date.now().toString(),
                name: userData.name.trim(),
                email: userData.email.trim().toLowerCase(),
                createdAt: new Date().toISOString()
            };
            
            // Save to DynamoDB
            await dynamoDB.put({
                TableName: tableName,
                Item: user
            }).promise();
            
            console.log('User created successfully:', user.id);
            
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({
                    message: 'User created successfully',
                    user: user
                })
            };
        }
        
        // Route not found
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Route not found' })
        };
        
    } catch (error) {
        console.error('Lambda error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
