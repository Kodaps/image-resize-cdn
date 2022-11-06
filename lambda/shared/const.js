
const variables = {
  allowedDimension : [ {w:128,h:128}, {w:256,h:256}, {w:512,h:512}, {w:800,h:400}, {w:1920,h:1080} ],
  defaultDimension : {w:256,h:256},
  variance: 20,
  webpExtension: 'webp',
  avifExtension: 'avif',
};


const BUCKET = 'image-resize-125400374371-us-east-1';

module.exports = {
  variables, BUCKET
}
