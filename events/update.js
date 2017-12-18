'use strict';

const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const body = JSON.parse(event.body);

  // put validation - make sure each item exists and is a string
  if (typeof body.name !== 'string' ||
  typeof body.location !== 'string' ||
  typeof body.date !== 'string' ||
  typeof body.hour !== 'string' ||
  typeof body.min !== 'string' ||
  typeof body.ampm !== 'string' ||
  typeof body.creator !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the item.',
    });
    return;
  }

  // name, location, date, and hour are reserved words
  const params = {
    TableName: 'Events',
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#event_name': 'name',
      '#event_location': 'location',
      '#event_date': 'date',
      '#event_hour': 'hour',
      '#event_min': 'min',
    },
    ExpressionAttributeValues: {
      ':updatedAt': timestamp,
      ':name': body.name,
      ':location': body.location,
      ':date': body.date,
      ':hour': body.hour,
      ':min': body.min,
      ':ampm': body.ampm,
      ':creator': body.creator,
    },
    UpdateExpression: `
      set updatedAt = :updatedAt,
      #event_name = :name,
      #event_location = :location,
      #event_date = :date,
      #event_hour = :hour,
      #event_min = :min,
      ampm = :ampm,
      creator = :creator
    `,
    ReturnValues:"ALL_NEW"
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
