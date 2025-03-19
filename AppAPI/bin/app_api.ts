#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AppApiStack } from '../lib/app_api-stack';
import "source-map-support/register";

const app = new cdk.App();
new AppApiStack(app, 'AppApiStack', { env: { region: "eu-west-1" } });
