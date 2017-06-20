module.exports = function Assembler(assemblyString) {
	var lines = assemblyString.split("\n");
	var RAMResult = [];
	for(var i = 0; i < lines.length; i++) {
		var line = lines[i];
		var result = 0;
		var pieces = line.split(" ");
		result |= opCodeMap[pieces[0]]

		var x = null;
		var xRef = false;
		if(/\[(.*)\]/.test(pieces[1])) {
			x = /\[(.*)\]/.exec(pieces[1])[1]
			xRef = true;
		} else {
			x = pieces[1]
		}

		var y = null;
		var yRef = false;
		if(/\[(.*)\]/.test(pieces[2])) {
			y = /\[(.*)\]/.exec(pieces[2])[1]
			yRef = true;
		} else {
			y = pieces[2]
		}
		
		var xPush = null;
		var xVal = 0;
		if(x === "A") {
			xVal |= 0b10;
		} else {
			xPush = x;
		}
		if(xRef) {
			xVal |= 0b1;
		}
		var yPush = null;
		var yVal = 0;
		if(y) {
			if(y === "A") {
				yVal |= 0b10;
			} else {
				yPush = y;
			}
			if(yRef) {
				yVal |= 0b1;
			}
		}
		result = result | (parseInt(xVal) << 6) | (parseInt(yVal) << 4);
		RAMResult.push(result);
		if(xPush) {
			RAMResult.push(parseInt(xPush));
		}
		if(yPush) {
			RAMResult.push(parseInt(yPush));
		}
		console.log(result.toString(2), xVal, yVal, "xPush", xPush, "yPush", yPush, x, xRef, y, yRef, parseInt(yPush));

	}
	return RAMResult;
}

var opCodeMap = {
	"NON":0b0000,
	"SET":0b0001,
	"ADD":0b0010,
	"SUB":0b0011,
	"???":0b0100,
	"MUL":0b0101,
	"DIV":0b0110,
	"MOD":0b0111,
	"AND":0b1000,
	"OOR":0b1001,
	"IFE":0b1010,
	"IFN":0b1011,
	"IFG":0b1100,
	"IFL":0b1101,
	"INV":0b1110,
	"JMP":0b1111,
}
