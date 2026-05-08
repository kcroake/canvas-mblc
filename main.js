//create a stage
const pixels = 10;

const sceneWidth = 1024;
const sceneHeight = 720;

const stage = new Konva.Stage({
  container: 'create-a-space',
  width: sceneWidth,
  height: sceneHeight,  
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


const stageWidth = stage.width();
const stageHeight = stage.height();


stage.on('dragstart', function (event) {
  scrollInterval = setInterval(function () {
    const pointerPosition = stage.getPointerPosition();

    if (!pointerPosition) {
      return;
    }

    const pointerX = pointerPosition.x;
    const pointerY = pointerPosition.y;

    
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
var gridSpacing = 25;
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
let lastAddedElementXY = [{x: 0, y: 0, id: 0}];
let form = document.querySelector('form');
const addChairButton = document.getElementById('add-chair');
const addShelfButton = document.getElementById('add-shelf');
const deleteNode = document.getElementById('delete-node');
let initialScale = 1; 

group.add(floorplan);
group.add(floorPlanLabel);
floorlayer.add(group);

let w, h, inputX = 1, inputY = 1;

function getCenterPoint(stageWidth, stageHeight, floorWidth, floorHeight){
  stageWidth = stageWidth / 2;
  stageHeight = stageHeight / 2;
  floorWidth = floorWidth / 2;
  floorHeight = floorHeight / 2;

  x = stageWidth - floorWidth;
  y = stageHeight - floorHeight;

  return { X: Number(x), Y: Number(y) };
}



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
   sqrtFootLabel = (inputX * inputY) + 'sqft';
  }



  floorPlanLabel.text(sqrtFootLabel);
  floorplan.width(w);
  floorplan.height(h);
  group.x(getCenterPoint(stageWidth, stageHeight, w, h).X)
  group.y(getCenterPoint(stageWidth, stageHeight, w, h).Y)

  if(inputX != 1 && inputY != 1) {
    lastAddedElementXY[0].x = getCenterPoint(stageWidth, stageHeight, w, h).X; 
    lastAddedElementXY[0].y = getCenterPoint(stageWidth, stageHeight, w, h).Y;
  }
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
  text: 'Chair 5x5ft',
  x: 9,
  y: 2,
  fontSize: 9,
  rotation: 45,
  fill: '#ffffff',
  fontFamily: 'system-ui, -apple-system,"Segoe UI", Roboto,"Helvetica Neue", Arial,"Noto Sans", "Liberation Sans",sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !default;'
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
  text: 'Shelf 10x3ft',
  x: 5,
  y: 5,
  fontSize: 10,
  fill: '#ffffff',
  fontFamily: 'system-ui, -apple-system,"Segoe UI", Roboto,"Helvetica Neue", Arial,"Noto Sans", "Liberation Sans",sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !default;'
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
let selected;

/*

*/


addChairButton.addEventListener('click', function(e){
  e.preventDefault();
  if(chairI = 0) {
    chairX = lastAddedElementXY[0].x - chairXY - 20;
    chairY = lastAddedElementXY[0].y;
  } else {
     chairX = lastAddedElementXY[0].x - chairXY - 20;
      chairY = lastAddedElementXY[lastAddedElementXY.length - 1].y;
  }
  newChair = chairGroup.clone({
    visible: true,
    x: chairX,
    y: chairY,
  })
  furniturelayer.add(newChair);
  //tr.nodes([newChair]);
  selected = newChair;
  furniturelayer.batchDraw();
  chairI++;
  lastAddedElementXY.push(
    {
      x: chairX, 
      y: chairY + chairXY + 20, 
      id: newChair._id
    }
  );
  
});


addShelfButton.addEventListener('click', function(e){
  e.preventDefault();
   if(shelfI = 0) {
    shelfPosX = (lastAddedElementXY[0].x) - shelfX - 20;
    shelfPosY = lastAddedElementXY[0].y;
  } else {
    shelfPosX = (lastAddedElementXY[0].x) -  shelfX - 20;
    shelfPosY = lastAddedElementXY[lastAddedElementXY.length - 1].y;
  }
  const newShelf = shelfGroup.clone({
    visible: true,
    x: shelfPosX,
    y: shelfPosY,
  });
 
  furniturelayer.add(newShelf);
  //tr.nodes([newShelf]);
  selected = newShelf;
  furniturelayer.batchDraw();
  shelfI++;
  lastAddedElementXY.push(
    {
      x: shelfPosX, 
      y: shelfPosY + shelfY + 20, 
      id: newShelf._id
    }
  );
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


chairGroup.on('dragstart', (event) => {
  
});

chairGroup.on('dragend', (event) => {
});

// clicks should select/deselect shapes
stage.on('click tap', function (e) {
  if (
    selectionRectangle.visible() &&
    selectionRectangle.width() > 0 &&
    selectionRectangle.height() > 0
  ) {
    return;
  }

  if (e.target === stage) {
    tr.nodes([]);
    furniturelayer.batchDraw();
    return;
  }

  // Find the parent group named "furniture"
  const furnitureNode = e.target.findAncestor('.furniture', true);

  if (!furnitureNode) {
    return;
  }

  const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
  const isSelected = tr.nodes().indexOf(furnitureNode) >= 0;
  selected = furnitureNode;
  if (!metaPressed && !isSelected) {
    tr.nodes([furnitureNode]);
  } else if (metaPressed && isSelected) {
    const nodes = tr.nodes().slice();
    nodes.splice(nodes.indexOf(furnitureNode), 1);
    tr.nodes(nodes);
  } else if (metaPressed && !isSelected) {
    tr.nodes(tr.nodes().concat([furnitureNode]));
  }

  furniturelayer.batchDraw();
});

deleteNode.addEventListener('click',function(e){
  e.preventDefault();
  selected.remove();
  tr.nodes([]);
  furniturelayer.batchDraw();
});


const printStageButton = document.getElementById('print-stage');

printStageButton.addEventListener('click', function(e){
  e.preventDefault();
   const dataURL = stage.toDataURL({
    pixelRatio: 2 // double resolution
  });
  
  // create link to download
  const link = document.createElement('a');
  link.download = 'layout.png';
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});


// Function to make the stage responsive
function fitStageIntoParentContainer() {
  // Get the container element
  const container = document.getElementById('create-a-space');
  
  // Make the container take up the full width
  container.style.width = '100%';
  
  // Get current container width
  const containerWidth = container.offsetWidth;
  
  // Calculate scale based on virtual width vs actual width
  const scale = containerWidth / sceneWidth;
  
  // Set stage dimensions and scale
  stage.width(sceneWidth * scale);
  stage.height(sceneHeight * scale);
  stage.scale({ x: scale, y: scale });
}

// Initial fit
fitStageIntoParentContainer();

// Adapt the stage on window resize
window.addEventListener('resize', fitStageIntoParentContainer);

 /**
  * when a user enters the square footage the app will draw the ratio of the shape at max size.
  * take the height and width convert to pixels divide by height and width of the canvas 
  * 
  * a user can then add elements from a tool bar
  */