// Import the library
const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

// Start the sketch
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'indigo';
    context.fillRect(0, 0, width, height);
  };
};

canvasSketch(sketch, settings);
