const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const { color } = require('canvas-sketch-util');
//const risoColors = require('riso-colors');

//const seed = random.getRandomSeed;

const settings = {
  dimensions: [1080, 1080],
};

//SKETCH
const sketch = (props) => {
  //random.setSeed(seed);
  const { context, width, height } = props
  let x, y, w, h, fill, stroke, blend;

  const num = 45;
  const degrees = -30;

  const rects = [];

  const line = []

  const rainbow = [
    'lightcoral',
    'orange',
    'mediumseagreen',
    'deepskyblue',
    'mediumslateblue'
  ]


  const rectColors = ['#333333', '#2E2E2E', '#151515']

  const bgColor = '131313';

  const mask = {
    radius: width * 0.4,
    sides: 3,
    x: width * 0.5,
    y: height * 0.5
  };

  for (let i = 0; i < num; i++) {      
    x = random.range(0, width); 
    y = random.range(0, height);
    w = random.range(600, width);
    h = random.range(40, 350);

    fill = random.pick(rectColors);
    stroke = random.pick(rectColors);

    //blend = (random.value() > 0.5) ? 'overlay' : 'source-over';

    rects.push({x, y, w, h, fill, stroke, blend});
  }
  return (props) => {
    const { context, width, height } = props

    //let angle, radius, rx, ry;
    //Render - donde empieza el dibujito
    
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();

    context.translate(mask.x, mask.y);
    
    /*context.beginPath();
    context.moveTo(0, -300);
    context.lineTo(300,200);
    context.lineTo(-300,200);
    context.closePath();*/

    drawPolygon({context, radius: mask.radius, sides: mask.sides});


    context.clip(); // ----> Todo lo que se dibuja después del clip, aparece dentro del triangulo creado arriba


    rects.forEach(rect => {
      const {x , y, w, h, fill, stroke, blend} = rect; //descontruir
      let shadowColor; 

      context.save();
      context.translate(-mask.x, -mask.y);

      context.translate(x, y);
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 10;

      context.globalCompositeOperation = blend;
      
      drawSkewedRect({context, w, h, degrees});

      shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5;

      //sombra
      context.shadowColor = Color.style(shadowColor.rgba); 
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;

      
      context.fill();
      context.stroke();

      context.globalCompositeOperation = blend;

      context.lineWidth = 2;
      context.strokeStyle = 'black';

      context.stroke();
      context.restore();
    })
    context.restore();

    // polygon outline

    context.save();
    //context.globalCompositeOperation = 'soft-light';
    context.translate(mask.x, mask.y);
    context.lineWidth = 5;
    context.strokeStyle = 'rgb(255,255,255, 0.6)';

    context.shadowColor = 'black';
    context.shadowBlur = 20;
    context.shadowOffsetX = 20;
    context.shadowOffsetY = 30;
    
    drawPolygon({context, radius: mask.radius, sides: mask.sides});


    context.stroke;

    context.restore();

    // Luz blanca

    context.save();

    const {x = -100, y = -200, w = 650, h= 680} = line;
    context.translate( x, y)
    context.beginPath();
    context.moveTo(527, 500);
    context.lineTo(0, 655);
    context.lineTo(0, w);
    context.lineTo(0, h);
    
    context.closePath();
    
    context.lineWidth = 2;
    context.strokeStyle = 'white';
    context.fillStyle = 'white';
    context.fill();
    context.stroke();
    context.restore();


    // LGTV 
    // hacer una función
    drawRainbow({context, fill: rainbow[0], stroke: rainbow[0]})

    //HACER UNA FUNCION PARA CADA COLOR Y SU POSICION
  };
};

const drawSkewedRect = ({context, w= 50, h= 50, degrees = 180}) => {
  const angle = math.degToRad(degrees); //angule degrees
  
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;
  
  context.save();
  
  context.translate(rx * -0.5, (ry - h) * -0.5);
  //context.strokeRect(w * -0.5, h * -0.5, w, h);
  context.beginPath();
  context.moveTo(0,0);  //parte izquierda
  context.lineTo( rx , -ry);
  context.lineTo( rx, ry + h);
  context.lineTo( 0, -h);
  context.closePath();

  context.restore();
};

const drawPolygon = ({context, radius = 100, sides = 3}) => {
  const slice = Math.PI * 2 / sides;

  context.beginPath();
  context.moveTo(0, -radius);
  for (let i = 0; i < sides; i++) {
    const theta = i * slice - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
    
  }
  context.closePath();

  context.stroke();
};


const drawRainbow = ({
  context,
  x = 600,
  y = 0,
  fill,
  stroke
}) => {
  context.save();
  context.translate(x, y)
  context.beginPath();
  context.moveTo(45, 290);
  context.lineTo(800, 350);
  context.lineTo(500, 350);
  context.closePath();

  context.lineWidth = 3;
  context.strokeStyle = stroke;
  context.stroke();
  context.fillStyle = fill;
  context.fill();
  context.restore();
}

canvasSketch(sketch, settings);
