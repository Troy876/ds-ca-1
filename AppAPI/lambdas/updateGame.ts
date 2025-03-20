import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
    try {
        console.log("[EVENT]", JSON.stringify(event));

        if (!event.body) {
            return {
                statusCode: 400,
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ message: "Missing request body" }),
            };
        }

        const data = JSON.parse(event.body);
        const { id, ...updates } = data;

        if (id === undefined || id === null) {
            return {
                statusCode: 400,
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ message: "Missing id in request body" }),
            };
        }

        if (Object.keys(updates).length === 0) {
            return {
                statusCode: 400,
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ message: "No fields provided to update" }),
            };
        }

        let UpdateExpression = "set";
        const ExpressionAttributeValues: { [key: string]: any } = {};
        const ExpressionAttributeNames: { [key: string]: string } = {};
        let prefix = " ";

        for (const [key, value] of Object.entries(updates)) {
            UpdateExpression += `${prefix}#${key} = :${key}`;
            ExpressionAttributeValues[`:${key}`] = value;
            ExpressionAttributeNames[`#${key}`] = key;
            prefix = ", ";
        }

        const params: UpdateCommandInput = {
            TableName: process.env.TABLE_NAME,
            Key: { id },
            UpdateExpression,
            ExpressionAttributeValues,
            ExpressionAttributeNames,
            ReturnValues: "ALL_NEW",
        };

        const result = await ddbDocClient.send(new UpdateCommand(params));

        return {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ updatedItem: result.Attributes }),
        };

    } catch (error: any) {
        console.error("Error updating game:", error);
        return {
            statusCode: 500,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ error: error.message || "Unknown error" }),
        };
    }
};

function createDocumentClient() {
    const ddbClient = new DynamoDBClient({ region: process.env.REGION });
    const marshallOptions = {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    };
    const unmarshallOptions = {
        wrapNumbers: false,
    };
    const translateConfig = { marshallOptions, unmarshallOptions };
    return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}
