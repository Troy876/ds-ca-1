import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const translateClient = new TranslateClient({ region: process.env.REGION });

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const gameId = event.pathParameters?.gameId;
        const languageCode = event.queryStringParameters?.lang;

        if (!gameId || !languageCode) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing gameId or languageCode" }),
            };
        }

        const cachedTranslation = await ddbDocClient.send(
            new GetCommand({
                TableName: process.env.TRANSLATIONS_TABLE_NAME,
                Key: { gameId: Number(gameId), languageCode },
            })
        );

        if (cachedTranslation.Item) {
            return {
                statusCode: 200,
                body: JSON.stringify({ translation: cachedTranslation.Item }),
            };
        }

        const gameData = await ddbDocClient.send(
            new GetCommand({
                TableName: process.env.GAMES_TABLE_NAME,
                Key: { id: Number(gameId) },
            })
        );

        if (!gameData.Item) {
            return { statusCode: 404, body: JSON.stringify({ message: "Game not found" }) };
        }

        const { title, description } = gameData.Item;

        const [translatedTitle, translatedDescription] = await Promise.all([
            translateText(title, languageCode),
            translateText(description, languageCode),
        ]);

        const translatedGame = {
            gameId: Number(gameId),
            languageCode,
            title: translatedTitle,
            description: translatedDescription,
        };

        await ddbDocClient.send(
            new PutCommand({
                TableName: process.env.TRANSLATIONS_TABLE_NAME,
                Item: translatedGame,
            })
        );

        return { statusCode: 200, body: JSON.stringify({ translation: translatedGame }) };

    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify({ error: "Translation failed" }) };
    }
};

async function translateText(text: string, targetLanguage: string): Promise<string> {
    const command = new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: "en",
        TargetLanguageCode: targetLanguage,
    });
    const response = await translateClient.send(command);
    return response.TranslatedText || text;
}
