
const validateDimensions = require('./utils');

test('formats 500x500 to be 512x512', () => {

  const {width:w1, height:h1} = validateDimensions({width: 500, height: 500});
  expect(w1).toBe(512);
  expect(h1).toBe(512);
});

