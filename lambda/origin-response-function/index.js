'use strict';

const Sharp = require('sharp');

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});

const {getOriginalCandidates, BUCKET} = require('./shared');


exports.handler = async (event, context, callback) => {

  let response = event.Records[0].cf.response;

  // only manage case where image is not present
  if (response.status !== "404") {
    callback(null, response);
    return;
  }

  // let's create the file if it is missing
  let request = event.Records[0].cf.request;


  // reformat uri is of format /prefixpath/imgname/dxd.ext
  let path = request.uri;

  // read the S3 key from the path variable, removing the initial "/".
  // Ex: path variable /forest/ploerdut/128x128.webp
  // key => forest/ploerdut/128x128.webp


  let {width, height, originalKey, originalKeyPng} = getOriginalCandidates(path);

  // get the source image file

  console.log("getting", BUCKET, "Key", originalKey);

  let data

  try {
    data = await S3.getObject({ Bucket: BUCKET, Key: originalKey }).promise();
  } catch(err) {
    console.log("error, now getting ", originalKeyPng);

    originalKey = originalKeyPng;
    data = await S3.getObject({ Bucket: BUCKET, Key: originalKey }).promise();
  }

  if (!data) {
    callback(null, response);
    return;
  }

  let buffer = await Sharp(data.Body)
      .resize(width, height)
      .toFormat(requiredFormat)
      .toBuffer();
  
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
  };

  // generate a binary response with resized image
  response.status = "200";
  response.body = buffer.toString('base64');
  response.bodyEncoding = 'base64';
  response.headers['content-type'] = [{ key: 'Content-Type', value: 'image/' + requiredFormat }];
  callback(null, response);

};