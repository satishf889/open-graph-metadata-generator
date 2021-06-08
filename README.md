# open-graph-metadata-generator
Repository used to extract open graph metadata of an website using **AWS Serverless Architecture**

# AWS Services Used:

- AWS API Gateway
- AWS DynamoDB
- AWS Lambda

# Steps to execute this code

1. Create an AWS Lambda function using Node.js as preffered language
2. Zip complete repository and import in AWS Lambda
3. This repository uses Environment variable for DynamoTable Name i.e **TABLE_NAME**
4. For caching we are using Dynamo Table, create a Dynamo Table with Partion Key as **Requested_URL**. Also be cautious while setting read and write capacity this program can run with 1 Read and 1 Write capacity
5. After successful creation of table create AWS API Gateway which will be used as RestAPI. Also enables CORS if you are integrating this code with Frontend
6. There are 2 required variable while requesting the Open Graph Data using API Gateway
    1. request_url
    2. refresh_existing


