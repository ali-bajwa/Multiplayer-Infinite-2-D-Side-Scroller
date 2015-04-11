var KeyboardModel = function(){
	this.keys = {};

	this.translation_tables = {
		code_to_name: {
			8:   "backspace", //  backspace
			9:   "tab", //  tab
			13:  "enter", //  enter
			16:  "shift", //  shift
			17:  "ctrl", //  ctrl
			18:  "alt", //  alt
			19:  "pause/break", //  pause/break
			20:  "caps lock", //  caps lock
			27:  "escape", //  escape
			33:  "page up", // page up, to avoid displaying alternate character and confusing people
			34:  "page down", // page down
			35:  "end", // end
			36:  "home", // home
			37:  "left arrow", // left arrow
			38:  "up arrow", // up arrow
			39:  "right arrow", // right arrow
			40:  "down arrow", // down arrow
			45:  "insert", // insert
			46:  "delete", // delete
			48:  "0",
			49:  "1",
			50:  "2",
			51:  "3",
			52:  "4",
			53:  "5",
			54:  "6",
			55:  "7",
			56:  "8",
			57:  "9",
			65:  "a",
			66:  "b",
			67:  "c",
			68:  "d",
			69:  "e",
			70:  "f",
			71:  "g",
			72:  "h",
			73:  "i",
			74:  "j",
			75:  "k",
			76:  "l",
			77:  "m",
			78:  "n",
			79:  "o",
			80:  "p",
			81:  "q",
			82:  "r",
			83:  "s",
			84:  "t",
			85:  "u",
			86:  "v",
			87:  "w",
			88:  "x",
			89:  "y",
			90:  "z",
			91:  "left window", // left window
			92:  "right window", // right window
			93:  "select key", // select key
			96:  "numpad 0", // numpad 0
			97:  "numpad 1", // numpad 1
			98:  "numpad 2", // numpad 2
			99:  "numpad 3", // numpad 3
			100: "numpad 4", // numpad 4
			101: "numpad 5", // numpad 5
			102: "numpad 6", // numpad 6
			103: "numpad 7", // numpad 7
			104: "numpad 8", // numpad 8
			105: "numpad 9", // numpad 9
			106: "multiply", // multiply
			107: "add", // add
			109: "subtract", // subtract
			110: "decimal point", // decimal point
			111: "divide", // divide
			112: "F1", // F1
			113: "F2", // F2
			114: "F3", // F3
			115: "F4", // F4
			116: "F5", // F5
			117: "F6", // F6
			118: "F7", // F7
			119: "F8", // F8
			120: "F9", // F9
			121: "F10", // F10
			122: "F11", // F11
			123: "F12", // F12
			144: "num lock", // num lock
			145: "scroll lock", // scroll lock
			186: ";", // semi-colon
			187: "=", // equal-sign
			188: ",", // comma
			189: "-", // dash
			190: ".", // period
			191: "/", // forward slash
			192: "`", // grave accent
			219: "[", // open bracket
			220: "\\", // back slash
			221: "]", // close bracket
			222: "'", // single quote
		},

		movement: {
			"left arrow": "left",
			"up arrow": "up",
			"down arrow": "down",
			"right arrow": "right",
		},

		pause: {
		    "p": "pause",
		},
		
		debug: {
			"a": "spawn_ant",
			"c": "connect",
			"v": "request_hero",
		},

	}


};

module.exports = new KeyboardModel;

