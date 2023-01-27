import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
    S3Client,
    ListObjectsV2Command,
    ListObjectsV2CommandOutput,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import {Message} from "./models/Message";

const region = "eu-west-2";
const client = new S3Client({region});

const sortMessage = (a: Message, b: Message) => {
    return Number(a.ts) - Number(b.ts)
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env['BUCKET'],
        });
        const response: ListObjectsV2CommandOutput = await client.send(command);

        const messages: Message[] = [];

        if (response.Contents) {
            for (const key of response.Contents) {
                const getObjectCommand = new GetObjectCommand({
                    Bucket: process.env['BUCKET'],
                    Key: key.Key,
                });
                const message = await (await client.send(getObjectCommand)).Body?.transformToString();
                if (message) {
                    const messageList: Message[] = JSON.parse(message);
                    for (const messageItem of messageList) {
                        messages.push(messageItem);
                    }
                }
            }
        }

        messages.sort(sortMessage);

        const filteredMessages: unknown[] = []
        messages.map((message) => {
            filteredMessages.push({
                ts: (new Date(Number(message.ts)*1000)).toISOString(),
                text: message.text,
            })
        })

        return {
            statusCode: 200,
            body: JSON.stringify(filteredMessages),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
