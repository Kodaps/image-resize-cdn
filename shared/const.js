
const formats = {
  sq0: {w:128,h:128}, // sq 0
  rect0: {w:240,h:135}, // rect0 = fullHD / 8
  sq1:{w:256,h:256}, // sq 1
  rect1: {w:480,h:270}, // rect1 = fullHD / 4
  sq2:{w:512,h:512}, // sq 2
  rect2: {w:960,h:540},  // rect2 - fullHD / 2
  sq3:{w:1024,h:1024}, // sq3
  rect3: {w:1440,h:810},   // fullHD x 0.75
  rect4: {w:1920,h:1080}, // rect3 // fullHD 16:9
  sq4:{w:2048,h:2048}, // sq3
}


const variables = {
  allowedDimension : [ 
    formats.sq0, // sq 0
    formats.rect0, // rect0 = fullHD / 8
    formats.sq1, // sq 1
    formats.rect1, // rect1 = fullHD / 4
    formats.sq2, // sq 2
    formats.rect2,  // rect2 - fullHD / 2
    formats.sq3, // sq3
    formats.rect3, // rect3 // fullHD 16:9
    formats.rect4, // rect3 // fullHD 16:9
    formats.sq4,

  ],
  defaultDimension : formats.sq1,
  variance: 33,
  webpExtension: 'webp',
  avifExtension: 'avif',
};

//const BUCKET = 'ecotree-res';
//const BUCKET_PREFIX = 'site/4.3.0/';


const BUCKET = 'image-resize-125400374371-us-east-1';
const BUCKET_PREFIX = '';

//const BUCKET = 'image-resize-125400374371-us-east-1';
//const BUCKET_PREFIX = '';

const BUCKET_RES = { // ecotree.fr
  BUCKET: 'ecotree-res',
  BUCKET_PREFIX: 'site/4.3.0/',
  JPG_EXTENSION: ".jpg"
}

const BUCKET_RES_2 = { // ecotree.fr
  BUCKET: 'cdn.ecotree.green',
  BUCKET_PREFIX: '',
  JPG_EXTENSION: ".jpg"
}

const BUCKET_MDN_IMG = { // ecotree.fr
  BUCKET: 'image-resize-125400374371-us-east-1',
  BUCKET_PREFIX: '',
  JPG_EXTENSION: ".jpg"
}

const BUCKET_BO = { // ecotree.fr
  BUCKET: 'blog-ecotree',
  BUCKET_PREFIX: '',
  JPG_EXTENSION: ".jpeg"
}


const BUCKET_LIST = {
  "cdn.ecotree.fr": BUCKET_RES_2,
  "d2omnifng3m7y7.cloudfront.net": BUCKET_RES_2,
  "E30U3W83WAEDNB":  BUCKET_RES_2,
  "cdn.ecotree.green": BUCKET_RES,
  "d262e0vfgb2qs7.cloudfront.net": BUCKET_RES,
  "E23G5W8MW0F84B": BUCKET_RES,
  "bocdn.ecotree.fr": BUCKET_BO,
  "d21x7cmog12k0h.cloudfront.net": BUCKET_BO,
  "EQ43O8LWV49I4": BUCKET_BO,
  "img.ecotree.fr": BUCKET_MDN_IMG,
  "d1z2xofqct1q05.cloudfront.net": BUCKET_MDN_IMG,
  "E1D50NY11PMGMI": BUCKET_MDN_IMG
}


module.exports = {
  variables, BUCKET, BUCKET_PREFIX, BUCKET_LIST
}
