

//create a stage
const pixels = 10;

const stage = new Konva.Stage({
  container: 'create-a-space',
  width: 1024,
  height: 720,  
  draggable: true
});


// Zoom relative to pointer
const SCALE_FACTOR = 1.05;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

stage.on('wheel', function (event) {
  // Prevent page scrolling
  event.evt.preventDefault();

  const currentScale = stage.scaleX();
  const pointerPosition = stage.getPointerPosition();

  // Calculate the point under the mouse before scaling
  const pointUnderMouse = {
    x: (pointerPosition.x - stage.x()) / currentScale,
    y: (pointerPosition.y - stage.y()) / currentScale
  };

  // Determine zoom direction
  let zoomDirection;
  if (event.evt.deltaY > 0) {
    zoomDirection = -1; // zoom out
  } else {
    zoomDirection = 1; // zoom in
  }

  // Invert direction if Ctrl key is pressed (trackpad behavior)
  if (event.evt.ctrlKey) {
    zoomDirection = -zoomDirection;
  }

  // Calculate new scale
  let updatedScale;
  if (zoomDirection > 0) {
    updatedScale = currentScale * SCALE_FACTOR;
  } else {
    updatedScale = currentScale / SCALE_FACTOR;
  }

  // Clamp scale to allowed range
  if (updatedScale < MIN_SCALE) {
    updatedScale = MIN_SCALE;
  } else if (updatedScale > MAX_SCALE) {
    updatedScale = MAX_SCALE;
  }

  // Apply new scale
  stage.scale({
    x: updatedScale,
    y: updatedScale
  });

  // Adjust stage position to keep zoom centered on mouse
  const newStagePosition = {
    x: pointerPosition.x - pointUnderMouse.x * updatedScale,
    y: pointerPosition.y - pointUnderMouse.y * updatedScale
  };

  stage.position(newStagePosition);
});


const zoomIn = document.getElementById('zoom-in');
const zoomOut = document.getElementById('zoom-out');

zoomIn.addEventListener('click', function(){
  const currentScale = stage.scaleX();
  // Apply new scale
    // Calculate new scale
  let updatedScale;
    updatedScale = currentScale * SCALE_FACTOR;


  // Clamp scale to allowed range
  if (updatedScale < MIN_SCALE) {
    updatedScale = MIN_SCALE;
  } else if (updatedScale > MAX_SCALE) {
    updatedScale = MAX_SCALE;
  }
  stage.scale({
    x: updatedScale,
    y: updatedScale
  });
});

zoomOut.addEventListener('click', function(){
  const currentScale = stage.scaleX();
    // Calculate new scale
  let updatedScale;
 
    updatedScale = currentScale / SCALE_FACTOR;
  

  // Clamp scale to allowed range
  if (updatedScale < MIN_SCALE) {
    updatedScale = MIN_SCALE;
  } else if (updatedScale > MAX_SCALE) {
    updatedScale = MAX_SCALE;
  }
  // Apply new scale
  stage.scale({
    x: updatedScale,
    y: updatedScale
  });
});

const FRAME_DURATION_MS = 1000 / 60;
const EDGE_THRESHOLD = 100;
const SCROLL_SPEED = 2;

let scrollInterval = null;

stage.on('dragstart', function (event) {
  scrollInterval = setInterval(function () {
    const pointerPosition = stage.getPointerPosition();

    if (!pointerPosition) {
      return;
    }

    const pointerX = pointerPosition.x;
    const pointerY = pointerPosition.y;

    const stageWidth = stage.width();
    const stageHeight = stage.height();

    const draggedNode = event.target;

    // Check horizontal edges
    const isNearLeftEdge = pointerX < EDGE_THRESHOLD;
    const isNearRightEdge = pointerX > (stageWidth - EDGE_THRESHOLD);

    if (isNearLeftEdge) {
      stage.x(stage.x() + SCROLL_SPEED);
      draggedNode.x(draggedNode.x() - SCROLL_SPEED);
    }

    if (isNearRightEdge) {
      stage.x(stage.x() - SCROLL_SPEED);
      draggedNode.x(draggedNode.x() + SCROLL_SPEED);
    }

    // Check vertical edges
    const isNearTopEdge = pointerY < EDGE_THRESHOLD;
    const isNearBottomEdge = pointerY > (stageHeight - EDGE_THRESHOLD);

    if (isNearTopEdge) {
      stage.y(stage.y() + SCROLL_SPEED);
      draggedNode.y(draggedNode.y() - SCROLL_SPEED);
    }

    if (isNearBottomEdge) {
      stage.y(stage.y() - SCROLL_SPEED);
      draggedNode.y(draggedNode.y() + SCROLL_SPEED);
    }

  }, FRAME_DURATION_MS);
});

