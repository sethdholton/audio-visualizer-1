

let sound;
let fft;
let mic;
let startAudio = false;

let inputMic = false;

let toggleFS = false;

let particles = [];

function preload() {
    // sound = loadSound('/assets/i-81-car-pileup.mp3');
    // sound = loadSound('/assets/demoserenade.mp3');
    sound = loadSound('/assets/smooveguitar.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    sound.amp(.8);
    colorMode(HSB);
    textFont("Courier New");
    background(0);
}

function draw() {
    background(0);
    let bass, lowMid, mid, highMid, treble;

    if (startAudio) {
      
      bass = fft.getEnergy("bass");
      lowMid = fft.getEnergy("lowMid");
      mid = fft.getEnergy("mid");
      highMid = fft.getEnergy("highMid");
      treble = fft.getEnergy("treble");

      let avg = (bass + lowMid + mid + highMid + treble) / 5;
      let turnspeed = map(avg, 0, 255, .0000000000000001,.000005);

      console.log(avg);
      
      if (avg > 160) {
        particles.push(new Particle());
      }

      for(let i = 0; i < particles.length; i++) {
        particles[i].display();
        if (particles[i].x > width ||
            particles[i].y > height) {
              particles.splice(i, 1);
            }
      }

      let spectrum = fft.analyze();
      let len = Math.floor(spectrum.length / 5);
      let h;
      for (let i = 0; i < len; i++) {
          h = map(spectrum[i], 0, 255, 0, height);
          push();
            translate(width/2, height/2);
            let r = map(i, 0, len, 0, TWO_PI);
            rotate(r-(millis()*turnspeed));
            let thick = h * 0.005;
            fill(150);
            triangle(-5, height-(h*1.05), 0, height, 0 + thick, height);
            fill(125);
            triangle(0, height - (h*1.), 0, height, 10 + thick, height);
            fill(100);
            triangle(0, height - (h*0.95), 0, height, 15 + thick, height);
            fill(75);
            triangle(0, height - (h*0.9), 0, height, 20 + thick, height);
            fill(0);
            triangle(0, height - (h*0.85), 0, height, 25 + thick, height);
          pop();
      }
      for ( let i = 0; i < len; i++) {
        h = map(spectrum[i], 0, 255, 0, height);
        push();
          translate(width/2, height/2.05);
          rotate(millis()/25000);
          push();
            let r = map(i, 0, len, 0, TWO_PI);
            rotate(r+(millis()/15000));
            fill(420-h*0.5, h*0.5, 255);
            noStroke();
            ellipse(0, (h*0.095)+height/10, (h*50)/width, h*0.33);
          pop();
        pop();
      }
      
      let waveform = fft.waveform();
      let wlen = waveform.length;
      let prevY1 = 0;

      for (let i = 0; i < wlen; i++) {
        let y = map(waveform[i], 1, -1, 0, height/20);
        push();
          translate(width/2, height/2);
          let r = map(i, 0, wlen, 0, TWO_PI);
          rotate(r+millis()/20000);
          stroke(255);
          strokeWeight(1);
          line(0, y, 0, 0);
        pop();
      }
    }

    if (stopped) {
      fill(100, 255, 255);
      textAlign(CENTER, CENTER);
      textSize(width/20);
      text("PRESS 'SPACE' TO START", width/2, height/2);
    } //else {
    //   textAlign(LEFT, CENTER);
    //   textSize(width/100);
    //   text("Click to Toggle", width * 0.025, height * 0.9);
    //   if (inputMic) {
    //     text("Input: Mic", width * 0.025, height * 0.95);
    //   } else {
    //     text("Input: Music", width * 0.025, height * 0.95);
    //   }
    // }
}

let stopped = true;

function keyPressed() {
  // background(0);
  if (keyCode == 32) {
  getAudioContext().resume();

  if (!startAudio) {
    mic = new p5.AudioIn();
    fft = new p5.FFT();
    mic.start();
    startAudio = true;
  }

    if (stopped) {
        loop();
        // background(0);
        if (!inputMic) {
          sound.loop();
        }
        stopped = false;
    } else {
        noLoop();
        // background(0);
        if (!inputMic) {
          sound.stop();
        }
        stopped = true;
    }
  }
  if (keyCode == 70) {
    if (!toggleFS) {
      fullscreen(true);
      toggleFS = true;
    } else {
      fullscreen(false);
      toggleFS = false;
    }
  }
}

function mousePressed() {
  // background(0);
  if (!stopped) {
    if (inputMic) {
      fft.setInput(sound);
      inputMic = false;
      sound.loop();
    } else {
      fft.setInput(mic);
      inputMic = true;
      sound.stop();
    }
  }
}

class Particle 
{
  constructor() {
    this.r = random(0, TWO_PI);
    this.x = 0;
    this.y = 0;
    this.xspeed = random(0, width/100);
    this.yspeed = random(0, height/20);
    this.radius = random(0, width/80);
    this.brightness = 255;
    // this.color = random(0, 255);
    this.direction = random(-1, 1);
  }

  display() {
    push();
      translate(width/2, height/2);
      rotate(this.r);
      this.xspeed += (4*this.direction);
      this.x += this.xspeed;
      this.y += this.yspeed;
      if (this.brightness >= 0) {
        this.brightness -= 5;
      }
      fill(this.brightness);
      if (this.radius >= 1) {
        this.radius--;
      }
      circle(this.x, this.y, this.radius);
    pop();
  }
}