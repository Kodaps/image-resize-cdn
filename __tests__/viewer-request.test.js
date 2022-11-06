const lambda = require('../lambda/viewer-request-function');

const event1 = require("./events/viewer-request-event1.json")

test('viewer-request to work', () => {

  const callback = (err, request) => {


    expect(request.uri).toBe("/test1/128x128.png");
  }

  lambda.handler(event1, null, callback)
});

