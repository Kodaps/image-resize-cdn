'use strict';

const Sharp = require('sharp');

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});

const {BUCKET, getOriginalCandidates } = require('./shared');


const manageOriginResponseEvent = async (request, response) => {

  // reformat uri is of format /prefixpath/imgname/dxd.ext
  let path = request.uri;

  let key = path.substring(1);

  console.log(path, key);

  let {width, height, originalKey, originalKeyPng, requiredFormat} = getOriginalCandidates(path);

  console.log("getting", BUCKET, "Key", originalKey);

  let data

  try {
    data = await S3.getObject({ Bucket: BUCKET, Key: originalKey }).promise();
  } catch(err) {
    console.log("error, now getting ", originalKeyPng);
    data = await S3.getObject({ Bucket: BUCKET, Key: originalKeyPng }).promise();
  }

  if (!data) {
    console.log("no data so returning");
    return response;
  }

  console.log(`reformating to ${width} x ${height} @ ${requiredFormat}`);

  let buffer = await Sharp(data.Body)
      .resize(width, height)
      .toFormat(requiredFormat)
      .toBuffer();

  console.log("trying to save");

  try {
    await S3.putObject({
          Body: buffer,
          Bucket: BUCKET,
          ContentType: 'image/' + requiredFormat,
          CacheControl: 'max-age=31536000',
          Key: key,
          StorageClass: 'STANDARD'
      }).promise();
  } catch(err) {
    console.log("Exception while writing resized image to bucket", err);
  }

  console.log("returning response");

  // generate a binary response with resized image
  response.status = "200";
  response.body = buffer.toString('base64');
  response.bodyEncoding = 'base64';
  response.headers['content-type'] = [{ key: 'Content-Type', value: 'image/' + requiredFormat }];
  console.log("calling callback");

  return response; 

}



// https://aws.amazon.com/blogs/networking-and-content-delivery/resizing-images-with-amazon-cloudfront-lambdaedge-aws-cdn-blog/


exports.handler = (event, context, callback) => {

  let response = event.Records[0].cf.response;

  // only manage case where image is not present
  if (response.status !== "404") {
    callback(null, response);
    return; 
  }

  // let's create the file if it is missing

  let request = event.Records[0].cf.request;

  manageOriginResponseEvent(request, response).then((resp) => {
    callback(null, resp);
  }).catch((err) => {
    console.error(err);
    callback(null, response);
  })
};