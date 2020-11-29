var sketchContainer = "sketch";
var colorArr = ["#F50D03", "#A40000"];
var playColor = "#FCF1DC"
var notesArr = [
  [ 'C#5', 'A3', 'A4', 'C#3', 'C#4', 'E6', 'E4', 'C#4', 'E3', 'E4', 'E6', 'C#2'],
  ['C#4', 'E4', 'G#4', 'C#3', 'C#5', 'E6', 'E4', 'C#4', 'E3', 'E4', 'E6', 'G#5'],
  ['E4', 'G#4', 'G#5', 'G#3', 'B3', 'B4', 'E4', 'B3', 'E3', 'G#3', 'E6', 'G#5'],
  ['G#4', 'G#5', 'G#3', 'B3', 'B4', 'D#4', 'B3', 'D#3', 'G#3', 'D#6', 'G#5']
]
var a = 0;
var notes = notesArr[a];
var nFishes = 10;
var nRipples = 1;
var slider;
var canvas;

var sketch = function (p) {
    // Global variables
    var fishes = [];
    var ripples = [];
    var repulsionDist = 120;
    var alignDist = 200;
    //Used for fish creation
    var limit = 800;
    //Max fish velocity
    var maxVel = 3;
    var repulsionDistSq = p.sq(repulsionDist);
    var alignDistSq = p.sq(alignDist);
    var limitSq = p.sq(limit);
    var maxVelSq = p.sq(maxVel);

    // Initial setup
    p.setup = function () {
        // Create the canvas
        canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        limit = p.windowWidth;
        alignDistSq = p.sq(alignDist);
        //Num Fishses Slider
        sliderNum = p.createSlider(0, 100, 5, 1);
        sliderNum.position(30, 30);
        sliderNum.style('background', playColor);
        //Num Ripples slider
        sliderSpr = p.createSlider(0, 15, 1, 1);
        sliderSpr.position(30, 60);
        sliderSpr.style('background', playColor);
        radio = p.createRadio();
        p.getAudioContext().resume();
        if (p.getAudioContext().state !== 'running') {
            p.getAudioContext().resume();
        }
        //Add Ripples
        createRipples(nRipples);
        //CreateFishes
        createfishes(nFishes);
        //Every 20 seconds update Ripples position
        setInterval(() => {createRipples(nRipples, true);}, 20000);
        //Every two seconds change notes
        setInterval(() => {
          a = (a+1)%notesArr.length;
          notes = notesArr[a];
          for(let i=0; i < fishes.length; i++){
            fishes[i].note = p.random(notes);
          }
        }, 2000);
    };

    // Draw the page
    p.draw = function () {
        //Number of ripples changed => Create missing ripples
        if(nRipples != sliderSpr.value() ){
            createRipples(sliderSpr.value(), false);
        }
        //Number of fishes changes => Create missing fishes
        if(nFishes != sliderNum.value()){
          createfishes(sliderNum.value());
        }
        //Set background to 105,179,205 => FCF1DC
        p.background(105,179,205, 40);
        //Stroke measure for title and sliders
        p.strokeWeight(0.8);
        p.stroke("#FCF1DC");
        p.textSize(25);
        p.text("Fishes: " + sliderNum.value(), sliderNum.x + sliderNum.width + 10, sliderNum.y + sliderNum.height);
        p.text("Ripples: " + sliderSpr.value(), sliderSpr.x + sliderSpr.width + 10, sliderSpr.y + sliderSpr.height);
        p.textSize(42);
        p.text("Zen Not Zen", p.width/2 -42*10/2, p.height/10);
        p.textSize(30);
        p.text("Move the sliders to add more Ripples and Fishes", p.width/2 -24*30/2, p.height/10+50);
        //Paint ripples shadows
        for(let j=0; j < ripples.length; j++){
          ripples[j].paintShadows();
        }
        //paint fishes
        var fish;
        for (let i = 0; i < fishes.length; i++) {
            fish = fishes[i];

            // Evaluate collisions with other fishes
            fish.evaluate(fishes);
            //Do not let go too much of those beautiful fishes
            fish.keepClose();
            //Update fish coordinates
            fish.update();

            //Paint it with is color (when playing tale is white)
            fish.paint(fish.col);

        }
        for(let j=0; j < ripples.length; j++){
          //Evaluate if there are any fishes in the ripple area.
          ripples[j].evaluate();
          //paint the ripple
          ripples[j].paint();
        }
    };

    //When window is resized
    p.windowResized = function(){
      canvas.resize(p.windowWidth, p.windowHeight);
      limit = p.windowWidth;
    };

    //MouseDragged listener => Make fishes disappear, resume AudioContext;
    p.mouseDragged = function (e){
      if(!p.fullscreen()){
        p.fullscreen(true);
      }
      p.getAudioContext().resume();
      checkAndPlay();
    }

    //MouseDragged listener => Make fishes disappear, resume AudioContext;
    p.mouseClicked = function (e){
      if(!p.fullscreen()){
        fullscreen(true);
      }
      p.getAudioContext().resume();
      e.preventDefault();
      checkAndPlay();
    }

    //If on fish, make it move and play a note
    function checkAndPlay(){
      let distX, distY;
      for(let i=0; i < fishes.length; i++){
        distX = Math.abs(Math.abs(fishes[i].posBody.x) - Math.abs(p.mouseX));
        distY = Math.abs(Math.abs(fishes[i].posBody.y) - Math.abs(p.mouseY));
        if(fishes[i].pos.x >=0 && p.mouseX >= 0 && fishes[i].pos.y >=0 && p.mouseY >=0){
          if(
            (distX < 100) &&
            (distY < 100)
            ){
              fishes[i].play(true);
          }
        }
        if(fishes[i].pos.x >=0 && p.mouseX >= 0 && fishes[i].pos.y <=0 && p.mouseY <=0){
          if(
            (distX < 100) &&
            (distY < 100)
            ){
              fishes[i].play(true);
          }
        }
        if(fishes[i].pos.x <= 0 && p.mouseX <=  0 && fishes[i].pos.y >=0 && p.mouseY >=0){
          if(
            (distX < 100) &&
            (distY < 100)
            ){
              fishes[i].play(true);
          }
        }
        if(fishes[i].pos.x <=0 && p.mouseX <= 0 && fishes[i].pos.y <=0 && p.mouseY <=0)            {
          if(
            (distX < 100) &&
            (distY < 100)
            ){
              fishes[i].play(true);
          }
        }
      }
      for(let i=0; i < 3; i++){
        p.noFill();
        p.strokeWeight(5);
        p.ellipse(p.mouseX, p.mouseY, 2*i, 2* i);
        p.ellipse(p.mouseX, p.mouseY, 3*i, 5* i);
        p.ellipse(p.mouseX, p.mouseY, 2*i, 5* i);
        p.ellipse(p.mouseX, p.mouseY, 4*i, 8* i);
        p.ellipse(p.mouseX, p.mouseY, 8*i, 5* i);
        p.ellipse(p.mouseX, p.mouseY, 2*i, 7* i);
      }
    }

    //Create ripples and manage the ripple array
    function createRipples(n, newArr){
      nRipples = n;
      let oldSize = ripples.length;
      if (n < oldSize && !newArr) {
          ripples.splice(n, Number.MAX_VALUE);
      }else{
      ripples = [];
        for(let i=0; i < n; i++){
          ripples.push(new Ripple(Math.random()*canvas.width,Math.random()*canvas.height));
        }
      }
    }

    //Create the fishes and manage the fishes array
    function createfishes(n) {
        let oldSize = fishes.length;

        if (n < oldSize) {
            fishes.splice(n, Number.MAX_VALUE);
        } else if (n > oldSize) {
            var i, ang, mag, pos, vel, col, headSize;
            for (i = oldSize; i < n; i++) {
                ang = p.TWO_PI * Math.random();
                mag = p.width * Math.random();
                pos = p.createVector(0.5 * p.width + mag * Math.cos(ang), 0.5 * p.height + mag * Math.sin(ang));
                ang = p.TWO_PI * Math.random();
                vel = p.createVector(Math.cos(ang)*maxVel/35, Math.sin(ang));
                col = p.random(colorArr);
                headSize =  15;
                //Add Synth
                let synth = new p5.MonoSynth();
                let note = p.random(notes);
                fishes[i] = new Fish(pos, vel, col, headSize, synth, note);
            }
        }
    }

    /*
     * The AbstractParent class (Fishes are an instance of this Floking class)
     */
    function AbstractParent(pos, vel, col) {
        this.pos = pos;
        this.vel = vel;
        this.force = p.createVector(0, 0);
        this.col = col;
        this.isClose = false;

        // Useful variable used to avoid garbage collection
        this.forceDir = p.createVector(0, 0);
    }

    //Update Coordinates
    AbstractParent.prototype.updateCoordinates = function () {
        var velMagSq, scaleFactor, ang;

        // Increase the velocity depending on the force and add some friction
        this.vel.x = 0.5 * (this.vel.x + this.force.x);
        this.vel.y = 0.5 * (this.vel.y + this.force.y);

        // Make sure that the velocity remains within some reasonable limits
        velMagSq = p.sq(this.vel.x) + p.sq(this.vel.y);

        if (velMagSq > maxVelSq) {
            scaleFactor = Math.sqrt(maxVelSq / velMagSq);
            this.vel.x *= scaleFactor;
            this.vel.y *= scaleFactor;
        } else if (velMagSq < 1) {
            if (velMagSq !== 0) {
                scaleFactor = Math.sqrt(1 / velMagSq);
                this.vel.x *= scaleFactor;
                this.vel.y *= scaleFactor;
            } else {
                ang = p.TWO_PI * Math.random();
                this.vel.x = Math.cos(ang);
                this.vel.y = Math.sin(ang);
            }
        }

        // Update the position
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // Reset the force vector
        this.force.x = 0;
        this.force.y = 0;
    };

    // Evaluate the intereactions
    AbstractParent.prototype.evaluate = function (AbstractParents) {
        var i, f, distanceSq;
        for (i = 0; i < AbstractParents.length; i++) {
            f = AbstractParents[i];
            //Distance in x
            this.forceDir.x = f.pos.x - this.pos.x;
            //Distance in y
            this.forceDir.y = f.pos.y - this.pos.y;
            //Sum squared
            distanceSq = p.sq(this.forceDir.x) + p.sq(this.forceDir.y);
            //repulsion between instances
            this.repulsion(this.forceDir, distanceSq);

            this.align(f.vel, distanceSq);
        }
    };

    //Keep the fishes distant from one another
    AbstractParent.prototype.repulsion = function (forceDir, distSq) {
        if (distSq < repulsionDistSq && distSq !== 0) {
            var distance = Math.sqrt(distSq);
            var forceFactor = -(repulsionDist / distance - 1) / distance;
            this.force.x += forceFactor * forceDir.x;
            this.force.y += forceFactor * forceDir.y;
        }
    };

    //Align the fishes
    AbstractParent.prototype.align = function (forceDir, distSq) {
        if (distSq > repulsionDistSq && distSq < alignDistSq) {
            var distance = Math.sqrt(distSq);
            //Function taken from Flocking tutorial!
            var forceFactor = 0.05 * (1 - Math.cos(p.TWO_PI * (distance - repulsionDist) / (alignDist - repulsionDist))) / distance;
            this.force.x += forceFactor * forceDir.x;
            this.force.y += forceFactor * forceDir.y;
        }
    };
    //
    // Adds a repulsive force to avoid that the AbstractParent leaves the screen
    //
    AbstractParent.prototype.keepClose = function () {
        //Establish force direction with width and pos.
        this.forceDir.x = 0.5 * p.width - this.pos.x;
        this.forceDir.y = 0.5 * p.height - this.pos.y;
        //sq => square. Dist with forces
        var distSq = p.sq(this.forceDir.x) + p.sq(this.forceDir.y);
        //If over the squared limit
        if (distSq > limitSq) {
            //reduce by limit factor
            var forceFactor = 1 / limit;
            this.force.x += forceFactor * this.forceDir.x;
            this.force.y += forceFactor * this.forceDir.y;
        }
    };


    /*
     * The Fish class
     */
    function Fish(pos, vel, col, headSize, synth, note) {
        //call parent constructor
        AbstractParent.apply(this, arguments);
        //Add synth
        this.synth = synth;
        //Fish's note
        this.note = note;
        //init pos and dim variablse
        this.headSize = headSize;
        //Head is at pos
        this.posHead = this.pos.copy();
        //Pos body is in line with head on x and is 0.6*thisHeadsize shifted
        this.posBody = p.createVector(this.posHead.x, this.posHead.y + 0.6 * this.headSize);
        //Dummy for tail movement
        this.posMed = p.createVector(this.posBody.x, this.posBody.y + 1.1 * this.headSize);
        //Pos Tail is in line with head on x and is 2.2*thisHeadsize shifted
        this.posTail = p.createVector(this.posBody.x, this.posBody.y + 2.2 * this.headSize);
        //Dummy for closing movements
        this.posEnd = p.createVector(this.posTail.x, this.posTail.y + 1.2 * this.headSize);
        //Movement angles
        this.angHead = 0;
        this.angBody = 0;
        this.angMed = 0;
        this.angTail = 0;
    }

    //Fish prototype is of "type" AbstractParent;
    Fish.prototype = Object.create(AbstractParent.prototype);

    // Set constructor function.
    Fish.prototype.constructor = Fish;

    //Play the synth, change the color, move the fish if clicked
    Fish.prototype.play = function (move) {
            //Paint the tale of white
            this.paint(playColor);
            //Play the note;
            this.synth.play(this.note);
            let choice = Math.random();
            //If triggered by a click, move the fish around
            if(move){
              if(choice <= 0.25){
                this.pos.x = this.pos.x + Math.random()*180 + 180;
                this.pos.y = this.pos.y + Math.random()*180 + 180;
              } else if(choice <= 0.5){
                this.pos.x = this.pos.x + Math.random()*180 + 180;
                this.pos.y = this.pos.y - Math.random()*180 - 180;
              }
              else if(choice <= 0.75){
                this.pos.x = this.pos.x - Math.random()*180 - 180;
                this.pos.y = this.pos.y + Math.random()*180 + 180;
              }
              else if(choice <= 1){
                this.pos.x = this.pos.x - Math.random()*180 - 180;
                this.pos.y = this.pos.y - Math.random()*180 - 180;
              }
            }
            this.update();
    }

    // Updates the Fish coordinates and shape (Calls updateCoordinates)
    Fish.prototype.update = function () {
        // Update the coordinates
        this.updateCoordinates();

        // Move the head (Change head position)
        this.posHead.x = this.pos.x;
        this.posHead.y = this.pos.y;

        //https://p5js.org/reference/#/p5/atan2
        //As used by many projects, is a good approximation of the body and head movement
        this.angHead = p.atan2(this.vel.y, this.vel.x);

        // Move the body
        this.posBody.x = this.posHead.x - 0.6 * this.headSize * Math.cos(this.angHead);
        this.posBody.y = this.posHead.y - 0.6 * this.headSize * Math.sin(this.angHead);
        this.angBody = p.atan2(this.posBody.y - this.posTail.y, this.posBody.x - this.posTail.x);

        //Dummy For tail movement (Additional body part needed for more smooth movements)
        this.posMed.x = this.posBody.x - 1.1 * this.headSize * Math.cos(this.angBody);
        this.posMed.y = this.posBody.y - 1.1 * this.headSize * Math.sin(this.angBody);
        this.angMed = p.atan2(this.posBody.y - this.posTail.y, this.posMed.x - this.posTail.x);

        this.posTail.x = this.posBody.x - 2.2 * this.headSize * Math.cos(this.angBody);
        this.posTail.y = this.posBody.y - 2.2 * this.headSize * Math.sin(this.angBody);
        this.angTail = p.atan2(this.posTail.y - this.posEnd.y, this.posTail.x - this.posEnd.x);

        this.posEnd.x = this.posTail.x - 1.2 * this.headSize * Math.cos(this.angTail);
        this.posEnd.y = this.posTail.y - 1.2 * this.headSize * Math.sin(this.angTail);
    };

    //paint the fish => calls head, body and tail
    Fish.prototype.paint = function (color) {
        p.noStroke();
        this.head(this.posHead, this.angHead, this.col);
        this.body(this.posBody, this.angBody, this.col);
        this.tail(this.posTail, this.angMed, color);
    };

    //paints the head
    Fish.prototype.head = function (cen, ang, c) {
        p.push();
        p.translate(cen.x, cen.y);
        p.rotate(p.HALF_PI + ang);

        // The head
        p.fill(c);
        p.beginShape();
        p.curveVertex(-0.9, -0.5 * this.headSize);
        p.curveVertex(1 * this.headSize, 0.4 * this.headSize);
        //"Body" of the head
        //p.curveVertex(0.8* this.headSize, -0.4 * this.headSize);
        p.curveVertex(0.5 * this.headSize, 0.5 * this.headSize);
        p.curveVertex(0.3 * this.headSize, 0.4 * this.headSize);
        p.curveVertex(0, 0.3 * this.headSize);
        p.curveVertex(-0.3 * this.headSize, 0.4 * this.headSize);
        p.curveVertex(-0.5 * this.headSize, 0.5 * this.headSize);
        p.curveVertex(-0.8 * this.headSize, -0.4 * this.headSize);
        //Top of the head
        p.curveVertex(-0.6 * this.headSize, -1.1 * this.headSize);
        p.curveVertex(0, -1.5 * this.headSize);
        p.curveVertex(0.6 * this.headSize, -1.1 * this.headSize);
        //Close it all
        p.curveVertex(1 * this.headSize, -0.4 * this.headSize);
        p.curveVertex(0.9 * this.headSize, -0.5 * this.headSize);
        p.endShape();
        p.pop();
    };

    //paints the body
    Fish.prototype.body = function (cen, ang, c) {
        p.push();
        p.translate(cen.x, cen.y);
        p.rotate(p.HALF_PI + ang);

        // The body
        p.fill(c);
        p.beginShape();
        p.curveVertex(0, -0.5 * this.headSize);
        //Bod
        p.curveVertex(0.9 * this.headSize, -0.2 * this.headSize);
        p.curveVertex(1.05 * this.headSize, 0.2 * this.headSize);
        p.curveVertex(1.25 * this.headSize, 0.3 * this.headSize);
        p.curveVertex(1.85 * this.headSize, 0.7 * this.headSize);
        p.curveVertex(2.2 * this.headSize, 1.3 * this.headSize);
        p.curveVertex(2.1 * this.headSize, 1.9 * this.headSize);
        p.curveVertex(1.7 * this.headSize, 2.1 * this.headSize);
        p.curveVertex(1.2 * this.headSize, 2.3 * this.headSize);
        p.curveVertex(0.8 * this.headSize, 2.0 * this.headSize);
        p.curveVertex(0.4 * this.headSize, 2.3 * this.headSize);
        p.curveVertex(0, 2.3 * this.headSize);
        p.curveVertex(-0.4 * this.headSize, 2.3 * this.headSize);
        p.curveVertex(-0.8 * this.headSize, 2.0 * this.headSize);
        p.curveVertex(-1.2 * this.headSize, 2.3 * this.headSize);
        p.curveVertex(-1.7 * this.headSize, 2.1 * this.headSize);
        p.curveVertex(-2.1 * this.headSize, 1.9 * this.headSize);
        p.curveVertex(-2.2 * this.headSize, 1.3 * this.headSize);
        p.curveVertex(-1.85 * this.headSize, 0.7 * this.headSize);
        p.curveVertex(-1.25 * this.headSize, 0.3 * this.headSize);
        p.curveVertex(-1.05 * this.headSize, 0.2 * this.headSize);
        p.curveVertex(-0.9 * this.headSize, -0.2 * this.headSize);
        p.curveVertex(0, -0.5 * this.headSize);
        p.curveVertex(0.9 * this.headSize, -0.2 * this.headSize);
        p.curveVertex(1.05 * this.headSize, 0.2 * this.headSize);
        p.endShape();

        // The white patches
        p.fill("#FCF1DC");
        p.beginShape();
        //Right patch
        p.curveVertex(0.6 * this.headSize, 0.9 * this.headSize);
        p.curveVertex(0.9 * this.headSize, 1.8 * this.headSize);
        p.curveVertex(0.5 * this.headSize, 2.3 * this.headSize);
        p.curveVertex(0.3 * this.headSize, 2.0 * this.headSize);
        p.curveVertex(0.4 * this.headSize, 1.5 * this.headSize);
        p.curveVertex(0.6 * this.headSize, 0.9 * this.headSize);
        p.curveVertex(0.9 * this.headSize, 2.3 * this.headSize);
        p.endShape();
        p.beginShape();
        p.curveVertex(-0.6 * this.headSize, 0.9 * this.headSize);
        p.curveVertex(-0.9 * this.headSize, 1.8 * this.headSize);
        p.curveVertex(-0.5 * this.headSize, 2.3 * this.headSize);
        p.curveVertex(-0.3 * this.headSize, 2.0 * this.headSize);
        p.curveVertex(-0.4 * this.headSize, 1.5 * this.headSize);
        p.curveVertex(-0.6 * this.headSize, 0.9 * this.headSize);
        p.curveVertex(-0.9 * this.headSize, 2.3 * this.headSize);
        p.endShape();
        p.pop();
    };

    //paints the tail
    Fish.prototype.tail = function (cen, ang, c) {
        p.push();
        p.translate(cen.x, cen.y);
        p.rotate(p.HALF_PI + ang);
        p.fill(c);
        p.beginShape();
        p.curveVertex(0, -0.5 * this.headSize);
        p.curveVertex(0.2 * this.headSize, -0.5 * this.headSize);
        p.curveVertex(0.3 * this.headSize, 0.1 * this.headSize);
        p.curveVertex(1.6 * this.headSize, 1 * this.headSize);
        p.curveVertex(1.9 * this.headSize, 1 * this.headSize);
        p.curveVertex(1.2 * this.headSize, 1.7 * this.headSize);
        p.curveVertex(0.3 * this.headSize, 1.7 * this.headSize);
        p.curveVertex(0.0 * this.headSize, 1.55 * this.headSize);
        p.curveVertex(0, 1.5 * this.headSize);
        p.curveVertex(-0.0 * this.headSize, 1.55 * this.headSize);
        p.curveVertex(-0.3 * this.headSize, 1.7 * this.headSize);
        p.curveVertex(-1.2 * this.headSize, 1.7 * this.headSize);
        p.curveVertex(-1.6 * this.headSize, 1 * this.headSize);
        p.curveVertex(-1.3 * this.headSize, 1 * this.headSize);
        p.curveVertex(-0.3 * this.headSize, 0.1 * this.headSize);
        p.curveVertex(-0.25 * this.headSize, -0.5 * this.headSize);
        p.curveVertex(0, -0.5 * this.headSize);
        p.curveVertex(0.25 * this.headSize, -0.2 * this.headSize);
        p.curveVertex(0.3 * this.headSize, 0.6 * this.headSize);
        p.endShape();
        p.pop();
    };

    /*
    * Ripple Class
    */
    function Ripple(x,y){
      this.x = x;
      this.y = y;
      this.i = 0;
      this.max = Math.random()*p.windowWidth/30 + 7;
      this.step = this.max/1000;
      this.period = Math.random()*this.max/1000 + 10;
      this.dir = true;
    }
    //paint the shadows
    Ripple.prototype.paintShadows = function(){
      if(this.dir){
        this.i = (this.i + this.step)%this.period;
        console.log(this.i);
        if(this.i >= this.period-1){
          this.dir = false;
        }
      }
      else{
        this.i = (this.i - this.step);
        console.log(this.i);
        if(this.i <= 0){
          this.dir = true;
        }
      }
      p.stroke(50,50,50,20);
      let offset = 20/((this.i+1)*2);
      p.noFill();
      p.strokeWeight(0.8);
      p.circle(this.x + offset, this.y + offset, this.i*(this.max*6/8));
      p.circle(this.x + offset, this.y + offset, this.i*(this.max*3/7));
      p.circle(this.x + offset, this.y + offset, this.i*(this.max*3/8));
      p.circle(this.x + offset, this.y + offset, this.i*(this.max*3/4));
      p.circle(this.x + offset, this.y + offset, this.i*(this.max*7/8));
      p.circle(this.x + offset, this.y + offset, this.i*(this.max*2/6));
      p.circle(this.x + offset, this.y + offset, this.i*(this.max*14/16));
      p.circle(this.x + offset, this.y + offset, this.i*this.max);
    }
    //paint the Ripple
    Ripple.prototype.paint = function(){
      //FCF1DC
      p.stroke(252,241,220, 90);
      p.noFill();
      p.strokeWeight(0.8);
      p.circle(this.x, this.y, this.i*(this.max*6/8));
      p.circle(this.x, this.y, this.i*(this.max*3/7));
      p.circle(this.x, this.y, this.i*(this.max*3/8));
      p.circle(this.x, this.y, this.i*(this.max*3/4));
      p.circle(this.x, this.y, this.i*(this.max*7/8));
      p.circle(this.x, this.y, this.i*(this.max*2/6));
      p.circle(this.x, this.y, this.i*(this.max*14/16));
      p.circle(this.x, this.y, this.i*this.max);
    }
    //Evaluate if fishes are in the area
    Ripple.prototype.evaluate = function(){
      let distX, distY;
      console.log('Current Amplitude ' + this.i*this.max/2)
      for(let j=0; j < fishes.length; j++){
        distX = Math.abs((Math.abs(fishes[j].posBody.x) - Math.abs(this.x)));
        distY = Math.abs((Math.abs(fishes[j].posBody.y) - Math.abs(this.y)));
        if(
          fishes[j].posBody.x >= 0 && this.x >=0 &&
          fishes[j].posBody.y >= 0 && this.y >=0
        ){
        if(
            (distX < (this.i*this.max/2 + 20)) &&
            (distY < (this.i*this.max/2 + 20))
            ){
              fishes[j].play(false);
          }
        }
        else if(
          fishes[j].posBody.x >= 0 && this.x >=0 &&
          fishes[j].posBody.y <= 0 && this.y <=0
        ){
          if(
              (distX < (this.i*this.max/2 + 20)) &&
              (distY < (this.i*this.max/2 + 20))
              ){
                fishes[j].play(false);
            }
        }
        else if(
          fishes[j].posBody.x <= 0 && this.x <=0 &&
          fishes[j].posBody.y >= 0 && this.y >=0
        ){
          if(
              (distX < (this.i*this.max/2 + 20)) &&
              (distY < (this.i*this.max/2 + 20))
              ){
                fishes[j].play(false);
            }
        }
        else if(
          fishes[j].posBody.x <= 0 && this.x <=0 &&
          fishes[j].posBody.y <= 0 && this.y <=0
        ){
          if(
              (distX < (this.i*this.max/2 + 20)) &&
              (distY < (this.i*this.max/2 + 20))
              ){
                fishes[j].play(false);
            }
        }
      }
    }
};

var myp5 = new p5(sketch, sketchContainer);
