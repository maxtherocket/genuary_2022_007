const canvasSketch = require('canvas-sketch');
const Random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const colors = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ]
};

// You can force a specific seed by replacing this with a string value
const defaultSeed = '';
// 79142
// 251570
// 68001
// 989191
// 940838

const defaultColor = '';
// Color themes
// 95
// 39

// Set a random seed so we can reproduce this print later
Random.setSeed(defaultSeed || Random.getRandomSeed());

const colorThemeIndex = defaultColor || Random.rangeFloor(colors.length);
console.log('Color Theme Index:', colorThemeIndex);

const colorTheme = colors[colorThemeIndex].map((c)=>{
  return Color.parse(c);
});
const colorThemeNoBg = colorTheme.slice(1, colorTheme.length);

const sketch = ({width, height}) => {

  const margin = width * 0.05;
  const sizeInsideMargin = width - margin * 2;

  const colBg = Random.pick(colorTheme).hex;
  const colFg = Random.pick(colorTheme).hex;

  const numCurves = 3;
  const curveXSpan = sizeInsideMargin / numCurves;
  const curveXSpanHalf = curveXSpan / 2;
  let controlPoints = [];
  let yDirection = Random.sign();
  for (let c = 0; c < numCurves; c++){
    const curveStartX = margin + (sizeInsideMargin / numCurves) * c;
    for (let i = 0; i < 2; i++){
      const startX = curveStartX + curveXSpanHalf * i;
      const endX = startX + curveXSpanHalf;
      //Random.range(startX, endX)
      controlPoints.push([startX + (endX - startX) / 2, height * 0.5 + Random.range(height * 0.05, height * 0.2) * yDirection]);
    }
    controlPoints.push([curveStartX + curveXSpan, Random.range(height * 0.4, height * 0.6)]);
    yDirection *= -1;
  }

  const randomRotate = Random.rangeFloor(0, 4);

  return ({ context, width, height }) => {

    const ctx = context;

    context.translate(width/2, height/2);
    context.rotate((Math.PI / 2) * randomRotate);

    context.save();

    context.translate(-width/2, -height/2);

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.fillStyle = colBg;
    context.fillRect(margin, margin, sizeInsideMargin, sizeInsideMargin);

    context.fillStyle = colFg;
    context.beginPath();
    context.moveTo(margin, height/2);

    for (let c = 0; c < controlPoints.length; c+=3){
      const cp1 = controlPoints[c];
      const cp2 = controlPoints[c+1];
      const end = controlPoints[c+2];
      context.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], end[0], end[1]);
    }

    context.lineTo(width-margin, height-margin);
    context.lineTo(margin, height-margin);
    context.lineTo(margin, height/2);
    context.fill();  
    
    context.restore();

    // for (let c = 0; c < controlPoints.length; c+=3){
    //   const cp1 = controlPoints[c];
    //   const cp2 = controlPoints[c+1];
    //   const end = controlPoints[c+2];
    //   context.fillStyle = 'red';
    //   context.beginPath();
    //   context.arc(cp1[0], cp1[1], 10, 0, 2 * Math.PI);
    //   context.fill();
    //   context.fillStyle = 'yellow';
    //   context.beginPath();
    //   context.arc(cp2[0], cp2[1], 10, 0, 2 * Math.PI);
    //   context.fill();
    // }

  };
};

canvasSketch(sketch, settings);
