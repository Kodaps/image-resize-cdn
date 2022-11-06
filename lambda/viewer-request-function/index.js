'use strict';

// defines the allowed dimensions, default dimensions and how much variance from allowed
// dimension is allowed.

const {validateDimensions, variables, BUCKET} = require('./shared');



exports.handler = (event, _context, callback) => {

    const request = event.Records[0].cf.request;
    const headers = request.headers;

    // parse the querystrings key-value pairs. In our case it would be d=100x100
    const params = new URLSearchParams(request.querystring);

    // fetch the uri of original image
    let fwdUri = request.uri;


    // test lambda update
    // callback(null, request);
    // if there is no dimension attribute, just pass the request
    if(!params.has("d")){
        callback(null, request);
        return;
    }
    // read the dimension parameter value = width x height and split it by 'x'
    const dimensionMatch = params.get("d").split("x");

    // set the width and height parameters
    const w = dimensionMatch[0];
    const h = dimensionMatch[1];

    const {width, height} = validateDimensions({width: w, height: h});

    // parse the prefix, image name and extension from the uri.
    // In our case /images/image.jpg

    const match = fwdUri.match(/(.*)\/(.*)\.(.*)/);

    const prefix = match[1];
    const imageName = match[2];
    const extension = match[3];

    // read the accept header to determine if webP is supported.
    const accept = headers['accept']?headers['accept'][0].value:"";

    const url = [];
    // build the new uri to be forwarded upstream
    url.push(prefix);
    url.push(imageName);

    let ext = extension;
  
    // check support for webp
    if (accept.includes(variables.avifExtension)) {
      url.push(variables.avifExtension);
    } else if (accept.includes(variables.webpExtension)) {
      ext= variables.webpExtension;
    }

    url.push(width+"x"+height+"."+ext);

    fwdUri = url.join("/");

    // final modified url is of format /prefixpath/imgname/dxd.ext
    request.uri = fwdUri;
    callback(null, request);
};