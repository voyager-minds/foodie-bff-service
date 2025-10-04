import type { AWS, AwsLambdaVpcConfig } from '@serverless/typescript';
import functions from '@functions/index';

const serverlessConfiguration: AWS = {
  useDotenv: true,
  service: 'foodie-bff-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  params: {
    dev: {
      // domain: '',
      // certificate: '',
      securityGroupIds: 'sg-0a9aa1ec74d83eafd',
      subnetIds: 'subnet-01ab493f734dec71c,subnet-0770e48b164fb5f2c',
      // apiKey: '${self:provider.apiName}-apikey',
      // apiKeyValue: 'dS8glZfOdz89lv3bR2hrL3oRkXhU9JNv10vagkg3',
      profile: 'krish',
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    stage: 'dev',
    profile: '${param:profile}',
    stackName: '${self:service}-stack-${self:provider.stage}',
    apiName: '${self:service}-${self:provider.stage}',
    region: 'us-west-2',
    memorySize: 1024,
    timeout: 30,
    httpApi: { cors: true },
    endpointType: 'regional',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      restApiId: { Ref: "ApiGatewayRestApi" },
      restApiRootResourceId: { 'Fn::GetAtt': ['ApiGatewayRestApi', 'RootResourceId'] },
      // apiKeys: [{
      //   name: '${param:apiKey}',
      //   value: '${param:apiKeyValue}',
      //   description: 'API key use to manage resource policy of all inbound calls',
      //   enabled: true
      // }],
      usagePlan: {
        quota: {
          limit: 1000, period: 'DAY'
        },
        throttle: {
          rateLimit: 100, burstLimit: 300
        }
      }
    },
    vpc: {
      securityGroupIds: {
        'Fn::Split': [',', '${param:securityGroupIds}'],
      },
      subnetIds: {
        'Fn::Split': [',', '${param:subnetIds}'],
      },
    } as unknown as AwsLambdaVpcConfig,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      CATALOG_API_URL: 'https://api.foodie-catalog.com',
      REVIEWS_API_URL: 'https://api.foodie-reviews.com',
    },
  },
  // import the function via paths
  functions: { ...functions },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: [],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    // customDomain: {
    //   rest: {
    //     domainName: '${param:domain}',
    //     certificateArn: '${param:certificate}',
    //     createRoute53Record: true,
    //     endpointType: 'regional'
    //   }
    // }
  },
};

module.exports = serverlessConfiguration;
