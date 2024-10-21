let sound;
let fft;
let mic;

function preload() {
    //sound = loadSound('/assets/doctor.mp3');
    //sound = loadSound('/assets/ageoflove.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT(.8, 64);
    fft.setInput(mic);
    //sound.amp(.8);


}

function draw() {
    background(0);

    let spectrum = fft.analyze();


    let len = Math.floor(spectrum.length * 2 / 3);


    for (let i = 0; i < len; i++) {
        let x = map(i, 0, len, 0, width);
        let h = map(spectrum[i], 0, 255, 0, height);
        let w = width / len;
        fill(255);
        noStroke();
        rect(x, 0, w, h)
        console.log(h);
    }

    let waveform = fft.waveform();

    for (let i = 0; i < waveform.length; i++) {
        let x = map(i, 0, waveform.length - 1, 0, width);
        let y = map(waveform[i], -1, 1, 0, height);

        circle(x, y, 2);
    }

    // rectMode(CENTER);
    // let treble = fft.getEnergy("treble");
    // fill(255, 0, 0);
    // square(width / 2, height / 2, treble * 6);

    // let mid = fft.getEnergy("mid");
    // fill(0, 255, 0, 50);
    // noFill();
    // stroke(255);
    // strokeWeight(10);
    // square(width / 2, height / 2, mid * 6);

    //     let bass = fft.getEnergy("treble");
    //     fill(0, 0, 255, 200);
    //     noStroke();
    //     circle(mouseX, mouseY, bass * 2);
}

function mousePressed() {
    // if (sound.isPlaying()) {
    //     sound.pause();
    // } else {
    //     sound.loop();
    //     sound.jump(60);
    // }
}

let stopped = false;

function keyPressed() {
    if (stopped) {
        loop();
        stopped = false;
    } else {
        noLoop();
        stopped = true;
    }
}