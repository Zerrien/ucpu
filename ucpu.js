class ucpu {
	constructor() {
		this.RAM = [];
		for(var i = 0; i <= 0b11111111; i++) {
			//this.RAM.push(Math.floor(Math.random() * 256));
			this.RAM.push(0);
		}
		this.registers = {
			PC: 0,
			A: 0b1111
		}
		this.skipOp = false;
	}
	resolveCode(code) {
		var a = (code & 0b10) >> 1;
		var b = (code & 0b1);
		if(a === 1) {
			if(b === 0) {
				// Direct ref to A
				return {
					l: this.registers,
					t: "A"
				};
			} else {
				// Reference to A's value
				return {
					l: this.RAM,
					t: this.registers.A
				}
			}
		} else {
			++this.registers.PC;
			if(b == 0) {
				// Direct ref to next 2 bytes
				return {
					l: this.RAM,
					t: this.registers.PC
				};
			} else {
				// Reference of next 2 byte's value
				var value = this.RAM[this.registers.PC];
				return {
					l: this.RAM,
					t: value
				};
			}
		}
	}
	step() {
		var instruction = this.RAM[this.registers.PC];
		var opCode = (instruction & 0b00001111);
		var xCode = (instruction & 0b11000000) >> 6;
		var yCode = (instruction & 0b00110000) >> 4;
		switch(opCode) {
			case 0b0000: // NON
				// End.
				break;
			case 0b0001: // SET
				var a = this.resolveCode(xCode);
				var b = this.resolveCode(yCode);
				if(!this.skipOp) {
					a.l[a.t] = b.l[b.t];
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b0010: // ADD
				var a = this.resolveCode(xCode);
				var b = this.resolveCode(yCode);
				if(!this.skipOp) {
					a.l[a.t] = (a.l[a.t] + b.l[b.t]) % 256;
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b0011: // SUB
				if(!this.skipOp) {
					if(a.l[a.t] - b.l[b.t] < 0) {
						a.l[a.t] = 0xff - (b.l[b.t] - a.l[a.t]) % 256;
					} else {
						a.l[a.t] = (a.l[a.t] - b.l[b.t]) % 256;
					}
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b0100: // ???
				// ???
				break;
			case 0b0101: // MUL
				var a = this.resolveCode(xCode);
				var b = this.resolveCode(yCode);
				if(!this.skipOp) {
					a.l[a.t] = (a.l[a.t] * b.l[b.t]) % 256;
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b0110: // DIV
				var a = this.resolveCode(xCode);
				var b = this.resolveCode(yCode);
				if(!this.skipOp) {
					a.l[a.t] = Math.floor(a.l[a.t] / b.l[b.t]) % 256;
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b0111: // MOD
				var a = this.resolveCode(xCode);
				var b = this.resolveCode(yCode);
				if(!this.skipOp) {
					a.l[a.t] = (a.l[a.t] % b.l[b.t]) % 256;
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b1000: // AND
				var a = this.resolveCode(xCode);
				var b = this.resolveCode(yCode);
				if(!this.skipOp) {
					a.l[a.t] = (a.l[a.t] & b.l[b.t]) % 256;
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b1001: // OOR
				var a = this.resolveCode(xCode);
				var b = this.resolveCode(yCode);
				if(!this.skipOp) {
					a.l[a.t] = (a.l[a.t] || b.l[b.t]) % 256;
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b1010: // IFE
				var a = this.resolveCode(xCode);
				var b = this.resolveCode(yCode);
				if(!this.skipOp) {
					if(a.l[a.t] !== b.l[b.t]) {
						this.skipOp = true;
					}	
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b1011: // IFN
				var a = this.resolveCode(xCode);
				var b = this.resolveCode(yCode);
				if(!this.skipOp) {
					if(a.l[a.t] === b.l[b.t]) {
						this.skipOp = true;
					}	
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b1100: // IFG
				var a = this.resolveCode(xCode);
				var b = this.resolveCode(yCode);
				if(!this.skipOp) {
					if(a.l[a.t] >= b.l[b.t]) {
						this.skipOp = true;
					}	
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b1101: // IFL
				var a = this.resolveCode(xCode);
				var b = this.resolveCode(yCode);
				if(!this.skipOp) {
					if(a.l[a.t] <= b.l[b.t]) {
						this.skipOp = true;
					}	
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b1110: // INV
				var a = this.resolveCode(xCode);
				if(!this.skipOp) {
					a.l[a.t] = ~(a.l[a.t]) & 0b11111111;
				} else {
					this.skipOp = false;
				}
				++this.registers.PC;
				break;
			case 0b1111: // JMP
				var a = this.resolveCode(xCode);
				if(!this.skipOp) {
					this.registers.PC = a.l[a.t];
				} else {
					this.skipOp = false;
					++this.registers.PC;
				}
				break;
		}
		//console.log(intToPaddedByte(opCode), opCode);


		/*
		if(++this.registers.PC == this.RAM.length) {
			this.registers.PC = 0;
		}
		*/
	}
	load(array) {
		var sLen = array.length;
		for(var i = 0; i <= 0b11111111 - sLen; i++) {
			//this.RAM.push(Math.floor(Math.random() * 256));
			array.push(0);
		}
		this.RAM = array;
	}
}
module.exports = ucpu;


function byteToHex(byte) {
	var hex = ("00" + byte.toString(16)).slice(-2);
	return hex;
}

function intToPaddedByte(int) {
	var paddedByte = ("00000000" + int.toString(2)).slice(-8);
	return paddedByte;
}
