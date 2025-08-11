const { getUserHandler, createUserHandler } = require('./handlers/userHandler');

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const { httpMethod, path } = event;
    
    try {
        let response;
        
        if (httpMethod === 'GET' && path === '/users') {
            response = await getUserHandler(event);
        } else if (httpMethod === 'POST' && path === '/users') {
            response = await createUserHandler(event);
        } else {
            response = {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
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
            },
            body: JSON.stringify({ 
                message: 'Internal server error',
                error: error.message 
            })
        };
    }
};
