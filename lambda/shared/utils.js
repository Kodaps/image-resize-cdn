
const { variables } = require("./const");

const string_to_slug = (str) => {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  let from = "àáäâèéëêìíïîòóöôùúüûñç·_,:;";
  let to   = "aaaaeeeeiiiioooouuuunc-----";
  for (var i=0, l=from.length ; i<l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

  return str;
}

const validateDimensions = (dims) => {

  // define variable to be set to true if requested dimension is allowed.
  let matchFound = false;

  let {width, height} = dims;

  // calculate the acceptable variance. If image dimension is 105 and is within acceptable
  // range, then in our case, the dimension would be corrected to 100.
  let variancePercent = (variables.variance/100);

  for (let dimension of variables.allowedDimension) {
      let minWidth = dimension.w - (dimension.w * variancePercent);
      let maxWidth = dimension.w + (dimension.w * variancePercent);
      if(width >= minWidth && width <= maxWidth){
          width = dimension.w;
          height = dimension.h;
          matchFound = true;
          break;
      }
  }
  // if no match is found from allowed dimension with variance then set to default
  //dimensions.
  if(!matchFound){
      width = variables.defaultDimension.w;
      height = variables.defaultDimension.h;
  }

  return {width, height};
}


module.exports = validateDimensions;