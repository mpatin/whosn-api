'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const body = JSON.parse(event.body);

  var params = {
    TableName: 'Events',
    Item: {
      id: uuid.v1(),
      createdAt: timestamp,
      updatedAt: timestamp,
      name: body.name,
      location: body.location,
      date: body.date,
      hour: body.hour,
      min: body.min,
      ampm: body.ampm,
      creator: body.creator,
    }
  };

  // write to the database
  dynamoDb.put(params, (error) => {
  // handle potential errors
  if (error) {
    console.error(error);
    callback(null, {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the todo item.',
    });
    return;
  }

  // create a response
  const response = {
    statusCode: 201,
    body: JSON.stringify(params.Item),
  };
  callback(null, response);
  });

};
