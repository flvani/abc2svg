// abc2svg - abc2svg.js
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

// -- constants --
// symbol types
const	BAR = 0,
	CLEF = 1,
	CUSTOS = 2,
	FORMAT = 3,
	GRACE = 4,
	KEY = 5,
	METER = 6,
	MREST = 7,
	NOTE = 8,
	PART = 9,
	REST = 10,
	SPACE = 11,
	STAVES = 12,
	STBRK = 13,
	TEMPO = 14,
	TUPLET = 15,
	BLOCK = 16

/* slur/tie types (3 bits) */
	SL_ABOVE = 0x01,
	SL_BELOW = 0x02,
	SL_AUTO = 0x03,
	SL_HIDDEN = 0x04,
	SL_DOTTED = 0x08,		/* (modifier bit) */

// staff system
	OPEN_BRACE = 0x01,
	CLOSE_BRACE = 0x02,
	OPEN_BRACKET = 0x04,
	CLOSE_BRACKET = 0x08,
	OPEN_PARENTH = 0x10,
	CLOSE_PARENTH = 0x20,
	STOP_BAR = 0x40,
	FL_VOICE = 0x80,
	OPEN_BRACE2 = 0x0100,
	CLOSE_BRACE2 = 0x0200,
	OPEN_BRACKET2 = 0x0400,
	CLOSE_BRACKET2 = 0x0800,
	MASTER_VOICE = 0x1000,

	BASE_LEN = 1536,
//	CM = 28.346,		// 1 inch = 2.54 centimeter
//	IN = 72.0,
// factor / 0.75
	CM = 37.8,		// 1 inch = 2.54 centimeter
	IN = 96,
	YSTEP = 128		/* number of steps for y offsets */

var	glovar = {
		clef:  {
			type: CLEF,		// clef in tune header
			clef_auto: true,
			clef_type: "a"		// auto
			},
		meter: {
			type: "meter",		// meter in tune header
			wmeasure: 0,		// or BASE_LEN?
			a_meter: []		// default: none
			}
	},
	info = {},
	parse = {
		ctx: {},
		prefix: '%',
		state: 0
	}

// utilities
function clone(obj) {
//	if (!obj || typeof(obj) != 'object')
	if (!obj)
		return obj
	var tmp = new obj.constructor()
	for (var k in obj)
		tmp[k] = obj[k]
	return tmp
}

function errbld(sev, txt, fn, idx) {
	var i, j, l, c, h
	if (user.errbld) {
		switch (sev) {
		case 0: sev = "warn"; break
		case 1: sev = "error"; break
		default: sev= "fatal"; break
		}
		user.errbld(sev, txt, fn, idx)
		return
	}
	if (idx != undefined && idx >= 0) {
		l = 0;
		i = -1;
		c = 0
		while (1) {
			j = parse.file.indexOf('\n', i + 1)
			if (j < 0) {
				i = parse.file.length - 1
				break
			}
			if (j > idx)
				break
			l++;
			i = j
		}
		c = idx - i
	}
	h = ""
	if (fn) {
		h = fn
		if (l)
			h += ":" + (l + 1) + ":" + (c + 1);
		h += " "
	}
	switch (sev) {
	case 0: h += "Warning: "; break
	case 1: h += "Error: "; break
	default: h += "Internal bug: "; break
	}
	txt = txt.replace(/&/g, '&amp;');
	txt = txt.replace(/</g, '&lt;');
	txt = txt.replace(/>/g, '&gt;');
	user.errmsg(h + txt, l, c)
}

function error(sev, s, msg) {
	if (s)
		errbld(sev, msg, s.ctx.fname, s.istart)
	else
		errbld(sev, msg)
}

// scanning functions
function scanBuf() {
//	this.buffer = buffer
	this.index = 0;

	this.char = function() {
		if (this.index >= this.buffer.length)
			return undefined
		return this.buffer[this.index]
	}
	this.next_char = function() {
		if (this.index >= this.buffer.length)
			return undefined
		return this.buffer[++this.index]
	}
	this.advance = function() {
		if (this.index < this.buffer.length)
			this.index++
	}
	this.get_int = function() {
		var	val = 0,
			c = this.buffer[this.index]
		while (c >= '0' && c <= '9') {
			val = val * 10 + Number(c);
			c = this.next_char()
		}
		return val
	}
	this.get_float = function() {
		var txt = "", c
		while (1) {
			c = this.buffer[this.index]
			if ("0123456789.-".indexOf(c) < 0)
				break
			txt += c;
			this.index++
		}
		return parseFloat(txt)
	}
	this.error = function(txt) {
		errbld(1, txt, parse.ctx.fname, this.index + parse.bol - 1)
	}
}

function syntax(sev, txt) {
	errbld(sev, txt, parse.ctx.fname, parse.istart)
}

// general abc2svg initialization
function abc2svg_init() {
// deco.js
//fixme: only non-standard... removed
//	reset_deco();
// draw.js
// format.js
//	defined_font = {}		// in reset_svg()
//	style = '\npath {stroke-width: .7}';
//	font_tb = {}
//	fid = 1;
//	font_scale_tb = clone(font_scale_tb_init);
//fixme: global
//	cfmt = clone(cfmt_init);
//	cfmt.pos = clone(pos_init);
	font_init();
//	lock = {}
//	info = {}
// front.js
//	parse = {
//		prefix: '%',
//		state: 0
//	}
// music.js
//	space_tb = clone(space_tb_init);
// parse.js
//	vover = null;
// svg.js
//	init_svg();
// tune.js
	init_tune()
}
