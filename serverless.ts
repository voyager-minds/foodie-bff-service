import type { AWS, AwsLambdaVpcConfig } from '@serverless/typescript';
import functions from '@functions/index';

const serverlessConfiguration: AWS = {
  useDotenv: true,
  service: 'foodie-bff-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-domain-manager'],
  params: {
    dev: {
      domain: 'api.foodie.codelabs.lk',
      certificate: 'arn:aws:acm:us-west-2:165242359189:certificate/2be9039f-9599-4a42-8874-9fdfb7c2dee3',
      basePath: '${self:service}',
      securityGroupIds: 'sg-0a9aa1ec74d83eafd',
      subnetIds: 'subnet-01ab493f734dec71c,subnet-0770e48b164fb5f2c',
      profile: 'krish',
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    stage: 'dev',
    // profile: '${param:profile}', // Using only for local deployment
    stackName: '${self:service}-stack-${self:provider.stage}',
    apiName: '${self:service}-${self:provider.stage}',
    region: 'us-west-2',
    memorySize: 1024,
    httpApi: { cors: true },
    endpointType: 'regional',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
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
      CATALOG_API_URL: 'https://api.foodie.codelabs.lk/catalog-service',
      REVIEWS_API_URL: 'https://api.foodie.codelabs.lk/reviews-service',
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
      concurrency: 5,
    },
    customDomain: {
      http: {
        domainName: '${param:domain}',
        certificateArn: '${param:certificate}',
        basePath: '${param:basePath}',
        createRoute53Record: true,
        endpointType: 'regional'
      }
    }
  },
};

module.exports = serverlessConfiguration;
