
const variables = {
  allowedDimension : [ 
    {w:128,h:128}, {w:256,h:256}, {w:512,h:512}, {w:1024,h:1024}, // square
    {w:240,h:135}, // fullHD / 8
    {w:480,h:270}, // fullHD / 4
    {w:960,h:540},  // fullHD / 2
    {w:1920,h:1080}, // 16:9
  ],
  defaultDimension : {w:256,h:256},
  variance: 33,
  webpExtension: 'webp',
  avifExtension: 'avif',
};


const BUCKET = 'image-resize-125400374371-us-east-1';

module.exports = {
  variables, BUCKET
}
