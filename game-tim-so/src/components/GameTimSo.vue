<template>
    <div>
        <div class="pyro" style="display: none;" id="fireworks">
            <div class="before"></div>
            <div class="after"></div>
        </div>
        <div class="container">
            <div class="heading">
                <h1 class="title" style="cursor:pointer" @click="changeNav">&#9776; Number</h1>
                <div class="scores-container">
                    <div class="score-container" id="vn_number" style="min-width: 40px;"> - </div>
                    <div class="best-container" id="vn_timer">00:00:00</div>
                </div>
            </div>
            <div class="above-game">
                <a class="restart-button" @click="startCounting">New Game</a>
                <!-- <a class="restart-button" @click="stopCounting">Stop</a> -->
            </div>
        </div>
        <div id="mySidenav" class="sidenav">
            <a href="javascript:void(0)" class="closebtn" @click="closeNav">&times;</a>
            <p>Number to Find</p>
            <input type="number" name="numberLength" id="vn_numberLength" v-model="numbLength">
            <p>Zoom</p>
            <input type="number" name="zoomBoard" id="zoomBoard" v-model="zoomBoard">
            <p>R</p>
            <input type="number" name="cR" id="cR" v-model="cR">
            <p>Font-size</p>
            <input type="number" name="font-size" id="font-size" v-model="font_size">
            <p>Delta top</p>
            <input type="number" name="delta_top" id="delta_top" v-model="delta_top">
            <a class="restart-button" style="margin: 10%;" @click="startCounting">New Game</a>
        </div>
        <div class="game-message game-over" style="display: none;" id="game-over">
            <p id="final_timer">00:00:11</p>
            <p>Finish!</p>
            <div class="lower"><a class="keep-playing-button">Keep going</a>
                <a class="retry-button" @click="startCounting">Play again</a>
            </div>
        </div>
        <div id="gameZone">
        </div>
        <canvas id="myCanvas"></canvas>
    </div>
</template>

<script>
import { cPen } from '../plugin/func.js';

// let zoomBoard = 40;
// let numbLength = 55;
// let cR = 40;
// let font_size = 40;
// let delta_top = 40;
let isShowSidenav = false;
const canvas = document.getElementById("myCanvas");
let numberArray = [];
let x = null;
let start = new Date().getTime();

