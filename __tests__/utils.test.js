
const {validateDimensions, getOriginalCandidate } = require('../shared/utils');

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


test('formats 1920x1080 to be 1920x1080', () => {

  const {width:w1, height:h1} = validateDimensions({width: 1920, height: 1080});
  expect(w1).toBe(1920);
  expect(h1).toBe(1080);
});

test('getOriginalCandidate returns correct values', () => {

  const {width, height,originalKey } = getOriginalCandidate("/test1/100x100.png");
  expect(width).toBe(128);
  expect(height).toBe(128);
  expect(originalKey).toBe("test1");
});


test('getOriginalCandidate returns correct values', () => {

  const {width, height,originalKey } = getOriginalCandidate("/test1/480x270.png");
  expect(width).toBe(480);
  expect(height).toBe(270);
  expect(originalKey).toBe("test1");

});

