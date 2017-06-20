var ucpu = require('./ucpu.js');
var Assembler = require('./Assembler.js');
var cpu1;

var canvas;
var ctx;

var canvas2;
var ctx2;

var sTime;
var pTime;
var dTime;
var tTime;

window.init = function init() {
	canvas = document.getElementById("aCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx = canvas.getContext('2d');


	canvas2 = document.getElementById("cpuWindow");
	canvas2.width = 16;
	canvas2.height = 8;
	ctx2 = canvas2.getContext('2d');

	cpu1 = new ucpu();
	/*
	cpu1.load([
		0b00000001,
		0b10101010,
		0b01010101,
		0b00001111,
	])
	*/
	cpu1.load(Assembler([
		"SET [0xc0] 85", // 0, 1, 2
		"SET [0xc1] 155", // 3, 4, 5
		"SET [0xc2] 170", // 6, 7, 8
		"SET [0xc3] 35", // 9
		"SET [0xc4] 87", // 12
		"SET [0xc5] 155", // 15
		"SET [0xc6] 170", // 18
		"SET [0xc7] 34", // 21
		"SET [0xc8] 5", // 24
		"SET [0xc9] 11", // 27
		"SET [0xca] 10", // 30
		"SET [0xcb] 3", // 33
		"SET [0xcc] 0", // 36
		"SET [0xcd] 0", // 39
		"SET [0xce] 0", // 42
		"SET [0xcf] 0", // 45, 46, 47
		
		"INV [0xc0]",
		"INV [0xc1]",
		"INV [0xc2]",
		"INV [0xc3]",
		"INV [0xc4]",
		"INV [0xc5]",
		"INV [0xc6]",
		"INV [0xc7]",
		"INV [0xc8]",
		"INV [0xc9]",
		"INV [0xca]",
		"INV [0xcb]",
		"INV [0xcc]",
		"INV [0xcd]",
		"INV [0xce]",
		"INV [0xcf]",
		
		"JMP 0x30",
	].join("\n")))

	setInterval(main, 100);
	pTime = new Date().getTime();
	render();
}

function main() {
	sTime = new Date().getTime();
	dTime = sTime - pTime;
	tTime += dTime;
	logic();
	render();
	pTime = sTime;
}

function logic() {
	// A solid 1kHz
	//var bTime = performance.now();
	for(var i = 0; i < dTime; i++) {
		cpu1.step();
	}
	//console.log(Math.floor((performance.now() - bTime) * 100) / 100 + "ms");
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "12px Courier New"

	ctx.save();
	for(var i = 0; i < cpu1.RAM.length; i++) {
		var xPos = i % 16;
		var yPos = (i - xPos) / 16;
		if(i === cpu1.registers.PC) {
			ctx.fillStyle = "red";
			ctx.fillRect(20 + 60 * yPos, 20 + 20 * xPos, 60, 20);
		} else {
			//ctx.fillStyle = "black";
		}
		ctx.strokeRect(20 + 60 * yPos, 20 + 20 * xPos, 60, 20);
		ctx.fillStyle = "black";
		ctx.fillText("0x"+byteToHex(i) + " " + byteToHex(cpu1.RAM[i]), 20 + 60 * yPos + 30, 20 + 20 * xPos + 10);
	}
	ctx.restore();
	ctx.strokeRect(20, 20 + 20 * 16 + 20, 60, 20);
	ctx.fillText("PC 0x"+ byteToHex(cpu1.registers.PC), 20 + 30, 20 + 20 * 16 + 10 + 20);
	ctx.strokeRect(20, 20 + 20 * 17 + 20, 60, 20);
	ctx.fillText("A "+ byteToHex(cpu1.registers.A), 20 + 30, 20 + 20 * 17 + 10 + 20);

	ctx.strokeRect(0, 0, canvas.width, canvas.height);


	var RAMStart = 0xc0;
	for(var i = 0; i < 4 * 4; i++) {
		var xPos = i % 4;
		var yPos = (i - xPos) / 4;
		ctx2.save();
		var ramVal = cpu1.RAM[RAMStart + i];
		for(var j = 0; j < 8; j++) {
			if((ramVal & (0b1 << j)) >> j == 1) {
				ctx2.fillStyle = "rgba(0, 127, 0, 1)";
			} else {
				ctx2.fillStyle = "rgba(0, 32, 0, 1)";
			}
			var xPos2 = j % 4;
			var yPos2 = (j - xPos2) / 4;
			ctx2.fillRect(xPos * 4 + xPos2 * 1, yPos * 2 + yPos2 * 1, 1, 1);
		}
		ctx2.restore();
	}
}

function byteToHex(byte) {
	var hex = ("00" + byte.toString(16)).slice(-2);
	return hex;
}