stage.on('dragend', function () {
  if (scrollInterval !== null) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
});

const bglayer = new Konva.Layer();
stage.add(bglayer);
var gridSpacing = 40;
var gridRange = 2000;
for (var x = -gridRange; x <= gridRange; x += gridSpacing) {
  for (var y = -gridRange; y <= gridRange; y += gridSpacing) {
    bglayer.add(new Konva.Circle({
      x: x,
      y: y,
      radius: 1,
      fill: '#848484',
      listening: false,
    }));
  }
}

const floorlayer = new Konva.Layer();
const furniturelayer = new Konva.Layer();
stage.add(floorlayer);
stage.add(furniturelayer);

const centerx = stage.width() / 4;
const centery = stage.height() / 4;
const floorplan = new Konva.Rect({
    fill: '#acc9f0c1',
    shadowColor: 'rgba(0,0,0,0.15)', 
    shadowBlur: 10, 
    shadowOffsetY: 4,
});
const floorPlanLabel = new Konva.Text();
const group = new Konva.Group();
const chairXY = (pixels * 5);
const shelfX = (pixels * 10);
const shelfY = (pixels * 3);
const padding = 20;
let lastAddedElementXY = {x: 0, y: 0};
let form = document.querySelector('form');
const addChairButton = document.getElementById('add-chair');
const addShelfButton = document.getElementById('add-shelf');
const deleteNode = document.getElementById('delete-node');
let initialScale = 1; 
group.add(floorplan);
group.add(floorPlanLabel);
floorlayer.add(group);
let w, h, inputX = 1, inputY = 1;
form.addEventListener('change', function(e){
  let value = Number(e.target.value);
  if("X" == e.target.name) {
    inputX = value ? value : 1;
    w = pixels * value;
  }
  if("Y" == e.target.name) {
    inputY = value ? value : 1;
    h = pixels * value;
  }
  let sqrtFootLabel
  if(inputX != 1 && inputY != 1) {
   sqrtFootLabel = (inputX * inputY);
  }
  floorPlanLabel.text(sqrtFootLabel);
  floorplan.width(w);
  floorplan.height(h);

});

form.addEventListener('submit', function(e){
  e.preventDefault();
});


const chairGroup = new Konva.Group({
  draggable: true,
  name: 'furniture',
  visible: false
});

const chairLabel = new Konva.Text({
  text: 'Chair 5x5',
});

const chair = new Konva.Rect({ 
    width: chairXY,
    height: chairXY,
    fill: '#1b9c80',
    //draggable: true,
    shadowColor: 'rgba(0,0,0,0.15)', 
    shadowBlur: 10, 
    shadowOffsetY: 4,
    
});    

chairGroup.add(chair);
chairGroup.add(chairLabel);
furniturelayer.add(chairGroup);


const shelfGroup = new Konva.Group({
  draggable: true,
  name: 'furniture',
  visible: false
});

const selfLabel = new Konva.Text({
  text: 'Shelf 10x3',
});

const shelf = new Konva.Rect({ 
    width: shelfX,
    height: shelfY,
    fill: '#1b9c80',
    //draggable: true,
    shadowColor: 'rgba(0,0,0,0.15)', 
    shadowBlur: 10, 
    shadowOffsetY: 4,
    
});    

