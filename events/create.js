
module.exports.list = (event, context, callback) => {
  const params = {
    TableName: 'Events'
  };
  
  var id = randomstring.generate({
    length: 3,
    capitalization: 'lowercase'
  });
  var key = randomstring.generate({
    length: 12,
    capitalization: 'lowercase'
  });

  var params = {
    TableName: 'Events',
    Item: {
      'id': id,
      'key': key,
      'name': req.body.name,
      'location': req.body.location,
      'date': req.body.date,
      'time': req.body.hour + ':' + req.body.min + '' + req.body.ampm,
      'hour': req.body.hour,
      'min' : req.body.min,
      'ampm' : req.body.ampm,
      'creator': req.body.creator,
      // 'email': req.body.email,
      'participants': [{
        'name': req.body.creator,
        'io': 'In'
      }]
    }
  };

  // write the todo to the database
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
    statusCode: 200,
    body: JSON.stringify(params.Item),
  };
  callback(null, response);
  });

});
