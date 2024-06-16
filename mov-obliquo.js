const div_ball = document.querySelector('.ball');
const height_mark = document.querySelector('.max-height');
const range_mark = document.querySelector('.max-range');
const select = document.querySelector('#planets');
const settings = document.querySelector('.settings');
const btn_close = document.querySelector('.btn-close');
const btn_run = document.querySelector('.run');

const pfull_y = document.querySelector('.container').clientHeight;
const ptrajectory_y = (pfull_y - 40);
const mtrajectory_y = 100;
const p_m = (ptrajectory_y / mtrajectory_y);
const planets = {
    sun: 274.13,
    mercury: 3.7,
    venus: 8.87,
    earth: 9.807,
    moon: 1.622,
    mars: 3.711,
    jupiter: 24.79,
    saturn: 10.44,
    uranus: 8.69,
    neptune: 11.15,
    pluto: 0.62
}

const interval_frame = 20;
const fps = (1000 / interval_frame);

const a_range = document.querySelector('#a-range');
const v_range = document.querySelector('#v-range');

const a_output = document.querySelector('#a-output');
const v_output = document.querySelector('#v-output');
const g_output = document.querySelector('#g-output');
const vx_output = document.querySelector('#vx-output');
const vy_output = document.querySelector('#vy-output');
const dx_output = document.querySelector('#dx-output');
const dy_output = document.querySelector('#dy-output');
a_output.innerHTML = a_range.value;
v_output.innerHTML = v_range.value;
g_output.innerHTML = planets[select.value]

class Ball {
    constructor (ball, g, V, theta) {
        this.ball = ball;
        this.Acp = this.convertToPixel(g);
        this.Vp = this.convertToPixel(V);
        this.theta = this.convertToRad(theta);

        this.Vpx = (this.Vp * Math.cos(this.theta));
        this.Vpy = (this.Vp * Math.sin(this.theta));

        this.fVpx = (this.Vpx / fps);
        this.fVpy = (this.Vpy / fps);
        this.fAcp = -(this.Acp / fps);

        vx_output.innerHTML = this.convertToMeter(this.Vpx).toFixed(2);
        this.printSettings();
    }

    printSettings () {
        // console.log(`Ball: ${this.ball}`);
        // console.log(`Acp (p/s): ${this.Acp}`);
        // console.log(`Vp (p/s): ${this.Vp}`);
        // console.log(`theta (rad): ${this.theta}`);
        // console.log(`Vpx (p/s): ${this.Vpx}`);
        // console.log(`Vpy (p/s): ${this.Vpy}`);
        // console.log(`fVpx: ${this.fVpx}`);
        // console.log(`fVpy: ${this.fVpy}`);
        // console.log(`fAcp: ${this.fAcp}`);
        // console.log(`Max range: ${this.maxRange()}`);
        // console.log(`Max height: ${this.maxHeight()}`);

        vy_output.innerHTML = this.convertToMeter(this.Vpy).toFixed(2);
        dx_output.innerHTML = this.convertToMeter(this.getX()).toFixed(2);
        dy_output.innerHTML = this.convertToMeter(this.getY()).toFixed(2);
    }
    
    animate (temp) {
        if ((this.moveY() > 10) || (this.moveX() < this.maxRange())) {
            this.setX(this.moveX());
            this.setY(this.moveY());
            this.updateVpy();
            this.printSettings();
        } else {
            this.setX(this.moveX());
            this.setY(this.moveY());
            this.printSettings();
            running = !running;
            toggleRun();
            clearInterval(temp);
        }
    }

    convertToRad (a) { return (Math.PI * a) / 180; }

    getY () { return parseFloat(this.ball.style.bottom.split('px')[0]); }
    setY (y) { this.ball.style.bottom = `${y}px`; }
    
    getX () { return parseFloat(this.ball.style.left.split('px')[0]); }
    setX (x) { this.ball.style.left = `${x}px`; }
    
    moveY () { return (this.getY() + this.fVpy); }
    moveX () { return (this.getX() + this.fVpx); }

    updateVpy () {
        this.Vpy += this.fAcp;
        this.fVpy = (this.Vpy / fps);
    }

    maxHeight () {
        // H = (V² * sin²(theta)) / 2 * Acp
        return ((this.Vp ** 2) * (Math.sin(this.theta) ** 2)) / (2 * this.Acp);
    }

    maxRange () {
        // A = (Vp² / Acp) * sin(2 * theta)
        return ((this.Vp ** 2) / this.Acp) * (Math.sin(2 * this.theta));
    }

    convertToPixel (m) {
        return (p_m * m);
    }

    convertToMeter (px) {
        return (px / p_m);
    }
}

function resetPositions () {
    div_ball.style.bottom = '0px'; div_ball.style.left = '0px';
    height_mark.style.bottom = '0px'; range_mark.style.left = '0px';
}

function setMark (range, height) {
    height_mark.style.bottom = `${height + 40}px`;
    range_mark.style.left = `${range + 40}px`;
}

function selectPlanet (planet) {
    g_output.innerHTML = planets[planet.value];
}

function toggleSettings () {
    settings.classList.toggle('active');
    btn_close.classList.toggle('active');
}

function toggleRun () {
    btn_run.classList.toggle('active');
}

let running = false;
function run () {
    resetPositions();
    running = !running;
    if (running) toggleSettings();
    toggleRun();

    const ball = new Ball(div_ball, planets[select.value], v_range.value, a_range.value);
    setMark(ball.maxRange(), ball.maxHeight());

    const temp = setInterval(() => {
        running ? ball.animate(temp) : clearInterval(temp);
    }, interval_frame);
}

a_range.oninput = function () {
    a_output.innerHTML = this.value;
}

v_range.oninput = function () {
    v_output.innerHTML = this.value;
}