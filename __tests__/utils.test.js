
const {validateDimensions, getOriginalCandidates } = require('../shared/utils');

test('formats 500x500 to be 512x512', () => {

  const {width:w1, height:h1} = validateDimensions({width: 500, height: 500});
  expect(w1).toBe(512);
  expect(h1).toBe(512);
});


test('formats 500x500 to be 512x512', () => {

  const {width:w1, height:h1} = validateDimensions({width: 500, height: 250});
  expect(w1).toBe(480);
  expect(h1).toBe(270);
});


test('formats 500x500 to be 512x512', () => {

  const {width:w1, height:h1} = validateDimensions({width: 480, height: 270});
  expect(w1).toBe(480);
  expect(h1).toBe(270);
});


test('getOriginalCandidates returns correct values', () => {

  const {width, height,originalKey, originalKeyPng } = getOriginalCandidates("/test1/100x100.png");
  expect(width).toBe(128);
  expect(height).toBe(128);
  expect(originalKey).toBe("test1.jpg");
  expect(originalKeyPng).toBe("test1.png");
  
});


