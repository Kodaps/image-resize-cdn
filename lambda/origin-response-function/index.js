'use strict';

const Sharp = require('sharp');

const AWS = require('aws-sdk');

const S3 = new AWS.S3({
  signatureVersion: 'v4',
});

const {BUCKET, getOriginalCandidate, BUCKET_PREFIX, BUCKET_LIST } = require('./shared');

const tryGetImage = async (Bucket, Key) => {

  try {
    return await S3.getObject({ Bucket, Key}).promise();
  } catch(err) {
    return null;
  }
}


const manageOriginResponseEvent = async (request, response, bucket, bucketPrefix, defaultExtension = "jpg") => {

  // reformat uri is of format /prefixpath/imgname/dxd.ext
  const path = request.uri;

  // parse the querystrings key-value pairs. In our case it would be d=100x100
  // const params = new URLSearchParams(request.querystring);

  //if(!params.has("d") && !params.has("fmt") ){
  //  return response;
  //}

  // use img cdn as default while we test ! 



  let key = path.substring(1);

  console.log(path, key);

  let {width, height, originalKey, requiredFormat} = getOriginalCandidate(path);

  let data = null;

  data = await tryGetImage(bucket, bucketPrefix + originalKey + defaultExtension);

  if (!data) {
    data = await tryGetImage(bucket, bucketPrefix + originalKey + ".png");
  }

  if (!data) {
    let altExtension = (defaultExtension === ".jpg") ? ".jpeg" : ".jpg"
    data = await tryGetImage(bucket, bucketPrefix + originalKey + altExtension);
  }

  if (!data) {
    console.log("no data so returning");
    response.body = `<body><h1>Unable to find the key</h1>`;
    response.body += `<span> File ${bucketPrefix + originalKey} <br/> bucket: ${bucket}, bucket prefix: ${bucketPrefix}</span></body>`;
    response.bodyEncoding = 'text';
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
          Bucket: bucket,
          ContentType: 'image/' + requiredFormat,
          CacheControl: 'max-age=31536000',
          Key: bucketPrefix + key,
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
  response.headers['content-type'] = [
    { key: 'Content-Type', value: 'image/' + requiredFormat },
  ];
    response.headers['cache-control'] = [
    { key: 'Cache-Control', value: 'max-age=31536000' }
  ];
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

  const domain = event.Records[0].cf.config.distributionDomainName || 'img.ecotree.green';
  const distribution = event.Records[0].cf.config.distributionId;
  let bucket = BUCKET;
  let bucketPrefix = BUCKET_PREFIX;
  let defaultExtension = "jpg";

  if (distribution && BUCKET_LIST[distribution]) {
    bucket = BUCKET_LIST[distribution].BUCKET;
    bucketPrefix  = BUCKET_LIST[distribution].BUCKET_PREFIX;
    defaultExtension= BUCKET_LIST[distribution].JPG_EXTENSION;
  } else if (BUCKET_LIST[domain]) {
    bucket = BUCKET_LIST[domain].BUCKET;
    bucketPrefix  = BUCKET_LIST[domain].BUCKET_PREFIX;
    defaultExtension= BUCKET_LIST[domain].JPG_EXTENSION;
  }

  manageOriginResponseEvent(request, response, bucket, bucketPrefix, defaultExtension).then((resp) => {
    callback(null, resp);
  }).catch((err) => {
    console.error(err);
    response.body = `<body><h1>${err.message}</h1>`;
    response.body += `<span> domain: ${domain}, distribution ${distribution} <br/> bucket: ${bucket}, bucket prefix: ${bucketPrefix}</span></body>`;
    response.bodyEncoding = 'text';
    callback(null, response);
  })
};