export default {
    name: 'GameTimSo',
    data() {
        return {
            msg: 'Welcome to GameTimSo',
            numbLength: 11,
            font_size: 22,
            zoomBoard: 33,
            delta_top: 55,
            cR: 44
        }
    },
    mounted: function (params) {
        this.initBoard();
    },
    methods: {
        openNav: function () {
            isShowSidenav = true;
            document.getElementById("mySidenav").style.width = "250px";
        },

        closeNav: function () {
            isShowSidenav = false;
            document.getElementById("mySidenav").style.width = "0";
        },

        changeNav: function () {
            isShowSidenav = !isShowSidenav;
            if (isShowSidenav) {
                document.getElementById("mySidenav").style.width = "250px";
            } else {
                document.getElementById("mySidenav").style.width = "0";
            }
        },

        closeFinish: function () {
            document.getElementById("game-over").style.display = "none";
            document.getElementById("fireworks").style.display = "none";
        },

        initBoard: function () {
            if (localStorage.getItem("zoomBoard") === null) {
                console.log(">>>no zoomBoard");
            } else {
                this.zoomBoard = localStorage.getItem("zoomBoard");
            }

            if (localStorage.getItem("numbLength") === null) {
                console.log(">>>no vn_numberLength");
            } else {
                this.numbLength = localStorage.getItem("numbLength");
            }

            if (localStorage.getItem("cR") === null) {
                console.log(">>>no cR");
            } else {
                this.cR = localStorage.getItem("cR");
            }

            if (localStorage.getItem("font-size") === null) {
                console.log(">>>font-size");
            } else {
                this.font_size = localStorage.getItem("font-size");
            }

            if (localStorage.getItem("delta_top") === null) {
                console.log(">>>delta_top");
            } else {
                this.delta_top = localStorage.getItem("delta_top");
            }
        },

        gameTimer: function () {
            // Get today's date and time
            let addTime = 0; // 3595;

            // Find the distance between now and the count down date
            let distance = addTime + ((Date.now() - start) / 1000) | 0;

            let hours = (distance / 3600) | 0;
            let minutes = ((distance / 60) | 0) - (hours * 60);
            let seconds = (distance % 60) | 0;

            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            // Display the result in the element with id="demo"
            document.getElementById("vn_timer").innerHTML = `${hours}:${minutes}:${seconds}`;

            if (hours >= 1) {
                clearInterval(x);
            }
        },

        startCounting: function () {
            start = new Date().getTime();
            document.getElementById("vn_timer").innerHTML = `00:00:00`;
            document.getElementById("vn_number").innerHTML = '';
            this.gameInitiation();
            this.closeNav();
            this.closeFinish();
            localStorage.setItem("numbLength", parseInt(this.numbLength));
            localStorage.setItem("zoomBoard", parseInt(this.zoomBoard));
            localStorage.setItem("cR", parseInt(this.cR));
            localStorage.setItem("delta_top", parseInt(this.delta_top));
            localStorage.setItem("font-size", this.font_size);

            if (x) {
                clearInterval(x);
            }
            x = setInterval(this.gameTimer, 1000);
        },

        stopCounting: function () {
            document.getElementById("vn_timer").innerHTML = `00:00:00`;
            document.getElementById("gameZone").innerHTML = '';
            document.getElementById("vn_number").innerHTML = '';
            clearInterval(x);
        },

        gameInitiation: function () {
            let canvas = document.getElementById("myCanvas");
            canvas.width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 20;
            canvas.height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 200; //bottom
            const ctx = canvas.getContext("2d");
            let lookNumber = 1;
            let cR = parseInt(this.cR);
            let zoomBoard = this.zoomBoard;
            let numbLength = this.numbLength;
            let delta_top = this.delta_top;

            ctx.beginPath();

            let centerx = canvas.width / 2;
            let centery = canvas.height / 2;
            let j = 0, i = 0, k = 0;

            let finalNumber = cPen.calculateFinalNumber(numbLength, canvas.width, canvas.height, centerx, centery, zoomBoard, cR);
            this.numbLength = finalNumber;
            numbLength = parseInt(this.numbLength);
            numberArray = cPen.initNumberArray(numbLength);
            document.getElementById("gameZone").innerHTML = '';
            document.getElementById("vn_number").innerHTML = '1';
            for (let j = 0, i = j + 1; j < numbLength || k < numbLength; j++, i = j + 1) {
                let c = cPen.randCircle(i, canvas.width, canvas.height, centerx, centery, numberArray[k], zoomBoard, cR);
                if (c != null) {
                    let node = document.createElement("div");
                    let textnode = document.createTextNode(c.value);
                    node.appendChild(textnode);
                    node.classList.add('numberCircle');
                    // node.setAttribute('background-color', c.color);
                    node.style.backgroundColor = c.backgroundColor;
                    node.style.top = (c.rY + parseInt(delta_top)) + 'px';
                    node.style.right = c.rX + 'px';
                    node.style.width = c.R + 'px';
                    node.style.height = c.R + 'px';
                    node.style.lineHeight = c.R + 'px';
                    node.style.fontSize = this.font_size + "px";
                    node.style.color = c.color;

                    node.addEventListener('click', function (event) {
                        // do something
                        var node = document.getElementById('vn_number');

                        if (this.innerHTML == `${lookNumber}`) {
                            // this.classList.add('selected');
                            this.classList.add('hidden');
                            lookNumber++;
                            node.innerHTML = lookNumber;
                            // If the count down is finished, write some text
                            if (lookNumber > numbLength) {
                                clearInterval(x);
                                node.innerHTML = ' - ';
                                document.getElementById("fireworks").style.display = "flex";
                                document.getElementById("game-over").style.display = "flex";
                                document.getElementById("final_timer").innerHTML = document.getElementById("vn_timer").innerHTML;
                            }
                        }

                    });
                    document.getElementById("gameZone").appendChild(node);
                    // mapNumberBall.put(c.getValue(), c);
                    // drawCircle(ctx, c)
                    k++;
                }
            }
        }
    }
}
</script>

<style>
@import '../assets/styles/index.css';
@import '../assets/styles/firework.css';
</style>