shelfGroup.add(shelf);
shelfGroup.add(selfLabel);
furniturelayer.add(shelfGroup);

const tr = new Konva.Transformer({
  rotateEnabled: true,
  resizeEnabled: false,
  borderEnabled: true,
});

furniturelayer.add(tr);

let selectionRectangle = new Konva.Rect({
  fill: 'rgba(0,0,255,0.5)',
  visible: false,
});

furniturelayer.add(selectionRectangle);

let chairI = 0;
let shelfI = 0;
let newChair;
addChairButton.addEventListener('click', function(e){
  e.preventDefault();
  newChair = chairGroup.clone({
    visible: true,
  })
  furniturelayer.add(newChair);
  tr.nodes([newChair]);
  furniturelayer.batchDraw();
  chairI++;
});


chairGroup.on('click', ()=> {
  console.log('clicked');
  tr.node(); //clear group
  tr.node([chairGroup]);
})


addShelfButton.addEventListener('click', function(e){
  e.preventDefault();
  const newShelf = shelfGroup.clone({
    visible: true
  });
  furniturelayer.add(newShelf);
  tr.nodes([newShelf]);
  furniturelayer.batchDraw();
  shelfI++;
});

// furniture.on('click', function(){
//   console.log(this);
  
// });


deleteNode.addEventListener('click',function(e){
  e.preventDefault();
});


let x1, y1, x2, y2;
stage.on('mousedown touchstart', (e) => {
  // do nothing if we mousedown on any shape
  if (e.target !== stage) {
    return;
  }
  x1 = stage.getPointerPosition().x;
  y1 = stage.getPointerPosition().y;
  x2 = stage.getPointerPosition().x;
  y2 = stage.getPointerPosition().y;

  selectionRectangle.setAttrs({
    x: x1,
    y: y1,
    width: 0,
    height: 0,
    visible: true,
  });
});

stage.on('mousemove touchmove', () => {
  // do nothing if we didn't start selection
  if (!selectionRectangle.visible()) {
    return;
  }
  x2 = stage.getPointerPosition().x;
  y2 = stage.getPointerPosition().y;

  selectionRectangle.setAttrs({
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  });
});

stage.on('mouseup touchend', () => {
  // do nothing if we didn't start selection
  if (!selectionRectangle.visible()) {
    return;
  }
  // update visibility in timeout, so we can check it in click event
  setTimeout(() => {
    selectionRectangle.visible(false);
  });

  var shapes = stage.find('.furniture');
  var box = selectionRectangle.getClientRect();
  var selected = shapes.filter((shape) =>
    Konva.Util.haveIntersection(box, shape.getClientRect())
  );
  tr.nodes(selected);
});

// clicks should select/deselect shapes
stage.on('click tap', function (e) {
// if we are selecting with rect, do nothing
if (selectionRectangle.visible() && selectionRectangle.width() > 0 && selectionRectangle.height() > 0) {
  return;
}

  // if click on empty area - remove all selections
  if (e.target === stage) {
    tr.nodes([]);
    return;
  }

  // do nothing if clicked NOT on our rectangles
  if (!e.target.hasName('furniture')) {
    return;
  }

  // do we pressed shift or ctrl?
  const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
  const isSelected = tr.nodes().indexOf(e.target) >= 0;

  if (!metaPressed && !isSelected) {
    // if no key pressed and the node is not selected
    // select just one
    tr.nodes([e.target]);
  } else if (metaPressed && isSelected) {
    // if we pressed keys and node was selected
    // we need to remove it from selection:
    const nodes = tr.nodes().slice(); // use slice to have new copy of array
    // remove node from array
    nodes.splice(nodes.indexOf(e.target), 1);
    tr.nodes(nodes);
  } else if (metaPressed && !isSelected) {
    // add the node into selection
    const nodes = tr.nodes().concat([e.target]);
    tr.nodes(nodes);
  }
});


 /**
  * when a user enters the square footage the app will draw the ratio of the shape at max size.
  * take the height and width convert to pixels divide by height and width of the canvas 
  * 
  * a user can then add elements from a tool bar
  */