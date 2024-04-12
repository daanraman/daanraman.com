var shapes = [];
var candidateShape;

var newShapePixels = [];
var existingPixels = [];
var candidatePixels = [];

var runPhase = "INIT";

var canvas= document.getElementById('defaultCanvas0');
var font;

var consequentCollisions = 0;
var consequentHits = 0;

var demoMode = false;

function Shape() {
    this.maxSize = Math.max(5,100/(consequentCollisions+1));
    //this.maxSize = 200;

    this.randomNumbers=[];
    this.col = color(random(255), random(255), random(255));

    // Generate x and y position, until we have a start coordinate that does not collide with existing pixels
    collidesWithExistingCanvas=true;
    while(existingPixels.length > 0 && collidesWithExistingCanvas){
        xPos = int(random(0, windowWidth));
        yPos = int(random(0, windowHeight));

        // Check if pixel at that position is colored or not
        index = (xPos + yPos * windowWidth) * 4;

        r = existingPixels[index + 0];
        g = existingPixels[index + 1];
        b = existingPixels[index + 2];
        a = existingPixels[index + 3];

        if (!((r+g+b) < 765 && (r+g+b) > 0)) {
            collidesWithExistingCanvas = false;
            this.x = xPos;
            this.y = yPos;
        }
    }

    for(var i = 0; i <= 4; i++){
        this.randomNumbers.push(int(random(-this.maxSize, this.maxSize)));
    }

    this.display = function () {
	fill(this.col);
	//noFill(); // make bezier vertex filled by connecting end lines - comment this to make everything colorful
        stroke(5);

    	//ellipse(this.x, this.y, this.randomNumbers[0] , this.randomNumbers[0]);
	beginShape();
        vertex(this.x, this.y); // first point
        bezierVertex(this.x, this.y, this.x+ this.randomNumbers[0], this.y + this.randomNumbers[1], this.x + this.randomNumbers[2], this.y + this.randomNumbers[3]);
        endShape();
    }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
}

function drawText() {
  background(254);
  message = "Daan Raman";
  textFont(font);
  fill(255);
  noStroke();

  fontsize = 10; // Start with a reasonable minimum size to increment from
  while(true) {
    textSize(fontsize);
    bounds = font.textBounds(message, 0, 0, fontsize);
    // Check if the width of the text with an additional 10px margin exceeds the window's width
    if (bounds.w + 10 > windowWidth || bounds.h > windowHeight) {
      break; // If so, break the loop
    }
    fontsize++; // Increment font size for the next iteration
  }
  fontsize--; // Decrease font size by one to ensure it fits with the margin

  textSize(fontsize);
  // Draw text at the top-left corner with a margin on the right
  text(message, 0, fontsize);
}

function preload() {
    font = loadFont('/Inter-Bold.ttf');
}

function pixelArraysOverlap(pixelArrayA, pixelArrayB){
    var r, g, b, a, i;

    // Check if the proposed new shape in ArrayB overlaps with ArrayA
    for (var i = 0; i + 4 <= pixelArrayB.length; i += 4) {
        r = pixelArrayB[i + 0];
        g = pixelArrayB[i + 1];
        b = pixelArrayB[i + 2];

        if ((r+g+b) < 765 && (r+g+b) > 0) {
            // Pixel is colored, now check if pixelArrayB is colored at that location too.
            r = pixelArrayA[i + 0];
            g = pixelArrayA[i + 1];
            b = pixelArrayA[i + 2];

            if ((r+g+b) < 765 && (r+g+b) > 0) {
                return true;
            }
        }
    }
    return false;
}

function draw() {
    clear();

    if(runPhase == "INIT"){
        drawText();
        runPhase = "CREATE_SHAPE"
    }

    if(runPhase == "CREATE_SHAPE") {
        candidateShape = new Shape();
        candidateShape.display();
        loadPixels();
        newShapePixels = pixels;

        // Draw all the confirmed shapes again
        clear();
        background(255);
	drawText();

        for(var i = 0; i< shapes.length; i++){
            shapes[i].display()
        }
        runPhase = "CHECK_EXISTING_PIXELS"

    }

    if(runPhase == "CHECK_EXISTING_PIXELS"){
        loadPixels();
        existingPixels = pixels;
        runPhase = "CHECK_OVERLAP"
    }

    if(runPhase == "CHECK_OVERLAP"){
        if (!pixelArraysOverlap(existingPixels, newShapePixels)){
            consequentHits++;
            consequentCollisions=0;
            shapes.push(candidateShape);
        }else{
            consequentHits=0;
            consequentCollisions++;
        }
        runPhase = "CREATE_SHAPE";
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  shapes.length = 0;
  runPhase ="INIT";
}

//function mouseClicked(){
   // if(demoMode){
   //     frameRate(60);
   //     demoMode = false;
   //}else{
   //     frameRate(5);
   //     demoMode = true;
   // }
//   saveCanvas('canvas', 'png');
//   return false;
//}
