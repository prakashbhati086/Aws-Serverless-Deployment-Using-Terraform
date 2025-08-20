const { DynamoDBClient, PutItemCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const crypto = require("crypto");

const ddb = new DynamoDBClient({});

exports.handler = async (event) => {
  try {
    const routeKey = event.routeKey || `${event.requestContext?.http?.method} ${event.requestContext?.http?.path}`;
    const tableName = process.env.TABLE_NAME;

    if (routeKey === "POST /users") {
      const body = JSON.parse(event.body || "{}");
      const userId = crypto.randomUUID();
      const name = body.name;
      const email = body.email;

      if (!name || !email) {
        return response(400, { message: "name and email are required" });
      }

      const item = {
        userId: { S: userId },
        name: { S: name },
        email: { S: email }
      };

      await ddb.send(new PutItemCommand({
        TableName: tableName,
        Item: item
      }));

      return response(201, { userId, name, email });
    }

    if (routeKey === "GET /users") {
      const result = await ddb.send(new ScanCommand({
        TableName: tableName,
        Limit: 100
      }));

      const users = (result.Items || []).map(i => ({
        userId: i.userId.S,
        name: i.name.S,
        email: i.email.S
      }));

      return response(200, users);
    }

    return response(404, { message: "Not Found" });
  } catch (err) {
    console.error(err);
    return response(500, { message: "Internal Server Error", error: err.message });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    },
    body: JSON.stringify(body)
  };
}
