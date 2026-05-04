

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



const chairXY = (pixels * 5);
const padding = 20;
let lastAddedElementXY = {x: 0, y: 0};
let form = document.querySelector('form');
let addChairButton = document.getElementById('add-chair');
let initialScale = 1; 
const floorPlanLabel = new Konva.Text();

form.addEventListener('submit', function(e){
    e.preventDefault();
    const data = new FormData(form);
    const w = pixels * data.get('X');
    const h = pixels * data.get('Y');
    const sqrtFootLabel = (data.get('X') * data.get('Y')) + "sqft";
    const group = new Konva.Group();
    let centerpointy, centerpointx;
    if((w/2) > centerx){
      centerpointx = (w/2) - centerx;
    } else {
      centerpointx = centerx - (w/2);
    }

    if((h/2) > centery) {
      centerpointy = (h/2) - centery
    } else {
      centerpointy = centery - (h/2);
    }
    
    floorPlanLabel.text(sqrtFootLabel);

    floorplan.width(w);
    floorplan.height(h);
   
    lastAddedElementXY.x = w;  
    
    
    
    if(w > h) {
        initialScale = 1024/w * 100
    } else {
        initialScale = 1024/h * 100
    }

    group.add(floorplan);
    group.add(floorPlanLabel);
    floorlayer.add(group);
});

addChairButton.addEventListener('click', function(){
    console.log(lastAddedElementXY);
    const group = new Konva.Group({
      draggable: true
    });
    const chairLabel = new Konva.Text({
      text: 'Chair 5x5ft',
      x: lastAddedElementXY.x,
    });
    const chair = new Konva.Rect({ 
        width: chairXY,
        height: chairXY,
        x: lastAddedElementXY.x,
        fill: '#1b9c80',
        //draggable: true,
        shadowColor: 'rgba(0,0,0,0.15)', 
        shadowBlur: 10, 
        shadowOffsetY: 4,
    });    
    group.add(chair);
    group.add(chairLabel);
    furniturelayer.add(group);
}); 




 /**
  * when a user enters the square footage the app will draw the ratio of the shape at max size.
  * take the height and width convert to pixels divide by height and width of the canvas 
  * 
  * a user can then add elements from a tool bar
  */