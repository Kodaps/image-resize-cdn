
// const lambda = require('../lambda/origin-response-function/index');
const event1 = require("./events/origin-response-event1.json")

test('origin response to work', () => {

  //const callback = (err, request) => {
  //  expect(request.uri).toBe("/test1/128x128.png");
  //}

  //lambda.handler(event1, null, callback)
});


fakeObject = () => {

  return {
    promise : async () => {
      return {fakeData:"fakeData"}
    }
  }

}


const S3 = {

  

}


test ("manageOriginResponseEvent", () => {

  let response = event1.Records[0].cf.response;
  let request = event1.Records[0].cf.request;

  // manageOriginResponseEvent()
}) 