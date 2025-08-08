const { getUserHandler } = require('./handlers/userHandler');
const { createUserHandler } = require('./handlers/userHandler');

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const { httpMethod, path, pathParameters } = event;
    
    try {
        let response;
        
        switch (`${httpMethod} ${path}`) {
            case 'GET /users':
                response = await getUserHandler(event);
                break;
            case 'POST /users':
                response = await createUserHandler(event);
                break;
            case 'GET /users/{id}':
                response = await getUserHandler(event);
                break;
            default:
                response = {
                    statusCode: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
                    },
                    body: JSON.stringify({ message: 'Route not found' })
                };
        }
        
        return response;
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
            },
            body: JSON.stringify({ 
                message: 'Internal server error',
                error: error.message 
            })
        };
    }
};
