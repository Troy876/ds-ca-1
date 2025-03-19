import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as custom from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import * as apig from "aws-cdk-lib/aws-apigateway";
import { generateBatch } from "../shared/utils";
import { games } from "../seed/games";

export class AppApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const gamesTable = new dynamodb.Table(this, "GamesTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "id", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "Games",
    });

    const getAllGamesFn = new lambdanode.NodejsFunction(this, "GetAllGamesFn", {
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: `${__dirname}/../lambdas/getAllGames.ts`,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      environment: {
        TABLE_NAME: gamesTable.tableName,
        REGION: "eu-west-1",
      },
    });

    new custom.AwsCustomResource(this, "gamesddbInitData", {
      onCreate: {
        service: "DynamoDB",
        action: "batchWriteItem",
        parameters: {
          RequestItems: {
            [gamesTable.tableName]: generateBatch(games),
          },
        },
        physicalResourceId: custom.PhysicalResourceId.of("gamesddbInitData"),
      },
      policy: custom.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [gamesTable.tableArn],
      }),
    });

    gamesTable.grantReadData(getAllGamesFn);

    const api = new apig.RestApi(this, "AppAPI", {
      description: "app api",
      deployOptions: {
        stageName: "dev",
      },
    });

    const gamesEndpoint = api.root.addResource("games");
    gamesEndpoint.addMethod(
      "GET",
      new apig.LambdaIntegration(getAllGamesFn, { proxy: true })
    );
  }
}
