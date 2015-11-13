// test
const abc2svg={version:"1.4.1",vdate:"2015-11-13"}
// abc2svg - head.js
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.

// start of the Abc object
function Abc(user) {
	var	wpsobj, svgobj
	this.user = user
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
// abc2svg - deco.js - decorations
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

var	dd_tb= {},		// table of decoration definitions
	a_de = []		// array of the decoration elements

// standard decorations
const std_deco_tb = [
	"dot 0 stc 5 1 1",
	"tenuto 0 emb 5 2 2",
	"slide 1 sld 3 7 0",
	"arpeggio 2 arp 12 10 0",
	"roll 3 cpu 7 6 6",
	"fermata 3 hld 12 7 7",
	"emphasis 3 accent 7 4 4",
	"lowermordent 3 lmrd 10 2 2",
	"coda 3 coda 24 10 10",
	"uppermordent 3 umrd 10 2 2",
	"segno 3 sgno 20 4 4",
	"trill 3 trl 14 4 4",
	"upbow 3 upb 10 5 5",
	"downbow 3 dnb 9 5 5",
	"gmark 3 grm 6 5 5",
	"wedge 3 wedge 8 1 1",
	"turnx 3 turnx 10 0 5",
	"breath 3 brth 0 1 20",
	"longphrase 3 lphr 0 1 1",
	"mediumphrase 3 mphr 0 1 1",
	"shortphrase 3 sphr 0 1 1",
	"invertedfermata 3 hld 12 7 7",
	"invertedturn 3 turn 10 0 5",
	"invertedturnx 3 turnx 10 0 5",
	"0 3 fng 8 3 3 0",
	"1 3 fng 8 3 3 1",
	"2 3 fng 8 3 3 2",
	"3 3 fng 8 3 3 3",
	"4 3 fng 8 3 3 4",
	"5 3 fng 8 3 3 5",
	"plus 3 dplus 7 3 3",
	"+ 3 dplus 7 3 3",
	"accent 3 accent 6 4 4",
	"> 3 accent 6 4 4",
	"marcato 3 marcato 9 3 3",
	"^ 3 marcato 9 3 3",
	"mordent 3 lmrd 10 2 2",
	"open 3 opend 10 2 2",
	"snap 3 snap 14 3 3",
	"thumb 3 thumb 14 2 2",
	"D.C. 3 dacs 16 10 10 D.C.",
	"D.S. 3 dacs 16 10 10 D.S.",
	"fine 3 dacs 16 10 10 FINE",
	"f 6 pf 18 1 7",
	"ff 6 pf 18 2 10",
	"fff 6 pf 18 4 13",
	"ffff 6 pf 18 6 16",
	"mf 6 pf 18 6 13",
	"mp 6 pf 18 6 16",
	"p 6 pf 18 2 8",
	"pp 6 pf 18 5 14",
	"ppp 6 pf 18 8 20",
	"pppp 6 pf 18 10 25",
	"pralltriller 3 umrd 10 2 2",
	'sfz 6 sfz 18 4 10 ""',
	"turn 3 turn 10 0 5",
	"trill( 5 ltr 8 0 0",
	"trill) 5 ltr 8 0 0",
	"crescendo( 7 cresc 18 0 0",
	"crescendo) 7 cresc 18 0 0",
	"<( 7 cresc 18 0 0",
	"<) 7 cresc 18 0 0",
	"diminuendo( 7 dim 18 0 0",
	"diminuendo) 7 dim 18 0 0",
	">( 7 dim 18 0 0",
	">) 7 dim 18 0 0",
	"invisible 32 0 0 0 0",
	"beamon 33 0 0 0 0",
	"trem1 34 0 0 0 0",
	"trem2 34 0 0 0 0",
	"trem3 34 0 0 0 0",
	"trem4 34 0 0 0 0",
	"xstem 35 0 0 0 0",
	"beambr1 36 0 0 0 0",
	"beambr2 36 0 0 0 0",
	"rbstop 37 0 0 0 0",
	"/ 38 0 0 6 6",
	"// 38 0 0 6 6",
	"/// 38 0 0 6 6",
	"beam-accel 39 0 0 0 0",
	"beam-rall 39 0 0 0 0",
	"stemless 40 0 0 0 0"
]

var	user_deco_tb,	/* user decorations */
	first_note	/* first note/rest of the line */

/* -- get the max/min vertical offset -- */
function y_get(st, up, x, w) {
	var	y,
		p_staff = staff_tb[st],
		i = Math.floor(x / realwidth * YSTEP),
		j = Math.floor((x + w) / realwidth * YSTEP)

	if (i < 0)
		i = 0
	if (j >= YSTEP) {
		j = YSTEP - 1
		if (i > j)
			i = j
	}
	if (up) {
		y = p_staff.top[i++]
		while (i <= j) {
			if (y < p_staff.top[i])
				y = p_staff.top[i];
			i++
		}
	} else {
		y = p_staff.bot[i++]
		while (i <= j) {
			if (y > p_staff.bot[i])
				y = p_staff.bot[i];
			i++
		}
	}
	return y
}

/* -- adjust the vertical offsets -- */
function y_set(st, up, x, w, y) {
	var	p_staff = staff_tb[st],
		i = Math.floor(x / realwidth * YSTEP),
		j = Math.floor((x + w) / realwidth * YSTEP)

	/* (may occur when annotation on 'y' at start of an empty staff) */
	if (i < 0)
		i = 0
	if (j >= YSTEP) {
		j = YSTEP - 1
		if (i > j)
			i = j
	}
	if (up) {
		while (i <= j) {
			if (p_staff.top[i] < y)
				p_staff.top[i] = y;
			i++
		}
	} else {
		while (i <= j) {
			if (p_staff.bot[i] > y)
				p_staff.bot[i] = y;
			i++
		}
	}
}

// set the string of a decoration
function set_str(de, str) {
	var	a = str.match(/^@([0-9.-]+),([0-9.-]+)/)

	if (a) {
		de.x += Number(a[1]);
		de.dy = Number(a[2]);	// y is not calculated yet
		de.str = str.replace(a[0], "")
	} else {
		de.str = str;
		de.dy = 0
	}
}

/* -- get the staff position of the dynamic and volume marks -- */
function up_p(s, pos) {
	switch (pos) {
	case SL_ABOVE:
		return true
	case SL_BELOW:
		return false
	}
	if (s.multi && s.multi != 0)
		return s.multi > 0
	if (!voice_tb[s.v].have_ly)
		return false

	/* above if the lyrics are below the staff */
	return s.pos.voc != SL_ABOVE
}

/* -- drawing functions -- */
/* special case for arpeggio */
function d_arp(de) {
	var	m, h, dx,
		s = de.s,
		dd = de.dd,
		xc = 0

	for (m = 0; m <= s.nhd; m++) {
		if (s.notes[m].acc) {
			dx = 5 + s.notes[m].shac
		} else {
			dx = 6 - s.notes[m].shhd
			switch (s.head) {
			case "square":
			case "oval":
				dx += 2.5
				break
			}
		}
		if (dx > xc)
			xc = dx
	}
	h = 3 * (s.notes[s.nhd].pit - s.notes[0].pit) + 4;
	m = dd.h		/* minimum height */
	if (h < m)
		h = m;

	de.flags.val = true;
	de.val = h;
	de.x = s.x - xc;
	de.y = 3 * (s.notes[0].pit - 18) - 3
}

/* special case for crescendo/diminuendo */
function d_cresc(de) {
	if (de.flags.ldst)		// skip start of deco
		return
	var	s, dd, dd2, up, x, dx, x2, i,
		s2 = de.s,
		de2 = de.start,		/* start of the deco */
		de2_prev

	if (de2) {
		s = de2.s;
		x = s.x + 3;
		i = de2.ix
		if (i > 0)
			de2_prev = a_de[i - 1]
	} else {			/* end without start */
		s = first_note;
		x = s.x - s.wl - 4
	}
	de.st = s2.st;
	de.flags.lden = false;		/* old behaviour */
	de.flags.val = true;
	up = up_p(s2, s2.pos.dyn)
	if (up)
		de.flags.up = true

	/* shift the starting point if any dynamic mark on the left */
	if (de2_prev && de2_prev.s == s
	 && ((de.flags.up && !de2_prev.flags.up)
	  || (!de.flags.up && de2_prev.flags.up))) {
		dd2 = de2_prev.dd
		if (dd2.func >= 6) {
			x2 = de2_prev.x + de2_prev.val + 4
			if (x2 > x)
				x = x2
		}
	}

	if (de.defl.noen) {		/* if no decoration end */
		dx = de.x - x
		if (dx < 20) {
			x = de.x - 20 - 3;
			dx = 20
		}
	} else {
		x2 = s2.x
		if (de.next && de.next.s == s
		 && ((de.flags.up && !de.next.flags.up)
		  || (!de.flags.up && de.next.flags.up))) {
			dd2 = de.next.dd
			if (dd2.func >= 6)	/* if dynamic mark */
				x2 -= 5
		}
		dx = x2 - x - 4
		if (dx < 20) {
			x -= (20 - dx) * 0.5
			if (!de.start)
				x -= (20 - dx) * 0.5;
			dx = 20
		}
	}

	de.val = dx;
	de.x = x;
	dd = de.dd;
	de.y = y_get(de.st, up, x, dx)
	if (!up)
		de.y -= dd.h
	/* (y_set is done later in draw_deco_staff) */
}

/* near the note (dot, tenuto) */
function d_near(de) {
	var	y, up,
		s = de.s,
		dd = de.dd

	if (dd.str) {			// annotation like decoration
		de.x = s.x;
		de.y = s.y;
		set_str(de, dd.str)
		return
	}
	if (s.multi)
		up = s.multi > 0
	else
		up = s.stem < 0
	if (up)
		y = Math.floor(s.ymx)
	else
		y = Math.floor(s.ymn - dd.h)
	if (y > -6 && y < 24) {
		if (up)
			y += 3;
		y = Math.floor((y + 6) / 6) * 6 - 6	/* between lines */
	}
	if (up)
		s.ymx = y + dd.h
	else
		s.ymn = y;
	de.y = y;
	de.x = s.x + s.notes[s.stem >= 0 ? 0 : s.nhd].shhd
	if (dd.name[0] == 'd'			/* if dot decoration */
	 && s.nflags >= -1) {			/* on stem */
		if (up) {
			if (s.stem > 0)
				de.x += 3.5	// stem_xoff
		} else {
			if (s.stem < 0)
				de.x -= 3.5
		}
	}
}

/* special case for piano/forte indications */
function d_pf(de) {
	var	dd2, x2, str, x, up,
		s = de.s,
		dd = de.dd,
		de_prev;

	de.val = dd.wl + dd.wr;
	up = up_p(s, s.pos.vol)
	if (up)
		de.flags.up = true;
	x = s.x - dd.wl
	if (de.ix > 0) {
		de_prev = a_de[de.ix - 1]
		if (de_prev.s == s
		 && ((de.flags.up && !de_prev.flags.up)
		  || (!de.flags.up && de_prev.flags.up))) {
			dd2 = de_prev.dd
			if (dd2.func >= 6) {	/* if dynamic mark */
				x2 = de_prev.x + de_prev.val + 4;
				if (x2 > x)
					x = x2
			}
		}
	}

	de.x = x;
	de.y = y_get(s.st, up, x, de.val)
	if (!up)
		de.y -= dd.h
	if (dd.str)
		set_str(de, dd.str)
	else if (dd.name != 'sfz')
		de.str = dd.name
	/* (y_set is done later in draw_deco_staff) */
}

/* special case for slide and tremolo */
function d_slide(de) {
	var	m, dx,
		s = de.s,
		yc = s.notes[0].pit,
		xc = 5

	for (m = 0; m <= s.nhd; m++) {
		if (s.notes[m].acc) {
			dx = 4 + s.notes[m].shac
		} else {
			dx = 5 - s.notes[m].shhd
			switch (s.head) {
			case "square":
			case "oval":
				dx += 2.5
				break
			}
		}
		if (s.notes[m].pit <= yc + 3 && dx > xc)
			xc = dx
	}
	de.x = s.x - xc;
	de.y = 3 * (yc - 18)
}

/* special case for long trill */
function d_trill(de) {
	if (de.flags.ldst)
		return
	var	s, dd, st, up, x, y, w,
		s2 = de.s

	if (de.start) {			/* deco start */
		s = de.start.s;
		x = s.x
		if (s.type == NOTE
		 && s.a_dd && s.a_dd.length > 1)
			x += 10		// hack 'tr~~~~~'
	} else {			/* end without start */
		s = first_note;
		x = s.x - s.wl - 4
	}
	de.st = st = s2.st;

	up = s2.multi >= 0
	if (de.defl.noen) {		/* if no decoration end */
		w = de.x - x
		if (w < 20) {
			x = de.x - 20 - 3;
			w = 20
		}
	} else {
		w = s2.x - x - 6
		if (s2.type == NOTE)
			w -= 6
		if (w < 20) {
			x -= (20 - w) * 0.5
			if (!de.start)
				x -= (20 - w) * 0.5;
			w = 20
		}
	}
	dd = de.dd;
	y = y_get(st, up, x, w)
	if (up) {
		var stafft = staff_tb[s.st].topbar + 2
		if (y < stafft)
			y = stafft
	} else {
		y -= dd.h
		var staffb = staff_tb[s.st].botbar - 2
		if (y > staffb)
			y = staffb
	}
	de.flags.lden = undefined;
	de.flags.val = true;
	de.val = w;
	de.x = x;
	de.y = y
	if (up)
		y += dd.h;
	y_set(st, up, x, w, y)
	if (up)
		s.ymx = s2.ymx = y
	else
		s.ymn = s2.ymn = y
}

/* above (or below) the staff */
function d_upstaff(de) {
	var	yc, up, inv,
		s = de.s,
		dd = de.dd,
		x = s.x,
		w = dd.wl + dd.wr,
		stafft = staff_tb[s.st].topbar + 2,
		staffb = staff_tb[s.st].botbar - 2

	if (s.nhd)
		x += s.notes[s.stem >= 0 ? 0 : s.nhd].shhd;
	up = -1
	if (dd.func != 4) {		// not below
		switch (s.pos.orn) {
		case SL_ABOVE:
			up = 1
			break
		case SL_BELOW:
			up = 0
			break
//		default:
//			if (s.multi > 0)
//				up = true
//			else if (!s.multi)
//				up = s.stem < 0
//			break
		}
	}

	switch (dd.glyph) {
	case "accent":
	case "cpu":
		if (!up
		 || (up < 0
		  && (s.multi < 0
		   || (!s.multi && s.stem > 0)))) {
			yc = y_get(s.st, false, s.x - dd.wl, w)
			if (yc > staffb)
				yc = staffb;
			yc -= dd.h;
			y_set(s.st, false, s.x, 0, yc);
			inv = true;
			s.ymn = yc
		} else {
			yc = y_get(s.st, true, s.x, 0)
			if (yc < stafft)
				yc = stafft;
			y_set(s.st, true, s.x - dd.wl, w, yc + dd.h);
			s.ymx = yc + dd.h
		}
		break
	case "brth":
	case "lphr":
	case "mphr":
	case "sphr":
		yc = stafft + 1
		for (s = s.ts_next; s; s = s.ts_next)
			if (s.shrink)
				break
		if (s)
			x += (s.x - x) * 0.4
		else
			x += (realwidth - x) * 0.4
		break
	default:
		if (dd.name.indexOf("invert") == 0)
			inv = true
		if (dd.name != "invertedfermata"
		 && (up > 0
		  || (up < 0 && s.multi >= 0))) {
			yc = y_get(s.st, true, s.x - dd.wl, w)
			if (yc < stafft)
				yc = stafft;
			y_set(s.st, true, s.x - dd.wl, w, yc + dd.h);
			s.ymx = yc + dd.h
		} else {
			yc = y_get(s.st, false, s.x - dd.wl, w)
			if (yc > staffb)
				yc = staffb;
			yc -= dd.h;
			y_set(s.st, false, s.x - dd.wl, w, yc)
			if (dd.name == "fermata")
				inv = true;
			s.ymn = yc
		}
		break
	}
	if (inv) {
		yc += dd.h;
		de.flags.inv = true
	}
	de.x = x;
	de.y = yc

	if (dd.str)
		set_str(de, dd.str)
}

/* deco function table */
const func_tb = [
	d_near,		/* 0 - near the note */
	d_slide,	/* 1 */
	d_arp,		/* 2 */
	d_upstaff,	/* 3 - tied to note */
	d_upstaff,	/* 4 (below the staff) */
	d_trill,	/* 5 */
	d_pf,		/* 6 - tied to staff (dynamic marks) */
	d_cresc		/* 7 */
]

/* -- add a decoration - from internal table or %%deco -- */
/* syntax:
 *	%%deco <name> <c_func> <glyph> <h> <wl> <wr> [<str>]
 */
function deco_add(param) {
	if (!user_deco_tb)
		user_deco_tb = []
	user_deco_tb.push(param)
}

function deco_build(text) {
	var dd, dd2, c, i, elts, str

	// extract the values
	a = text.match(/(.+)\s+(\d+)\s+(.+?)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)/)
	if (!a) {
		error(1, null, "Invalid decoration '" + text + "'")
		return undefined
	}
//	name = a[1];
	var	c_func = Number(a[2]),
//		glyph = a[3],
		h = parseFloat(a[4]),
		wl = parseFloat(a[5]),
		wr = parseFloat(a[6])

	if (isNaN(c_func)) {
		error(1, null, "%%deco: bad C function value '" + a[2] + "'")
		return undefined
	}
	if ((c_func < 0 || c_func >= func_tb.length)
	 && (c_func < 32 || c_func > 40)) {
		error(1, null, "%%deco: bad C function index '" + c_func + "'")
		return undefined
	}
	if (h < 0 || wl < 0 || wr < 0) {
		error(1, null, "%%deco: cannot have a negative value '" + text + "'")
		return undefined
	}
	if (h > 50 || wl > 80 || wr > 80) {
		error(1, null, "%%deco: abnormal h/wl/wr value " + text + "'")
		return undefined
	}

	// create/redefine the decoration
	dd = dd_tb[a[1]]
	if (!dd) {
		dd = {
			name: a[1]
		}
		dd_tb[a[1]] = dd
	}

	/* set the values */
	dd.func = c_func;
	dd.glyph = a[3];
	dd.h = h;
	dd.wl = wl;
	dd.wr = wr;
	str = text.replace(a[0], '').trim()
	if (str) {				// optional string
		if (str[0] == '"')
			str = str.slice(1, -1);
		dd.str = str
	}

	// link the start and end of long decorations
	c = dd.name[dd.name.length - 1]
	if (c == '(' ||
	    (c == ')' && dd.name.indexOf('(') < 0)) {
		if (c == '(')
			dd.ldst = true
		else
			dd.lden = true;
		name2 = dd.name.slice(0, -1) + (c == '(' ? ')' : '(')
		dd2 = dd_tb[name2]
		if (dd2) {
			if (c == '(')
				dd.ld_en_dd = dd2
			else
				dd2.ld_en_dd = dd
		}
	}
	return dd
}

/* -- set the duration of the notes under a feathered beam -- */
function set_feathered_beam(s1, accel) {
//fixme: to do in tune.js later
//	var s, s2
//	var t, tt, d, b, i
//	var a
//
//	/* search the end of the beam */
//	vard = s1.dur
//	var n = 1
//	for (s = (struct SYMBOL *) s1.as.next;
//	     s;
//	     s = (struct SYMBOL *) s.as.next) {
//		if (s.dur != d || s.space)
//			break
//		s2 = s
//		n++
//	}
//	if (!s2)
//		return
//	b = d / 2			/* smallest note duration */
//--fixme
//	a = (float) d / (n - 1)		/* delta duration */
//	tt = d * n
//	t = 0
//	if (accel) {				/* !beam-accel! */
//		for (s = s1, i = n - 1;
//		     s != s2;
//		     s = (struct SYMBOL *) s.as.next, i--) {
//			d = (int) lroundf(a * i) + b
//			s.dur = d
//			t += d
//		}
//	} else {				/* !beam-rall! */
//		for (s = s1, i = 0;
//		     s != s2;
//		     s = (struct SYMBOL *) s.as.next, i++) {
//			d = (int) lroundf(a * i) + b
//			s.dur = d
//			t += d
//		}
//	}
//	s2.dur = tt - t
}

/* -- convert the decorations -- */
function deco_cnv(a_dcn, s, prev) {
	var	i, j, dd, dcn, note,
		n = a_dcn.length

	for (i = 0; i < n; i++) {
		dcn = a_dcn[i];
		dd = dd_tb[dcn]
		if (!dd) {
			dd = deco_def(dcn)
			if (!dd) {
				if (cfmt.decoerr)
					error(1, s, "Unknown decoration '" + dcn + "'")
				continue
			}
		}

		/* special decorations */
		switch (dd.func) {
		default:
			if (dd.name.slice(0, 5) == "head-") {
				if (!s.notes) {
					error(1, s,
						"!" + dd.name + "! must be on a note or rest")
					break
				}
				for (j = 0; j <= s.nhd; j++) {
					note = s.notes[j]
					if (!note.a_dcn)
						note.a_dcn = []
					note.a_dcn.push(dd.name)
				}
			} else {
				if (!s.a_dd)
					s.a_dd = []
				s.a_dd.push(dd)
			}
			break
		case 32:		/* 32 = invisible */
			s.invisible = true
			break
		case 33:		/* 33 = beamon */
			if (s.type != BAR) {
				error(1, s,
					"!beamon! must be on a bar")
				break
			}
			s.beam_on = true
			break
		case 34:		/* 34 = trem1..trem4 */
			if (s.type != NOTE
			 || !prev
			 || prev.type != NOTE) {
				error(1, s,
					"!" + dd.name +
					"! must be on the last of a couple of notes")
				break
			}
			s.trem2 = true;
			s.beam_end = true;
//			s.beam_st = false;
			prev.trem2 = true;
			prev.beam_st = true;
//			prev.beam_end = false;
			s.ntrem = prev.ntrem = Number(dd.name[4]);
			s.nflags--;
			prev.nflags--
			if (s.nflags > 0) {
				s.nflags += s.ntrem;
				prev.nflags += s.ntrem
			} else {
				if (s.nflags <= -2) {
					s.stemless = true;
					prev.stemless = true
				}
				s.nflags = s.ntrem;
				prev.nflags = s.ntrem
			}
			for (j = 0; j <= s.nhd; j++)
				s.notes[j].dur *= 2;
			for (j = 0; j <= prev.nhd; j++)
				prev.notes[j].dur *= 2
			break
		case 35:		/* 35 = xstem */
			if (s.type != NOTE) {
				error(1, s, "!xstem! must be on a note")
				break
			}
			s.xstem = true;
			s.nflags = 0		// beam break
			break
		case 36:		/* 36 = beambr1 / beambr2 */
			if (s.type != NOTE) {
				error(1, s, "!" + dd.name + "! must be on a note")
				break
			}
			if (dd.name[6] == '1')
				s.beam_br1 = true
			else
				s.beam_br2 = true
			break
		case 37:		/* 37 = rbstop */
			s.rbstop = true
			break
		case 38:		/* 38 = /, // and /// = tremolo */
			if (s.type != NOTE) {
				error(1, s, "!" + dd.name + "! must be on a note")
				break
			}
			s.trem1 = true;
			s.ntrem = dd.name.length	/* 1, 2 or 3 */
			if (s.nflags > 0)
				s.nflags += s.ntrem
			else
				s.nflags = s.ntrem
			break
		case 39:		/* 39 = beam-accel/beam-rall */
			if (s.type != NOTE) {
				error(1, s, "!" + dd.name + "! must be on a note")
				break
			}
			s.feathered_beam = true;
			set_feathered_beam(s, dd.name[5] == 'a')
			break
		case 40:		/* 40 = stemless */
			s.stemless = true
			break
		}
	}
}

/* -- define a decoration -- */
function deco_def(name) {
	var	i, n,
		dn = name + ' '

	if (user_deco_tb) {
		n = user_deco_tb.length
		for (i = 0; i < n; i++) {
			if (user_deco_tb[i].indexOf(dn) == 0)
				return deco_build(user_deco_tb[i])
		}
	}
	n = std_deco_tb.length
	for (i = 0; i < n; i++) {
		if (std_deco_tb[i].indexOf(dn) == 0)
			return deco_build(std_deco_tb[i])
	}
	return undefined
}

/* -- update the x position of a decoration -- */
function deco_update(s, dx) {
	var	i, de,
		n = a_de.length

	for (i = 0; i < n; i++) {
		de = a_de[i]
		if (de.s == s)
			de.x += dx
	}
}

/* -- adjust the symbol width -- */
function deco_width(s) {
	var	dd, i,
		wl = 0,
		a_dd = s.a_dd,
		n = a_dd.length

	for (i = i = 0; i < n; i++) {
		dd =  a_dd[i]
		switch (dd.func) {
		case 1:			/* slide */
			if (wl < 7)
				wl = 7
			break
		case 2:			/* arpeggio */
			if (wl < 14)
				wl = 14
			break
		}
	}
	if (wl != 0 && s.prev && s.prev.type == BAR)
		wl -= 3
	return wl
}

/* -- draw the decorations -- */
/* (the staves are defined) */
function draw_all_deco() {
	if (a_de.length == 0)
		return
	var	de, de2, dd, f, st, x, y, y2, ym, uf, i,
		ymid = []

	if (!cfmt.dynalign) {
		st = nstaff;
		y = staff_tb[st].y
		while (--st >= 0) {
			y2 = staff_tb[st].y;
			ymid[st] = (y + 24 + y2) * 0.5;
			y = y2
		}
	}

	while (1) {
		de = a_de.shift()
		if (!de)
			break
		dd = de.dd
		if (dd.ldst && dd.ld_en_dd)	// start of full long decoration
			continue

		// handle the stem direction
		f = dd.glyph;
		i = f.indexOf('/')
		if (i > 0) {
			if (de.s.stem >= 0)
				f = f.slice(0, i)
			else
				f = f.slice(i + 1)
		}

		st = de.st;
		y = de.y + staff_tb[st].y

		/* center the dynamic marks between two staves */
/*fixme: KO when deco on other voice and same direction*/
		if (dd.func >= 6 && !cfmt.dynalign
		 && ((de.flags.up && st > 0)
		  || (!de.flags.up && st < nstaff))) {
			if (de.flags.up)
				ym = ymid[--st]
			else
				ym = ymid[st++];
			ym -= dd.h * 0.5
			if ((de.flags.up && y < ym)
			 || (!de.flags.up && y > ym)) {
//				var s = de.s
//				if (s.st > st) {
//					while (s.st != st)
//						s = s.ts_prev
//				} else if (s.st < st) {
//					while (s.st != st)
//						s = s.ts_next
//				}
				y2 = y_get(st, !de.flags.up, de.x, de.val)
					+ staff_tb[st].y
				if (de.flags.up)
					y2 -= dd.h
//fixme: y_set is not used later!
				if ((de.flags.up && y2 > ym)
				 || (!de.flags.up && y2 < ym)) {
					y = ym;
					y_set(st, de.flags.up, de.x, de.val,
						  (de.flags.up ? y + dd.h : y)
						- staff_tb[st].y)
				}
			}
		}

		set_scale(de.s);

		x = de.x;

		// check if user JS decoration
		uf = user[f]
		if (uf && typeof(uf) == "function") {
			uf(x, y, de)
			continue
		}

		// check if user PS definition
		if (psdeco(f, x, y, de))
			continue

if (0) {
//fixme: for long decorations with x,y start != x,y end
		if (de.flags.lden) {
			de2 = de.start
			if (de2) {
				x = de2.x;
				y = de2.y + staff_tb[de2.st].y
			} else {
				x = first_note.x - first_note.wl - 4
			}
			if (x > de.x - 20)
				x = de.x - 20;
			putxy(x, y)
		}
//fixme: end long deco
}
		if (de.flags.grace) {
			output.push('<g transform="translate(');
			out_sxsy(x, ',', y)
			if (de.flags.inv)
				output.push(') scale(0.7, -0.7)">\n')
			else
				output.push(') scale(0.7)">\n');
			stv_g.trans = true;
			x = y = 0
		} else if (de.flags.inv) {
			output.push('<g transform="translate(');
			out_sxsy(x, ',', y);
			output.push(') scale(1, -1)">\n');
			stv_g.trans = true;
			x = y = 0
		}
		if (de.flags.val) {
			out_deco_val(x, y, f, de.val, de.defl)
		} else if (de.str) {
			out_deco_str(x, y + de.dy + dd.h * 0.2,
					f, de.str)
		} else {
			xygl(x, y, f)
		}
		if (stv_g.trans) {
			stv_g.trans = false;
			output.push('</g>\n')
		}

	}
}

/* -- draw a decoration relative to a note head -- */
/* return true if the decoration replaces the head */
function draw_deco_head(dcn,		// deco name
			x, y, stem) {
	var	f, str, uf,
		dd = dd_tb[dcn],
		de
	if (!dd) {
		dd = deco_def(dcn)
		if (!dd) {
			error(1, null, "Unknown decoration '" + dcn + "'")
			return false
		}
	}
	f = dd.glyph
//	if (f == "-")
//		return false

//fixme: useful ?
//	// chack if user decoration
//	uf = user[f]
//	if (uf && typeof(uf) == "function") {
//		uf(x, y, dd.str ? dd.str : dd.name)
//		return dd.name.indexOf("head-") == 0
//	}
	// try PS
	if (pshdeco(f, x, y, dd))
		return dd.name.indexOf("head-") == 0

	if (dd.str) {
		de = {
			x: x
		}
		set_str(de, dd.str);
		out_deco_str(de.x, y + de.dy, f, de.str)
	} else {
		switch (dd.func) {
		default:
			xygl(x, y, f)
			break
		case 2:					// arpeggio
		case 5:					// trill
		case 7:					// d_cresc
			error(1, null, "Cannot have !" + dd.name + "! on a head")
			break
		case 3:					// d_upstaff
		case 4:
			xygl(x, y, f)
			break
		}
	}
	return dd.name.indexOf("head-") == 0
}

/* -- create the deco elements, and treat the near ones -- */
function create_deco(s) {
	var	dd, k, l, pos, de,
		n = s.a_dd.length

/*fixme:pb with decorations above the staff*/
	for (k = 0; k < n; k++) {
		dd = s.a_dd[k]

		/* check if hidden */
		switch (dd.func) {
		default:
			pos = 0
			break
		case 3:				/* d_upstaff */
		case 4:
//fixme:trill does not work yet
		case 5:				/* trill */
			pos = s.pos.orn
			break
		case 6:				/* d_pf */
			pos = s.pos.vol
			break
		case 7:				/* d_cresc */
			pos = s.pos.dyn
			break
		}
		if (pos == SL_HIDDEN)
			continue

		/* memorize the decorations, but not the head ones */
		if (dd.name.indexOf("head-") == 0) {
			switch (s.type) {
			case NOTE:
			case REST:
				break
			default:
				error(1, s, "Cannot have !" +
					dd.name + "! on a bar")
				break
			}
			continue
		}
		de = {
			s: s,
			dd: dd,
			st: s.st,
			ix: a_de.length,
			flags: {},
			defl: {},
			dy: 0
		}
		a_de.push(de)
		if (s.grace)
			de.flags.grace = true
//		if (dd.ld_en_dd) {
		if (dd.ldst) {
			de.flags.ldst = true
		} else if (dd.lden) {
//fixme: pb with "()"
			de.flags.lden = true;
			de.defl.nost = true
		}
//		if (cfmt.setdefl && s.stem >= 0)
//			de.defl.stemup = true

		if (dd.func >= 3)	/* if not near the note */
			continue
		if (s.type != NOTE) {
			error(1, s,
				"Cannot have !" + dd.name + "! on a rest or a bar")
			continue
		}
		func_tb[dd.func](de)
	}
}

/* -- create the decorations and define the ones near the notes -- */
/* (the staves are not yet defined) */
/* this function must be called first as it builds the deco element table */
function draw_deco_near() {
	var s, g, dd, first

//	a_de = []				// must be empty
	for (s = tsfirst; s; s = s.ts_next) {
		switch (s.type) {
		case BAR:
		case MREST:
			break
		case NOTE:
		case REST:
		case SPACE:
			if (!first)
				first = s
			break
		case GRACE:
			for (g = s.extra; g; g = g.next) {
				if (!g.a_dd)
					continue
				create_deco(g)
			}
			continue
		default:
			continue
		}
		if (s.a_dd)
			create_deco(s)
	}
	first_note = first
}

/* -- define the decorations tied to a note -- */
/* (the staves are not yet defined) */
function draw_deco_note() {
	var i, j, n_dede, de2, dd, dd2, f, t, st, v

	// link the long decorations
	n_de = a_de.length
	for (i = 0; i < n_de; i++) {
		de = a_de[i]
		if (!de.flags.ldst)	// not the start of long decoration
			continue
		dd = de.dd;
		dd2 = dd.ld_en_dd
		if (!dd2) {		// if long deco has no end
			dd2 = {		// create one
				name: dd.name.slice(0, -1) + ")",
				func: dd.func,
				glyph: dd.glyph,
				h: dd.h
			}
			dd.ld_en_dd = dd2
		}
		v = de.s.v			/* search in the voice */
		for (j = i + 1; j < n_de; j++) {
			de2 = a_de[j]
			if (de2.dd == dd2 && de2.s.v == v)
				break
		}
		if (j == n_de) {		/* search in the staff */
			st = de.s.st
			for (j = i + 1; j < n_de; j++) {
				de2 = a_de[j]
				if (de2.dd == dd2 && de2.s.st == st)
					break
			}
		}
		if (j == n_de) {		/* no end, insert one */
			de2 = {
				s: de.s,
				st: de.st,
				dd: dd2,
				ix: a_de.length - 1,
				x: realwidth - 6,
				y: de.s.y,
				flags: {
					lden: true
				},
				defl: {
					noen: true
				}
			}
			a_de.push(de2)
		}
		de2.start = de
		delete de2.defl.nost
	}

	for (i = 0; i < n_de; i++) {
		de = a_de[i];
		dd = de.dd;
		f = dd.func
		if (f < 3 || f >= 6)
			continue	/* not tied to the note */
		func_tb[f](de)
	}
}

/* -- define the music elements tied to the staff -- */
/* (the staves are not yet defined) */
function draw_deco_staff() {
	var	s, first_gchord, p_voice, x, y, w, i, n, v, de, dd, p, repnl,
		gch, gch2, ix,
		minmax = new Array(nstaff)

	/* search the vertical offset for the guitar chords */
	for (i = 0; i <= nstaff; i++)
		minmax[i] = {ymin: 0, ymax: 24}
	for (s = tsfirst; s; s = s.ts_next) {
		if (!s.a_gch)
			continue
		if (!first_gchord)
			first_gchord = s;
		n = s.a_gch.length
		for (ix = 0; ix < n; ix++) {
			gch = s.a_gch[ix]
			if (gch.type != 'g')
				continue
			gch2 = gch;	/* guitar chord closest to the staff */
			if (gch.y < 0)
				break
		}
		if (gch2) {
			w = gch2.w
			if (gch2.y >= 0) {
				y = y_get(s.st, true, s.x, w);
				if (y > minmax[s.st].ymax)
					minmax[s.st].ymax = y
			} else {
				y = y_get(s.st, false, s.x, w);
				if (y < minmax[s.st].ymin)
					minmax[s.st].ymin = y
			}
		}
	}

	/* draw the guitar chords if any */
	if (first_gchord) {
		for (i = 0; i <= nstaff; i++) {
			var bot = staff_tb[i].botbar;
			minmax[i].ymin -= 3
			if (minmax[i].ymin > bot - 10)
				minmax[i].ymin = bot - 10
			var top = staff_tb[i].topbar;
			minmax[i].ymax += 3
			if (minmax[i].ymax < top + 10)
				minmax[i].ymax = top + 10
		}
		set_sscale(-1)		/* restore the scale parameters */
		for (s = first_gchord; s; s = s.ts_next) {
			if (!s.a_gch)
				continue
			switch (s.type) {
			case NOTE:
			case REST:
			case SPACE:
			case MREST:
				break
			case BAR:
//--fixme: what when gchord and repeat ?
				if (!s.text)	// not a repeat bar
					break
			default:
				continue
			}
			draw_gchord(s, minmax[s.st].ymin,
					minmax[s.st].ymax)
		}
	}

	/* draw the repeat brackets */
	n = voice_tb.length
	for (v = 0; v < n; v++) {
		var s1, s2, y2, first_repeat;

		p_voice = voice_tb[v]
		if (p_voice.second || !p_voice.sym)
			continue

		/* search the max y offset and set the end of bracket */
		y = staff_tb[p_voice.st].topbar + 6 + 20;
		first_repeat = undefined
		for (s = p_voice.sym; s; s = s.next) {
			if (s.type != BAR
			 || !s.text		// not a repeat bar
			 || s.norepbra)
				continue
/*fixme: line cut on repeat!*/
			if (!s.next)
				break
			if (!first_repeat)
				first_repeat = s;
			s1 = s;

			/* a bracket may be 4 measures
			 * but only 2 measures when it has no start */
			i = s1.text ? 4 : 2
			for (;;) {
				if (!s.next)
					break
				s = s.next
				if (s.rbstop)
					break
				if (s.type != BAR)
					continue
				if ((s.bar_type.length > 1	/* if complex bar */
				   && s.bar_type != "[]")
				  || s.bar_type == "]"
				  || s.text)			// repeat bar
					break
				if (--i <= 0) {

					/* have a shorter repeat bracket */
					s = s1;
					i = 2
					for (;;) {
						s = s.next
						if (s.type != BAR)
							continue
						if (--i <= 0)
							break
					}
					s.rbstop = true
					break
				}
			}
			y2 = y_get(p_voice.st, true, s1.x, s.x - s1.x)
			if (y < y2)
				y = y2

			/* have room for the repeat numbers */
			if (s1.text) {
				w = strw(s1.text);
				y2 = y_get(p_voice.st, true, s1.x + 4, w);
				y2 += gene.curfont.size + 2
				if (y < y2)
					y = y2
			}
			if (s.text)			// repeat bar
				s = s.prev
		}

		/* draw the repeat indications */
		s = first_repeat
		if (!s)
			continue
//		output = staff_tb[p_voice.st].output;
		set_dscale(p_voice.st);
		set_font("repeat");
		y2 =  y * staff_tb[p_voice.st].staffscale
		for ( ; s; s = s.next) {
			if (s.type != BAR
			 || !s.text			// not a repeat bar
			 || s.norepbra)
				continue
			s1 = s
			for (;;) {
				if (!s.next)
					break
				s = s.next
				if (s.rbstop)
					break
				if (s.type != BAR)
					continue
				if ((s.bar_type.length > 1	/* if complex bar */
				  && s.bar_type != "[]")
				 || s.bar_type == "]"
				 || s.text)			// repeat bar
					break
			}
			s2 = s
			if (s1 == s2)
				break
			x = s1.x;
//			if (s1.bar_type[0] == ":")
//				x -= 4;
			i = 0				/* no bracket end */
			if (s2.rbstop) {
				w = 8			/* (w = left shift) */
			} else if (s2.type != BAR) {
				w = s2.x - realwidth + 4
			} else if ((s2.bar_type.length > 1	/* if complex bar */
				 && s2.bar_type != "[]")
				|| s2.bar_type == "]") {
				i = 2			/* bracket start and stop */
/*fixme:%%staves: cur_sy moved?*/
				if (s.st > 0
				 && !(cur_sy.staves[s.st - 1].flags & STOP_BAR)) {
					w = s2.wl
				} else if (s2.bar_type[s2.bar_type.length - 1] == ":") {
					w = 12
				} else if (s2.bar_type[0] != ':'
					|| s2.bar_type == "]") {
					w = 0		/* explicit repeat end */

					/* if ']', don't display as thick bar */
					if (s2.bar_type == "]")
						s2.invisible = true
				} else {
					w = 8
				}
			} else {
				w = 8
			}
			w = (s2.x - x - w) / staff_tb[p_voice.st].staffscale;
			p = s1.text
			if (!p) {
				i--;		/* no bracket start (1) or not drawn */
				p = ""
			}
			if (i == 0 && !s2.next	/* 2nd ending at end of line */
			 && !s2.rbstop) {
				if (!p_voice.bar_start)
					repnl = s1	/* continue on next line */
			}
			if (i >= 0) {
				xy_str(x + 4, y2 - gene.curfont.size * 0.9, p);
				xypath(x, y2);
				if (i != 1)
					output.push('m0 20v-20');
				output.push('h');
				output.push(w.toFixed(2))
				if (i != 0)
					output.push('v20');
				output.push('"/>\n');
				y_set(s1.st, true, x, w, y + 2)
			}
			if (s.text)			// repeat bar
				s = s.prev
		}
		if (repnl) {
			p_voice.bar_start = clone(repnl);
			p_voice.bar_start.bar_type = "[";
			p_voice.bar_start.text = ""
			delete p_voice.bar_start.a_gch
		}
	}

	/* create the decorations tied to the staves */
	for (i = 0; i <= nstaff; i++)
		minmax[i] = {
			ymin: 0,
			ymax: 0
		}
	n = a_de.length
	for (i = 0; i < n; i++) {
		de = a_de[i];
		dd = de.dd
		if (dd.func < 6)		/* if not tied to the staff */
			continue
		func_tb[dd.func](de)
		if (dd.ldst)
			continue
		if (cfmt.dynalign) {
			if (de.flags.up) {
				if (de.y > minmax[de.st].ymax)
					minmax[de.st].ymax = de.y
			} else {
				if (de.y < minmax[de.st].ymin)
					minmax[de.st].ymin = de.y
			}
		}
	}

	/* and, if wanted, set them at a same vertical offset */
	for (i = 0; i < n; i++) {
		de = a_de[i];
		dd = de.dd
		if (dd.ldst
		 || dd.func < 6)
			continue
		if (cfmt.dynalign) {
			if (de.flags.up)
				y = minmax[de.st].ymax
			else
				y = minmax[de.st].ymin;
			de.y = y
		} else {
			y = de.y
		}
		if (de.flags.up)
			y += dd.h;
		y_set(de.st, de.flags.up, de.x, de.val, y)
	}
}

/* -- draw the measure bar numbers -- */
// delayed output
function draw_measnb() {
	var	s, st, bar_num, x, y, w, h, any_nb, font_size,
		sy = cur_sy

	/* search the first staff */
	for (st = 0; st <= nstaff; st++) {
		if (!sy.staves[st].empty)
			break
	}
	if (st > nstaff)
		return				/* no visible staff */
//	output = staff_tb[st].output
	set_dscale(st)

	/* leave the measure numbers as unscaled */
	if (staff_tb[st].staffscale != 1) {
		font_size = get_font("measure").size;
		param_set_font("measurefont", "* " +
			(font_size / staff_tb[st].staffscale).toString())
	}
	set_font("measure");

	s = tsfirst;				/* clef */
	bar_num = gene.nbar
	if (bar_num > 1) {
		if (cfmt.measurenb == 0) {
			any_nb = true;
			y = y_get(st, true, 0, 20)
			if (y < staff_tb[st].topbar + 14)
				y = staff_tb[st].topbar + 14;
			xy_str(0, y, bar_num.toString());
			y_set(st, true, 0, 20, y + gene.curfont.size + 2)
		} else if (bar_num % cfmt.measurenb == 0) {
			for ( ; ; s = s.ts_next) {
				switch (s.type) {
				case METER:
				case CLEF:
				case KEY:
				case FORMAT:
				case STBRK:
					continue
				}
				break
			}
			while (s.st != st)
				s = s.ts_next
			if (s.prev.type != CLEF)
				s = s.prev;
			x = s.x - s.wl;
			any_nb = true;
			w = cwid('0') * gene.curfont.swfac
			if (bar_num >= 10) {
				if (bar_num >= 100)
					w *= 3
				else
					w *= 2
			}
			if (cfmt.measurebox)
				w += 4;
			y = y_get(st, true, x, w)
			if (y < staff_tb[st].topbar + 6)
				y = staff_tb[st].topbar + 6;
			y += 2;
			xy_str(x, y, bar_num.toString())
			if (cfmt.measurebox) {
				h = gene.curfont.size + 3;
				w += 3;
				xybox(x - 1, y - 3 + h, w, h)
			}
			y += gene.curfont.size;
			y_set(st, true, x, w, y);
			s.ymx = y
		}
	}

	for ( ; s; s = s.ts_next) {
		if (s.new_sy) {
			sy = sy.next
			for (st = 0; st < nstaff; st++) {
				if (!sy.staves[st].empty)
					break
			}
			set_sscale(st)
		}
		if (s.type != BAR || !s.bar_num)
			continue

		bar_num = s.bar_num
		if (cfmt.measurenb == 0
		 || (bar_num % cfmt.measurenb) != 0
		 || !s.next)
			continue
		if (!any_nb)
			any_nb = true;
		w = cwid('0') * gene.curfont.swfac
		if (bar_num >= 10) {
			if (bar_num >= 100)
				w *= 3
			else
				w *= 2
		}
		if (cfmt.measurebox)
			w += 4;
		x = s.x - w * 0.4;
		y = y_get(st, true, x, w)
		if (y < staff_tb[st].topbar + 6)
			y = staff_tb[st].topbar + 6
//fixme: can s.next be null?
		if (s.next.type == NOTE) {
//		if (s.next && s.next.type == NOTE) {
			if (s.next.stem > 0) {
				if (y < s.next.ys - gene.curfont.size)
					y = s.next.ys - gene.curfont.size
			} else {
				if (y < s.next.y)
					y = s.next.y
			}
		}
		y += 2;
		xy_str(x, y, bar_num.toString())
		if (cfmt.measurebox) {
			h = gene.curfont.size + 3;
			w += 3;
			xybox(x - 1, y - 3 + h, w, h)
		}
		y += gene.curfont.size;
		y_set(st, true, x, w, y);
		s.ymx = y
	}
	gene.nbar = bar_num;

	if (font_size)
		param_set_font("measurefont", "* " + font_size.toString());
}

/* -- get the beat from a time signature -- */
//function get_beat(a_meter) {
//	var top, bot
//	if (a_meter.length == 0)
//		return BASE_LEN / 4
//	if (a_meter[0].top[0] == 'C') {
//		if (a_meter[0].top[0] == '|')
//			return BASE_LEN / 2
//		return BASE_LEN / 4
//	}
//	if (!a_meter[0].bot)
//		return BASE_LEN / 4
//	top = Number(a_meter[0].top)
//	bot = Number(a_meter[0].bot)
//	if (bot >= 8 && top >= 6 && top % 3 == 0)
//		return BASE_LEN * 3 / 8
//	return BASE_LEN / bot
//}

/* -- draw the note of the tempo -- */
function draw_notempo(s, x, y, dur, sc) {
	var	dx, p, dotx,
		elts = identify_note(s, dur),
		head = elts[0],
		dots = elts[1],
		nflags = elts[2]

	// protection against end of container
	if (stv_g.started) {
		output.push("</g>\n");
		stv_g.started = false
	}

	output.push('<g transform="translate(');
	out_sxsy(x + 8,  ',', y + 3);
	output.push(') scale(' + sc + ')">\n')
	switch (head) {
	case "oval":
		p = "HD"
		break
	case "empty":
		p = "Hd"
		break
	default:
		p = "hd"
		break
	}
	xygl(-posx, posy, p);
	dx = 4
	if (dots) {
		dotx = 8
		if (nflags > 0)
			dotx += 4
		switch (head) {
		case "square":
		case "oval":
			dotx += 2
			break
		case "empty":
			dotx += 1
			break
		}
		dx = dotx * dots;
		dotx -= posx
		while (--dots >= 0) {
			out_dot(dotx, posy);
			dotx += 3.5
		}
	}
	if (dur < BASE_LEN) {
		if (nflags <= 0) {
			out_stem(-posx, posy, 21)		// stem height
		} else {
			out_stem(-posx, posy, 21, false, nflags)
			if (dx < 6)
				dx = 6
		}
	}
	output.push('\n</g>\n')
	return (dx + 15) * sc
}

/* -- estimate the tempo width -- */
function tempo_width(s) {
	var	i, n, w = 0;

	set_font("tempo")
	if (s.tempo_str1)
		w = strw(s.tempo_str1)
	if (s.tempo_value) {
		i = 1;
		n = s.tempo_notes.length
		while (i < n) {
			w += 10;
			i++
		}
		w += 6 + cwid(' ') * gene.curfont.swfac * 6 + 10 + 10
	}
	if (s.tempo_str2)
		w += strw(s.tempo_str2)
	return w
}

/* - output a tempo --*/
function write_tempo(s, x, y,
			sc) {
	var	j, n, top, bot, dx, res;

	set_font("tempo")
	if (s.tempo_str1) {
		xy_str(x, y, s.tempo_str1);
		x += strw(s.tempo_str1) + 6
	}
	if (s.tempo_value) {
		sc *= 0.7 * gene.curfont.size / 15.0;
						/*fixme: 15.0 = initial tempofont*/
//		if (s.tempo_notes.length == 0) {
//			if (beat == 0)
//				beat = get_beat(voice_tb[cur_sy.top_voice].meter.a_meter);
//			s.tempo_notes[0] = beat
//		}
		n = s.tempo_notes.length
		for (j = 0; j < n; j++)
			x += draw_notempo(s, x, y, s.tempo_notes[j], sc);
		x += 5;
		xy_str(x, y, "=");
		x += strw("= ") + 5
		if (s.tempo_value.indexOf('/') < 0) {
			xy_str(x, y, s.tempo_value.toString());
			dx = cwid('0') * gene.curfont.swfac;
			x += dx + 5;
			if (s.tempo_value >= 10) {
				x += dx
				if (s.tempo_value >= 100)
					x += dx
			}
		} else {
//--fixme: could be an array of notes...
			res = s.tempo_value.split('/')
			if (res.length == 2 && Number(res[1]) > 0)
				draw_notempo(s, x, y, res[0] * BASE_LEN / res[1], sc)
		}
	}
	if (s.tempo_str2)
		xy_str(x, y, s.tempo_str2)
}

/* -- draw the parts and the tempo information -- */
/* (the staves are being defined) */
function draw_partempo(st, top) {
	var	s, g, some_part, some_tempo, h, w, y,
//		beat, 
		dy = 0,		/* put the tempo indication at top */
		ht = 0

	/* get the minimal y offset */
	var	ymin = staff_tb[st].topbar + 12,
		dosh = 0,
		shift = 1,
		x = 0
	for (s = tsfirst; s; s = s.ts_next) {
		g = s.extra
		if (!g)
			continue
		for ( ; g; g = g.next)
			if (g.type == TEMPO)
				break
		if (!g)
			continue
		if (!some_tempo)
			some_tempo = true;
		w = tempo_width(g);
		y = y_get(st, true, s.x - 5, w) + 2
		if (y > ymin)
			ymin = y;
		if (x >= s.x - 5 && !(dosh & (shift >> 1)))
			dosh |= shift;
		shift <<= 1;
		x = s.x - 5 + w
	}
	if (some_tempo) {
		set_font("tempo");
		ht = gene.curfont.size + 2 + 2;
		y = 2 - ht;
		h = y - ht
		if (dosh != 0)
			ht *= 2
		if (top < ymin + ht)
			dy = ymin + ht - top;

		/* draw the tempo indications */
//		beat = 0
		for (s = tsfirst; s; s = s.ts_next) {
			if (!s.seqst)
				continue
//			if (s.type == METER)
//				beat = get_beat(s.a_meter);
			g = s.extra
			for ( ; g; g = g.next)
				if (g.type == TEMPO)
					break
			if (!g)
				continue
			if (user.anno_start || user.anno_stop) {
				g.x = s.x;
				g.wl = 5;
				g.wr = 40;
				g.ymn = (dosh & 1) ? h : y;
				g.ymx = g.ymn + 14
				if (user.anno_start)
					anno_start(g)
			}
			/*fixme: cf left shift (-5)*/
			write_tempo(g, s.x - 5, (dosh & 1) ? h : y,
//					beat,
					1)
			if (user.anno_stop)
				anno_stop(g);
			dosh >>= 1
		}
	}

	/* then, put the parts */
/*fixme: should reduce vertical space if parts don't overlap tempo...*/
	ymin = staff_tb[st].topbar + 14
	for (s = tsfirst; s; s = s.ts_next) {
		g = s.extra
		if (!g)
			continue
		for (; g; g = g.next)
			if (g.type == PART)
				break
		if (!g)
			continue
		if (!some_part) {
			some_part = true;
			set_font("parts");
			h = gene.curfont.size + 2 + 2
						/* + cfmt.partsspace ?? */
		}
		w = strw(g.text);
		y = y_get(st, true, s.x - 10, w + 15) + 5
		if (ymin < y)
			ymin = y
	}
	if (some_part) {
		if (top < ymin + h + ht)
			dy = ymin + h + ht - top

		for (s = tsfirst; s; s = s.ts_next) {
			g = s.extra
			if (!g)
				continue
			for (; g; g = g.next)
				if (g.type == PART)
					break
			if (!g)
				continue
			if (user.anno_start || user.anno_stop) {
				g.x = s.x - 10;
				w = strw(g.text);
				g.wl = 0;
				g.wr = w;
				g.ymn = 2 - ht - h
				g.ymx = g.ymn + h
				if (user.anno_start)
					anno_start(g)
			}
			xy_str(s.x - 10, 2 - ht - h, g.text)
			if (cfmt.partsbox) {
				w = strw(g.text) + 4;
				xybox(s.x - 10 - 2, 2 - ht - 4, w, h)
			}
			if (user.anno_stop)
				anno_stop(g)
		}
	}
	return dy
}
// abc2svg - draw.js - draw functions
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

// constants
const	STEM_MIN	= 16,	/* min stem height under beams */
	STEM_MIN2	= 14,	/* ... for notes with two beams */
	STEM_MIN3	= 12,	/* ... for notes with three beams */
	STEM_MIN4	= 10,	/* ... for notes with four beams */
	STEM_CH_MIN	= 14,	/* min stem height for chords under beams */
	STEM_CH_MIN2	= 10,	/* ... for notes with two beams */
	STEM_CH_MIN3	= 9,	/* ... for notes with three beams */
	STEM_CH_MIN4	= 9,	/* ... for notes with four beams */
	BEAM_DEPTH	= 3.2,	/* width of a beam stroke */
	BEAM_OFFSET	= 0.25,	/* pos of flat beam relative to staff line */
	BEAM_SHIFT	= 5.0,	/* shift of second and third beams */
	BEAM_FLATFAC	= 0.6,	/* factor to decrease slope of long beams */
	BEAM_THRESH	= 0.06,	/* flat beam if slope below this threshold */
	BEAM_SLOPE	= 0.5,	/* max slope of a beam */
	BEAM_STUB	= 6.0,	/* length of stub for flag under beam */ 
	SLUR_SLOPE	= 1.0,	/* max slope of a slur */
	GSTEM		= 14,	/* grace note stem length */
	GSTEM_XOFF	= 1.6	/* x offset for grace note stem */

/* -- compute the best vertical offset for the beams -- */
function b_pos(grace, stem, nflags, b) {
	var	top, bot, d1, d2,
		shift = !grace ? BEAM_SHIFT : 3,
		depth = !grace ? BEAM_DEPTH : 1.7

	/* -- up/down shift needed to get k*6 -- */
	function rnd6(y) {
		var iy = Math.round((y + 12) / 6) * 6 - 12
		return iy - y
	}

	if (stem > 0) {
		bot = b - (nflags - 1) * shift - depth
		if (bot > 26)
			return 0
		top = b
	} else {
		top = b + (nflags - 1) * shift + depth
		if (top < -2)
			return 0
		bot = b
	}

	d1 = rnd6(top - BEAM_OFFSET);
	d2 = rnd6(bot + BEAM_OFFSET)
	if (d1 * d1 > d2 * d2)
		return d2
	return d1
}

/* duplicate a note for beaming continuation */
function sym_dup(s_orig) {
	var	m, note,
		s = clone(s_orig);
	s.invisible = true
	delete s.text
	delete s.a_gch
	delete s.a_ly
	delete s.a_dd;
	s.notes = clone(s_orig.notes)
	for (m = 0; m <= s.nhd; m++) {
		note = s.notes[m] = clone(s_orig.notes[m])
		delete note.a_dcn
	}
	return s
}

/* -- calculate a beam -- */
/* (the staves may be defined or not) */
const min_tb = [
	[STEM_MIN, STEM_MIN,
		STEM_MIN2, STEM_MIN3, STEM_MIN4, STEM_MIN4],
	[STEM_CH_MIN, STEM_CH_MIN,
		STEM_CH_MIN2, STEM_CH_MIN3, STEM_CH_MIN4, STEM_CH_MIN4]
]

function calculate_beam(bm, s1) {
	var	s, s2, notes, nflags, st, v, two_staves, two_dir, hh,
		x, y, ys, a, b, stem_err, max_stem_err,
		sx, sy, sxx, sxy, syy, a0, stem_xoff, scale

//	/* must have one printed note head */
//	if (s1.invisible) {
//		if (!s1.next
//		 || s1.next.invisible)
//			return false
//	}

	if (!s1.beam_st) {	/* beam from previous music line */
		s = sym_dup(s1);
		s.prev = s1.prev
		if (s.prev)
			s.prev.next = s
		else
			voice_tb[s.v].sym = s;
		s1.prev = s;
		s.next = s1;
		s1.ts_prev.ts_next = s;
		s.ts_prev = s1.ts_prev;
		s1.ts_prev = s;
		s.ts_next = s1;
		s.x -= 12
		if (s.x > s1.prev.x + 12)
			s.x = s1.prev.x + 12;
		s.beam_st = true
		delete s.beam_end;
		s.tmp = true;
		s.slur_start = 0
		delete s.slur_end;
		s1 = s
	}

	/* search last note in beam */
	notes = nflags = 0;	/* set x positions, count notes and flags */
	two_staves = two_dir = false;
	st = s1.st;
	v = s1.v;
	stem_xoff = s1.grace ? GSTEM_XOFF : 3.5
	for (s2 = s1;  ;s2 = s2.next) {
		if (s2.type == NOTE) {
			if (s2.nflags > nflags)
				nflags = s2.nflags
			notes++
			if (s2.st != st)
				two_staves = true
			if (s2.stem != s1.stem)
				two_dir = true
			if (s2.beam_end)
				break
		}
		if (!s2.next) {		/* beam towards next music line */
			for (; ; s2 = s2.prev) {
				if (s2.type == NOTE)
					break
			}
			s = sym_dup(s2);
			s.next = s2.next
			if (s.next)
				s.next.prev = s;
			s2.next = s;
			s.prev = s2;
			s.ts_next = s2.ts_next
			if (s.ts_next)
				s.ts_next.ts_prev = s;
			s2.ts_next = s;
			s.ts_prev = s2
			delete s.beam_st
			s.beam_end = true;
			s.tmp = true
			delete s.slur_start
			delete s.slur_end
			s.x += 12
			if (s.x < realwidth - 12)
				s.x = realwidth - 12;
			s2 = s;
			notes++
			break
		}
	}
	bm.s2 = s2			/* (don't display the flags) */
	if (staff_tb[st].y == 0) {	/* staves not defined */
		if (two_staves)
			return false
	} else {			/* staves defined */
		if (!two_staves && !s1.grace) {
			bm.s1 = s1;	/* beam already calculated */
			bm.a = (s1.ys- s2.ys) / (s1.xs - s2.xs);
			bm.b = s1.ys - s1.xs * bm.a + staff_tb[st].y;
			bm.nflags = nflags
			return true
		}
	}

	sx = sy = sxx = sxy = syy = 0	/* linear fit through stem ends */
	for (s = s1; ; s = s.next) {
		if (s.type != NOTE)
			continue
		if ((scale = voice_tb[s.v].scale) == 1)
			scale = staff_tb[s.st].staffscale
		if (s.stem >= 0)
			x = stem_xoff + s.notes[0].shhd
		else
			x = -stem_xoff + s.notes[s.nhd].shhd;
		x *= scale;
		x += s.x;
		s.xs = x;
		y = s.ys + staff_tb[s.st].y;
		sx += x; sy += y;
		sxx += x * x; sxy += x * y; syy += y * y
		if (s == s2)
			break
	}

	/* beam fct: y=ax+b */
	a = (sxy * notes - sx * sy) / (sxx * notes - sx * sx);
	b = (sy - a * sx) / notes

	/* the next few lines modify the slope of the beam */
	if (!s1.grace) {
		if (notes >= 3) {
			hh = syy - a * sxy - b * sy /* flatten if notes not in line */
			if (hh > 0
			 && hh / (notes - 2) > .5)
				a *= BEAM_FLATFAC
		}
		if (a >= 0)
			a = BEAM_SLOPE * a / (BEAM_SLOPE + a)	/* max steepness for beam */
		else
			a = BEAM_SLOPE * a / (BEAM_SLOPE - a)
	} else {
		if (a > BEAM_SLOPE)
			a = BEAM_SLOPE
		else if (a < -BEAM_SLOPE)
			a = -BEAM_SLOPE
	}

	/* to decide if to draw flat etc. use normalized slope a0 */
	a0 = a * (s2.xs - s1.xs) / (20 * (notes - 1))

	if (a0 * a0 < BEAM_THRESH * BEAM_THRESH)
		a = 0;			/* flat below threshhold */

	b = (sy - a * sx) / notes	/* recalculate b for new slope */

/*  if (nflags>1) b=b+2*stem*/	/* leave a bit more room if several beams */

	/* have flat beams when asked */
	if (cfmt.flatbeams) {
		if (!s1.grace)
			b = -11 + staff_tb[st].y
		else
			b = 35 + staff_tb[st].y;
		a = 0
	}

/*fixme: have a look again*/
	/* have room for the symbols in the staff */
	max_stem_err = 0;		/* check stem lengths */
	s = s1
	if (two_dir) {				/* 2 directions */
/*fixme: more to do*/
		if (!s1.grace)
			ys = BEAM_SHIFT
		else
			ys = 3;
		ys *= nflags - 1;
		ys += BEAM_DEPTH;
		ys *= .5
		if (s1.stem != s2.stem && s1.nflags < s2.nflags)
			ys *= s2.stem
		else
			ys *= s1.stem
		b += ys
	} else if (!s1.grace) {		/* normal notes */
		var beam_h = BEAM_DEPTH + BEAM_SHIFT * (nflags - 1)
//--fixme: added for abc2svg
		while (s.ts_prev
		    && s.ts_prev.type == NOTE
		    && s.ts_prev.time == s.time
		    && s.ts_prev.x > s1.xs)
			s = s.ts_prev

		for (; s && s.time <= s2.time; s = s.ts_next) {
			if (s.type != NOTE
			 || s.invisible
			 || (s.st != st
			  && s.v != v)) {
				continue
			}
			x = s.v == v ? s.xs : s.x;
			ys = a * x + b - staff_tb[s.st].y
			if (s.v == v) {
				if (s.nhd == 0)
					stem_err = min_tb[0][s.nflags]
				else
					stem_err = min_tb[1][s.nflags]
				if (s.stem > 0) {
					if (s.notes[s.nhd].pit > 26) {
						stem_err -= 2
						if (s.notes[s.nhd].pit > 28)
							stem_err -= 2
					}
					stem_err -= ys - 3 * (s.notes[s.nhd].pit - 18)
				} else {
					if (s.notes[0].pit < 18) {
						stem_err -= 2
						if (s.notes[0].pit < 16)
							stem_err -= 2
					}
					stem_err -= 3 * (s.notes[0].pit - 18) - ys
				}
				stem_err += BEAM_DEPTH + BEAM_SHIFT * (s.nflags - 1)
			} else {
/*fixme: KO when two_staves*/
				if (s1.stem > 0) {
					if (s.stem > 0) {
/*fixme: KO when the voice numbers are inverted*/
						if (s.ymn > ys + 4
						 || s.ymx < ys - beam_h - 2)
							continue
						if (s.v > v)
							stem_err = s.ymx - ys
						else
							stem_err = s.ymn + 8 - ys
					} else {
						stem_err = s.ymx - ys
					}
				} else {
					if (s.stem < 0) {
						if (s.ymx < ys - 4
						 || s.ymn > ys - beam_h - 2)
							continue
						if (s.v < v)
							stem_err = ys - s.ymn
						else
							stem_err = ys - s.ymx + 8
					} else {
						stem_err = ys - s.ymn
					}
				}
				stem_err += 2 + beam_h
			}
			if (stem_err > max_stem_err)
				max_stem_err = stem_err
		}
	} else {				/* grace notes */
		for ( ; ; s = s.next) {
			ys = a * s.xs + b - staff_tb[s.st].y;
			stem_err = GSTEM - 2
			if (s.stem > 0)
				stem_err -= ys - (3 * (s.notes[s.nhd].pit - 18))
			else
				stem_err += ys - (3 * (s.notes[0].pit - 18));
			stem_err += 3 * (s.nflags - 1)
			if (stem_err > max_stem_err)
				max_stem_err = stem_err
			if (s == s2)
				break
		}
	}

	if (max_stem_err > 0)		/* shift beam if stems too short */
		b += s1.stem * max_stem_err

	/* have room for the gracenotes, bars and clefs */
/*fixme: test*/
    if (!two_staves && !two_dir)
	for (s = s1.next; ; s = s.next) {
		var g
		switch (s.type) {
		case REST:		/* cannot move rests in multi-voices */
			g = s.ts_next
			if (!g || g.st != st
			 || (g.type != NOTE && g.type != REST))
				break
//fixme:too much vertical shift if some space above the note
//fixme:this does not fix rest under beam in second voice (ts_prev)
			/*fall thru*/
		case BAR:
			if (s.invisible)
				break
			/*fall thru*/
		case CLEF:
			y = a * s.x + b
			if (s1.stem > 0) {
				y = s.ymx - y
					+ BEAM_DEPTH + BEAM_SHIFT * (nflags - 1)
					+ 2
				if (y > 0)
					b += y
			} else {
				y = s.ymn - y
					- BEAM_DEPTH - BEAM_SHIFT * (nflags - 1)
					- 2
				if (y < 0)
					b += y
			}
			break
		case GRACE:
			g = s.extra
			for ( ; g; g = g.next) {
				if (g.type != NOTE)
					continue
				y = a * g.x + b
				if (s1.stem > 0) {
					y = g.ymx - y
						+ BEAM_DEPTH + BEAM_SHIFT * (nflags - 1)
						+ 2
					if (y > 0)
						b += y
				} else {
					y = g.ymn - y
						- BEAM_DEPTH - BEAM_SHIFT * (nflags - 1)
						- 2
					if (y < 0)
						b += y
				}
			}
			break
		}
		if (s == s2)
			break
	}

	if (a == 0)		/* shift flat beams onto staff lines */
		b += b_pos(s1.grace, s1.stem, nflags,
				b - staff_tb[st].y)

	/* adjust final stems and rests under beam */
	for (s = s1; ; s = s.next) {
		var dy

		switch (s.type) {
		case NOTE:
			s.ys = a * s.xs + b - staff_tb[s.st].y
			if (s.stem > 0) {
				s.ymx = s.ys + 2.5
//fixme: hack
				if (s.ts_prev
				 && s.ts_prev.stem > 0
				 && s.ts_prev.st == s.st
				 && s.ts_prev.ymn < s.ymx
				 && s.ts_prev.x == s.x
				 && s.notes[0].shhd == 0) {
					s.ts_prev.x -= 5;	/* fix stem clash */
					s.ts_prev.xs -= 5
				}
			} else {
				s.ymn = s.ys - 2.5
			}
			break
		case REST:
			y = a * s.x + b - staff_tb[s.st].y
			dy = BEAM_DEPTH + BEAM_SHIFT * (nflags - 1)
				+ (s.head != "full" ? 4 : 9)
			if (s1.stem > 0) {
				y -= dy
				if (s1.multi == 0 && y > 12)
					y = 12
				if (s.y <= y)
					break
			} else {
				y += dy
				if (s1.multi == 0 && y < 12)
					y = 12
				if (s.y >= y)
					break
			}
			if (s.head != "full")
				y = Math.floor((y + 3 + 12) / 6) * 6 - 12;
			s.y = y
			break
		}
		if (s == s2)
			break
	}

	/* save beam parameters */
	if (staff_tb[st].y == 0)	/* if staves not defined */
		return false
	bm.s1 = s1;
	bm.a = a;
	bm.b = b;
	bm.nflags = nflags
	return true
}

/* -- draw the beams for one word -- */
/* (the staves are defined) */
function draw_beams(bm) {
	var	s, i, beam_dir, shift, bshift, bstub, bh, da,
		k, k1, k2, x1,
		s1 = bm.s1,
		s2 = bm.s2

	/* -- draw a single beam -- */
	function draw_beam(x1, x2, dy, h, bm,
				 n) {		/* beam number (1..n) */
		var	y1, dy2,
			s = bm.s1,
			nflags = s.nflags
		if (s.ntrem)
			nflags -= s.ntrem
		if (s.trem2 && n > nflags) {
			if (s.dur >= BASE_LEN / 2) {
				x1 = s.x + 6;
				x2 = bm.s2.x - 6
			} else if (s.dur < BASE_LEN / 4) {
				x1 += 5;
				x2 -= 6
			}
		}

		y1 = bm.a * x1 + bm.b - dy;
		x2 -= x1;
	//--fixme: scale (bm.a already scaled!)
		x2 /= stv_g.scale;
		dy2 = bm.a * x2 * stv_g.scale;
		xypath(x1, y1, true);
		output.push('l' + x2.toFixed(2) + ' ' + (-dy2).toFixed(2) +
			'v' + h.toFixed(2) +
			'l' + (-x2).toFixed(2) + ' ' + dy2.toFixed(2) +
			'"/>\n')
	}

/*fixme: KO if many staves with different scales*/
//	set_scale(s1)
	if (!s1.grace) {
		bshift = BEAM_SHIFT;
		bstub = BEAM_STUB;
		shift = .34;		/* (half width of the stem) */
		bh = BEAM_DEPTH
	} else {
		bshift = 3;
		bstub = 3.2;
		shift = .29;
		bh = 1.6
	}

/*fixme: quick hack for stubs at end of beam and different stem directions*/
	beam_dir = s1.stem
	if (s1.stem != s2.stem
	 && s1.nflags < s2.nflags)
		beam_dir = s2.stem
	if (beam_dir < 0)
		bh = -bh;

	/* make first beam over whole word and adjust the stem lengths */
	draw_beam(s1.xs - shift, s2.xs + shift, 0., bh, bm, 1);
	da = 0
	for (s = s1; ; s = s.next) {
		if (s.type == NOTE
		 && s.stem != beam_dir)
			s.ys = bm.a * s.xs + bm.b
				- staff_tb[s.st].y
				+ bshift * (s.nflags - 1) * s.stem
				- bh
		if (s == s2)
			break
	}

	if (s1.feathered_beam) {
		da = bshift / (s2.xs - s1.xs)
		if (s1.dur > s2.dur) {
			da = -da;
			bshift = da * s1.xs
		} else {
			bshift = da * s2.xs
		}
		da = da * beam_dir
	}

	/* other beams with two or more flags */
	shift = 0
	for (i = 2; i <= bm.nflags; i++) {
		shift += bshift
		if (da != 0)
			bm.a += da
		for (s = s1; ; s = s.next) {
			if (s.type != NOTE
			 || s.nflags < i) {
				if (s == s2)
					break
				continue
			}
			if (s.trem1
			 && i > s.nflags - s.ntrem) {
//				if (s.head == "oval" || s.head == "square")
				if (s.dur >= BASE_LEN / 2)
					x1 = s.x
				else
					x1 = s.xs;
				draw_beam(x1 - 5, x1 + 5,
					  (shift + 2.5) * beam_dir,
					  bh, bm, i)
				if (s == s2)
					break
				continue
			}
			k1 = s
			while (1) {
				if (s == s2)
					break
				k = s.next
				if (k.type == NOTE || k.type == REST) {
					if (k.trem1){
						if (k.nflags - k.ntrem < i)
							break
					} else if (k.nflags < i) {
						break
					}
				}
				if (k.beam_br1
				 || (k.beam_br2 && i > 2))
					break
				s = k
			}
			k2 = s
			while (k2.type != NOTE)
				k2 = k2.prev;
			x1 = k1.xs
			if (k1 == k2) {
				if (k1 == s1) {
					x1 += bstub
				} else if (k1 == s2) {
					x1 -= bstub
				} else if (k1.beam_br1
				        || (k1.beam_br2
					 && i > 2)) {
					x1 += bstub
				} else {
					k = k1.next
					while (k.type != NOTE)
						k = k.next
					if (k.beam_br1
					 || (k.beam_br2 && i > 2)) {
						x1 -= bstub
					} else {
						k1 = k1.prev
						while (k1.type != NOTE)
							k1 = k1.prev
						if (k1.nflags < k.nflags
						 || (k1.nflags == k.nflags
						  && k1.dots < k.dots))
							x1 += bstub
						else
							x1 -= bstub
					}
				}
			}
			draw_beam(x1, k2.xs,
				  shift * beam_dir,
				  bh, bm, i)
			if (s == s2)
				break
		}
	}
	if (s1.tmp)
		unlksym(s1)
	else if (s2.tmp)
		unlksym(s2)
}

/* -- draw the left side of the staves -- */
function draw_lstaff(x) {
	if (cfmt.alignbars)
		return
	var	i, j, yb, h,
		nst = cur_sy.nstaff,
		l = 0

	/* -- draw a system brace or bracket -- */
	function draw_sysbra(x, st, flag) {
		var i, st_end, yt, yb

		while (cur_sy.staves[st].empty) {
//fixme: new %%stafflines
//		    || staff_tb[st].stafflines == '.') {
			if (cur_sy.staves[st].flags & flag)
				return
			st++
		}
		i = st_end = st
		while (1) {
			if (!cur_sy.staves[i].empty)
//			 && staff_tb[i].stafflines != '.')
				st_end = i
			if (cur_sy.staves[i].flags & flag)
				break
			i++
		}
		yt = staff_tb[st].y + staff_tb[st].topbar
					* staff_tb[st].staffscale;
		yb = staff_tb[st_end].y + staff_tb[st_end].botbar
					* staff_tb[st_end].staffscale
		if (flag & (CLOSE_BRACE | CLOSE_BRACE2))
			out_brace(x, yb, yt - yb)
		else
			out_bracket(x, yt, yt - yb)
	}

	for (i = 0; ; i++) {
		if (cur_sy.staves[i].flags & (OPEN_BRACE | OPEN_BRACKET))
			l++
		if (!cur_sy.staves[i].empty)
//		 && staff_tb[i].stafflines != '.')
			break
		if (cur_sy.staves[i].flags & (CLOSE_BRACE | CLOSE_BRACKET))
			l--
		if (i == nst)
			break
	}
	for (j = nst; j > i; j--) {
		if (!cur_sy.staves[j].empty)
//		 && staff_tb[j].stafflines != '.')
			break
	}
	if (i == j && l == 0)
		return
	yb = staff_tb[j].y + staff_tb[j].botbar
				* staff_tb[j].staffscale;
	h = staff_tb[i].y + staff_tb[i].topbar * staff_tb[i].staffscale - yb;
	xypath(x, yb);
	output.push("v" + (-h).toFixed(2) + '"/>\n')
	for (i = 0; i <= nst; i++) {
		if (cur_sy.staves[i].flags & OPEN_BRACE)
			draw_sysbra(x, i, CLOSE_BRACE)
		if (cur_sy.staves[i].flags & OPEN_BRACKET)
			draw_sysbra(x, i, CLOSE_BRACKET)
		if (cur_sy.staves[i].flags & OPEN_BRACE2)
			draw_sysbra(x - 6, i, CLOSE_BRACE2)
		if (cur_sy.staves[i].flags & OPEN_BRACKET2)
			draw_sysbra(x - 6, i, CLOSE_BRACKET2)
	}
}

/* -- draw the time signature -- */
function draw_meter(x, s) {
	if (!s.a_meter)
		return
	var	dx, i,
		st = s.st,
		y = staff_tb[st].y;
	x -= s.wl
	for (i = 0; i < s.a_meter.length; i++) {
		var	meter = s.a_meter[i],
			f
		if (meter.top == "C|")
			dx = 13
		else
			dx = 13 * meter.top.length
		if (meter.bot) {
			if (meter.bot.length > meter.top.length)
				dx = 13 * meter.bot.length
			output.push('<g style="font:bold 16px serif"\n\
	transform="translate(');
			out_sxsy(x + dx * .5, ',', y);
			output.push(') scale(1.2,1)">\n\
	<text y="-12" text-anchor="middle">' + meter.top + '</text>\n\
	<text text-anchor="middle">' + meter.bot + '</text>\n\
</g>\n')
		} else {
			switch (meter.top[0]) {
			case 'C':
				f = meter.top[1] != '|' ? "csig" : "ctsig"
				x -= 5;
				y += 12
				break
			case 'c':
				f = meter.top[1] != '.' ? "imsig" : "iMsig"
				break
			case 'o':
				f = meter.top[1] != '.' ? "pmsig" : "pMsig"
				break
			default:
				output.push('<g style="font:bold 18px serif"\n\
	transform="translate(');
				out_sxsy(x + dx * .5, ',', y);
				output.push(') scale(1.2,1)">\n\
	<text y="-6" text-anchor="middle">' + meter.top + '</text>\n\
</g>\n')
				break
			}
		}
		if (f)
			xygl(x + dx * .5, y, f);
		x += dx
	}
}

/* -- draw an accidental -- */
function draw_acc(x, y, acc,
			micro_n,
			micro_d) {
	if (micro_n) {
		if (micro_n == micro_d) {
			if (acc == -1)		// flat
				acc = -2	// double flat
			else
				acc = 2		// double sharp
		} else if (micro_n * 2 != micro_d) {
			xygl(x, y, "acc" + acc + '_' + micro_n + '_' + micro_d)
			return
		}
	}
	xygl(x, y, "acc" + acc)
}

// draw helper lines between yl and yu
//fixme: double lines when needed for different voices
//fixme: no helper inside staff when holes
function draw_hl(x, yl, yu, st, hltype) {
	var	i,
		p_staff = staff_tb[st],
		staffb = p_staff.y,
		stafflines = p_staff.stafflines,
		top = (stafflines.length - 1) * 2 * 3;

	if (top - p_staff.botline < 4)
		return			// no helper lines when staff < 4 lines

	yl = Math.ceil(yl / 6) * 6
	for (; yl < p_staff.botline; yl += 6)
		xygl(x, staffb + yl, hltype)
	yu -= yu % 6
	for (; yu > top; yu -= 6)
		xygl(x, staffb + yu, hltype)
//	if (yl > top)
//		yl = top
//	if (yu < p_staff.botline)
//		yu = p_staff.botline;
//	for (; yl <= yu; yl += 6) {
//		if (stafflines[yl / 6] != '|')
//			xygl(x, staffb + yl, hltype)	// hole
//	}
}

/* -- draw a key signature -- */
const	sharp_cl = [24, 9, 15, 21, 6, 12, 18],
	flat_cl = [12, 18, 24, 9, 15, 21, 6],
	sharp1 = [-9, 12, -9, -9, 12, -9],
	sharp2 = [12, -9, 12, -9, 12, -9],
	flat1 = [9, -12, 9, -12, 9, -12],
	flat2 = [-12, 9, -12, 9, -12, 9]

function draw_keysig(p_voice, x, s) {
	if (s.k_none)
		return
	var	old_sf = s.k_old_sf,
		st = p_voice.st,
		staffb = staff_tb[st].y,
		i, shift, p_seq,
		clef_ix = s.k_y_clef
	if (clef_ix & 1)
		clef_ix += 7;
	clef_ix /= 2
	while (clef_ix < 0)
		clef_ix += 7;
	clef_ix %= 7

	/* normal accidentals */
//dump_obj(s)
	if (!s.k_a_acc) {

		/* put neutrals if not 'accidental cancel' */
		if (cfmt.cancelkey || s.k_sf == 0) {

			/* when flats to sharps, or sharps to flats, */
			if (s.k_sf == 0
			 || old_sf * s.k_sf < 0) {

				/* old sharps */
				shift = sharp_cl[clef_ix];
				p_seq = shift > 9 ? sharp1 : sharp2
				for (i = 0; i < old_sf; i++) {
					xygl(x, staffb + shift, "acc3");
					shift += p_seq[i];
					x += 5.5
				}

				/* old flats */
				shift = flat_cl[clef_ix]
				p_seq = shift < 18 ? flat1 : flat2
				for (i = 0; i > old_sf; i--) {
					xygl(x, staffb + shift, "acc3");
					shift += p_seq[-i];
					x += 5.5
				}
				if (s.k_sf != 0)
					x += 3		/* extra space */

			/* or less sharps or flats */
			} else if (s.k_sf > 0) {	/* sharps */
				if (s.k_sf < old_sf) {
					shift = sharp_cl[clef_ix];
					p_seq = shift > 9 ? sharp1 : sharp2
					for (i = 0; i < s.k_sf; i++)
						shift += p_seq[i]
					for (; i < old_sf; i++) {
						xygl(x, staffb + shift, "acc3");
						shift += p_seq[i];
						x += 5.5
					}
					x += 3			/* extra space */
				}
			} else {			/* flats */
				if (s.k_sf > old_sf) {
					shift = flat_cl[clef_ix];
					p_seq = shift < 18 ? flat1 : flat2
					for (i = 0; i > s.k_sf; i--)
						shift += p_seq[-i]
					for (; i > old_sf; i--) {
						xygl(x, staffb + shift, "acc3");
						shift += p_seq[-i];
						x += 5.5
					}
					x += 3			/* extra space */
				}
			}
		}

		/* new sharps */
		shift = sharp_cl[clef_ix];
		p_seq = shift > 9 ? sharp1 : sharp2
		for (i = 0; i < s.k_sf; i++) {
			xygl(x, staffb + shift, "acc1");
			shift += p_seq[i];
			x += 5.5
		}

		/* new flats */
		shift = flat_cl[clef_ix];
		p_seq = shift < 18 ? flat1 : flat2
		for (i = 0; i > s.k_sf; i--) {
			xygl(x, staffb + shift, "acc-1");
			shift += p_seq[-i];
			x += 5.5
		}
//	} else if (s.k_a_acc.length) {
	} else {

		/* explicit accidentals */
		var	acc,
			last_acc = s.k_a_acc[0].acc,
			last_shift = 100

		for (i = 0; i < s.k_a_acc.length; i++) {
			acc = s.k_a_acc[i];
			shift = (s.k_y_clef	// clef shift
				+ acc.pit - 18) * 3
			if (i != 0
			 && (shift > last_shift + 18
			  || shift < last_shift - 18))
				x -= 5.5		// no clash
			else if (acc.acc != last_acc)
				x += 3;
			last_acc = acc.acc;
			draw_hl(x, shift, shift, st, "hl");
			last_shift = shift;
			draw_acc(x, staffb + shift,
				 acc.acc, acc.micro_n, acc.micro_d);
			x += 5.5
		}
	}
}

/* -- convert the standard measure bars -- */
function bar_cnv(bar_type) {
	switch (bar_type) {
	case "[":
/*	case "]": */
	case "[]":
		return ""			/* invisible */
	case ":":
		return "|"			/* dotted */
	case "|:":
	case "|::":
	case "|:::":
		return "[" + bar_type		/* |::: -> [|::: */
	case ":|":
	case "::|":
	case ":::|":
		return bar_type + "]"		/* :..| -> :..|] */
	case "::":
		return cfmt.dblrepbar		/* :: -> double repeat bar */
	}
	return bar_type
}

/* -- draw a measure bar -- */
function draw_bar(s, bot, h) {
	var	i,
		st = s.st,
		yb = staff_tb[st].y,
		x = s.x

	/* if measure repeat, draw the '%' like glyphs */
	if (s.bar_mrep) {
		set_scale(s)
		if (s.bar_mrep == 1) {
			for (var s2 = s.prev; s2.type != REST; s2 = s2.prev)
				;
			xygl(s2.x, yb, "mrep")
		} else {
			xygl(x, yb, "mrep2")
			if (s.v == cur_sy.top_voice) {
				set_font("annotation");
				xy_str(x, yb + staff_tb[st].topbar + 4,
						s.bar_mrep.toString(), "c")
			}
		}
	}
	var	dotted = s.bar_dotted || s.bar_type == ":",
		bar_type = bar_cnv(s.bar_type)
	if (!bar_type)
		return				/* invisible */
	for (i = bar_type.length; --i >= 0; ) {
		switch (bar_type[i]) {
		case "|":
			set_sscale(-1)
			if (dotted)
				out_dotbar(x, bot, h)
			else
				out_bar(x, bot, h)
			break
		default:
//		case "[":
//		case "]":
			x -= 3;
			set_sscale(-1);
			out_thbar(x, bot, h)
			break
		case ":":
			x -= 2;
			set_sscale(st);
			xygl(x + 1, staff_tb[st].y, "rdots")
			break
		}
		x -= 3
	}
}

/* -- draw a rest -- */
/* (the staves are defined) */
const rest_tb = [
	"r128", "r64", "r32", "r16", "r8",
	"r4",
	"r2", "r1", "r0", "r00"]

function draw_rest(s) {
	var	s2, i, j, k, x, y, dotx, staffb, yb, yt,
		p_staff = staff_tb[s.st]

	/* don't display the rests of invisible staves */
	/* (must do this here for voices out of their normal staff) */
	if (p_staff.empty)
		return

	/* if rest alone in the measure, center */
	if (s.dur == voice_tb[s.v].meter.wmeasure) {

		/* don't use next/prev: there is no bar in voice averlay */
		s2 = s.ts_next
		while (s2 && s2.time != s.time + s.dur)
			s2 = s2.ts_next
		if (s2)
			x = s2.x
		else
			x = realwidth;
		s2 = s
		while (!s2.seqst)
			s2 = s2.ts_prev;
		s2 = s2.ts_prev;
		x = (x + s2.x) / 2

		/* center the associated decorations */
		if (s.a_dd)
			deco_update(s, x - s.x);
		s.x = x
	} else {
		x = s.x
		if (s.notes[0].shhd)
			x += s.notes[0].shhd * stv_g.scale
	}
	if (s.invisible)
		return

	staffb = p_staff.y			/* bottom of staff */

	if (s.repeat_n) {
		if (s.repeat_n < 0) {
			xygl(x, staffb, "srep")
		} else {
			xygl(x, staffb, "mrep")
			if (s.repeat_n > 2 && s.v == cur_sy.top_voice) {
				set_font("annotation");
				xy_str(x, staffb + 24 + 4,
					s.repeat_n.toString(), "c")
			}
		}
		return
	}

	y = s.y

	if (s.notes[0].a_dcn) {
		for (k = 0; k < note.a_dcn.length; k++) {
			draw_deco_head(s.notes[0].a_dcn[k],
					x,
					y + staffb,
					s.stem)
		}
		return
	}

	i = 5 - s.nflags		/* rest_tb index (5 = C_XFLAGS) */
	if (i == 7 && y == 12
	 && p_staff.stafflines.length <= 2)
		y -= 6				/* semibreve a bit lower */

	xygl(x, y + staffb, rest_tb[i])	/* rest */

	/* output ledger line(s) when greater than minim */
	if (i >= 6) {
		j = y / 6
		switch (i) {
		case 6:					/* minim */
			if (p_staff.stafflines[j] != '|')
				xygl(x, y + staffb, "hl")
			break
		case 7:					/* semibreve */
			if (p_staff.stafflines[j + 1] != '|')
				xygl(x, y + 6 + staffb, "hl")
			break
		default:
			if (p_staff.stafflines[j + 1] != '|')
				xygl(x, y + 6 + staffb, "hl")
			if (i == 9) {			/* longa */
				y -= 6;
				j--
			}
			if (p_staff.stafflines[j] != '|')
				xygl(x, y + staffb, "hl")
			break
		}
	}
	x += 8;
	y += staffb - 3
	for (i = 0; i < s.dots; i++) {
		out_dot(x, y);
		x += 3.5
	}
}

/* -- draw grace notes -- */
/* (the staves are defined) */
function draw_gracenotes(s) {
	var	yy, x0, y0, x1, y1, x2, y2, x3, y3, bet1, bet2,
		dy1, dy2, g, last, note,
		bm = {}

	/* draw the notes */
//	bm.s2 = undefined			/* (draw flags) */
	for (g = s.extra; g; g = g.next) {
		if (g.type != NOTE)
			continue
		if (user.anno_start)
			anno_start(s)
		if (g.beam_st && !g.beam_end) {
			if (calculate_beam(bm, g))
				draw_beams(bm)
		}
		draw_note(g, !bm.s2)
		if (g == bm.s2)
			bm.s2 = undefined		/* (draw flags again) */

		if (g.sappo) {				/* (on 1st note only) */
			if (!g.next) {			/* if one note */
				x1 = 9;
				y1 = g.stem > 0 ? 5 : -5
			} else {			/* many notes */
				x1 = (g.next.x - g.x) * .5 + 4;
				y1 = (g.ys + g.next.ys) * .5 - g.y
				if (g.stem > 0)
					y1 -= 1
				else
					y1 += 1
			}
			note = g.notes[g.stem < 0 ? 0 : g.nhd];
			out_acciac(x_head(g, note), y_head(g, note),
					x1, y1, g.stem > 0)
		}
		if (user.anno_stop)
			anno_stop(s)
		if (!g.next)
			break			/* (keep the last note) */
	}

	/* slur */
//fixme: have a full key symbol in voice
	if (voice_tb[s.v].key.k_bagpipe		/* no slur when bagpipe */
	 || !cfmt.graceslurs
	 || s.slur_start			/* explicit slur */
	 || !s.next
	 || s.next.type != NOTE)
		return
	last = g
	if (last.stem >= 0) {
		yy = 127
		for (g = s.extra; g; g = g.next) {
			if (g.type != NOTE)
				continue
			if (g.y < yy) {
				yy = g.y;
				last = g
			}
		}
		x0 = last.x;
		y0 = last.y - 5;
		if (s.extra != last) {
			x0 -= 4;
			y0 += 1
		}
		s = s.next;
		x3 = s.x - 1
		if (s.stem < 0)
			x3 -= 4;
		y3 = 3 * (s.notes[0].pit - 18) - 5;
		dy1 = (x3 - x0) * .4
		if (dy1 > 3)
			dy1 = 3;
		dy2 = dy1;
		bet1 = .2;
		bet2 = .8
		if (y0 > y3 + 7) {
			x0 = last.x - 1;
			y0 += .5;
			y3 += 6.5;
			x3 = s.x - 5.5;
			dy1 = (y0 - y3) * .8;
			dy2 = (y0 - y3) * .2;
			bet1 = 0
		} else if (y3 > y0 + 4) {
			y3 = y0 + 4;
			x0 = last.x + 2;
			y0 = last.y - 4
		}
	} else {
		yy = -127
		for (g = s.extra; g; g = g.next) {
			if (g.type != NOTE)
				continue
			if (g.y > yy) {
				yy = g.y;
				last = g
			}
		}
		x0 = last.x;
		y0 = last.y + 5
		if (s.extra != last) {
			x0 -= 4;
			y0 -= 1
		}
		s = s.next;
		x3 = s.x - 1
		if (s.stem >= 0)
			x3 -= 2;
		y3 = 3 * (s.notes[s.nhd].pit - 18) + 5;
		dy1 = (x0 - x3) * .4
		if (dy1 < -3)
			dy1 = -3;
		dy2 = dy1;
		bet1 = .2;
		bet2 = .8
		if (y0 < y3 - 7) {
			x0 = last.x - 1;
			y0 -= .5;
			y3 -= 6.5;
			x3 = s.x - 5.5;
			dy1 = (y0 - y3) * .8;
			dy2 = (y0 - y3) * .2;
			bet1 = 0
		} else if (y3 < y0 - 4) {
			y3 = y0 - 4;
			x0 = last.x + 2;
			y0 = last.y + 4
		}
	}

	x1 = bet1 * x3 + (1 - bet1) * x0 - x0;
	y1 = bet1 * y3 + (1 - bet1) * y0 - dy1 - y0;
	x2 = bet2 * x3 + (1 - bet2) * x0 - x0;
	y2 = bet2 * y3 + (1 - bet2) * y0 - dy2 - y0;

	xypath(x0, y0 + staff_tb[s.st].y);
	output.push('c' + x1.toFixed(2) + ' ' + (-y1).toFixed(2) +
		' ' + x2.toFixed(2) + ' ' + (-y2).toFixed(2) +
		' ' + (x3 - x0).toFixed(2) + ' ' + (-y3 + y0).toFixed(2) + '"/>\n')
}

/* -- set the y offset of the dots -- */
function setdoty(s, y_tb) {
	var m, m1, y

	/* set the normal offsets */
	for (m = 0; m <= s.nhd; m++) {
		y = 3 * (s.notes[m].pit - 18)	/* note height on staff */
		if ((y % 6) == 0) {
			if (s.dot_low)
				y -= 3
			else
				y += 3
		}
		y_tb[m] = y
	}
	/* dispatch and recenter the dots in the staff spaces */
	for (m = 0; m < s.nhd; m++) {
		if (y_tb[m + 1] > y_tb[m])
			continue
		m1 = m
		while (m1 > 0) {
			if (y_tb[m1] > y_tb[m1 - 1] + 6)
				break
			m1--
		}
		if (3 * (s.notes[m1].pit - 18) - y_tb[m1]
				< y_tb[m + 1] - 3 * (s.notes[m + 1].pit - 18)) {
			while (m1 <= m)
				y_tb[m1++] -= 6
		} else {
			y_tb[m + 1] = y_tb[m] + 6
		}
	}
}

// get the x and y position of a note head
// (when the staves are defined)
function x_head(s, note) {
	return s.x + note.shhd // * stv_g.scale		// ??
}
function y_head(s, note) {
	return staff_tb[s.st].y + 3 * (note.pit - 18)
}

/* -- draw m-th head with accidentals and dots -- */
/* (the staves are defined) */
// sets gener.{x,y}_note
function draw_basic_note(x, s, m, y_tb) {
	var	i, k, y, p, yy, no_head, dotx, doty,
		old_color = false,
		note = s.notes[m]
		staffb = staff_tb[s.st].y,	/* bottom of staff */
		y = 3 * (note.pit - 18),	/* note height on staff */
		shhd = note.shhd * stv_g.scale;

	x_note = x + shhd;
	y_note = y + staffb;

	/* draw the note decorations */
	no_head = 0
	if (note.a_dcn) {
		for (k = 0; k < note.a_dcn.length; k++) {
			no_head |= draw_deco_head(note.a_dcn[k],
						  x + shhd,
						  y + staffb,
						  s.stem)
		}
	}
	if (s.invisible)
		return

	/* special case for voice unison */
	if (s.nohdi1 != undefined
	 && m >= s.nohdi1 && m < s.nohdi2)
		return

	var	elts = identify_note(s, note.dur),
		head = elts[0],
		dots = elts[1],
		nflags = elts[2]

	/* output a ledger line if horizontal shift / chord
	 * and note on a line */
	if (y % 6 == 0
	 && shhd != (s.stem > 0 ? s.notes[0].shhd : s.notes[s.nhd].shhd)) {
		yy = 0
		if (y >= 30) {
			yy = y
			if (yy % 6)
				yy -= 3
		} else if (y <= -6) {
			yy = y
			if (yy % 6)
				yy += 3
		}
		if (yy)
			xygl(x_note, yy + staffb, "hl")
	}

	/* draw the head */
	if (no_head) {
		;
	} else if (note.map && note.map[0]) {
		i = -s.nflags
		if (i < 0)
			i = 0;
		p = note.map[0][i]		// heads
		if (!p)
			p = note.map[0][note.map[0].length - 1]
		i = p.indexOf('/')
		if (i >= 0) {			// stem dependant
			if (s.stem >= 0)
				p = p.slice(0, i)
			else
				p = p.slice(i + 1)
		}
	} else if (s.grace) {
		p = "ghd";
		x_note -= 4.5 * stv_g.scale
	} else if (s.type == CUSTOS) {
		p = "custos"
	} else {
		switch (head) {
		case "oval":
			if (note.dur < BASE_LEN * 2) {
				p = "HD"
				break
			}
			if (s.head != "square") {
				p = "HDD"
				break
			}
			/* fall thru */
		case "square":
			p = note.dur < BASE_LEN * 4 ? "breve" : "longa"

			/* don't display dots on last note of the tune */
			if (!tsnext && s.next
			 && s.next.type == BAR && !s.next.next)
				dots = 0
			break
		case "empty":
			p = "Hd"		// white note
			break
		default:			// black note
			p = "hd"
			break
		}
	}
	if (note.map && note.map[2])
		old_color = set_color(note.map[2])
	if (p)
		xygl(x_note, y_note, p)

	/* draw the dots */
/*fixme: to see for grace notes*/
	if (dots) {
		dotx = x + (7.7 + s.xmx) * stv_g.scale
		if (y_tb[m] == undefined) {
			y_tb[m] = 3 * (s.notes[m].pit - 18)
			if ((s.notes[m].pit & 1) == 0)
				y_tb[m] += 3
		}
		doty = y_tb[m] + staffb
		while (--dots >= 0) {
			out_dot(dotx, doty);
			dotx += 3.5
		}
	}

	/* draw the accidental */
	if (note.acc) {
//	 && !s.perc) {
		x -= note.shac * stv_g.scale
		if (!s.grace) {
			draw_acc(x, y + staffb,
				 note.acc, note.micro_n, note.micro_d)
		} else {
			output.push('<g transform="translate(');
			out_sxsy(x, ',', y + staffb);
			output.push(') scale(.7)">\n');
			stv_g.trans = true;
			draw_acc(0, 0, note.acc, note.micro_n, note.micro_d);
			stv_g.trans = false;
			output.push('</g>\n')
		}
	}
	if (old_color != false)
		set_color(old_color)
}

/* -- draw a note or a chord -- */
/* (the staves are defined) */
function draw_note(s,
		   fl) {		// draw flags
	var	s2, i, m, y, staffb, slen, c, hltype, nflags,
		x, y, note,
		y_tb = new Array(s.nhd + 1)

	if (s.dots)
		setdoty(s, y_tb)

	note = s.notes[s.stem < 0 ? s.nhd : 0];	// master note head
	x = x_head(s, note);
//?? what was this used for ??
//	if (s.head == "oval" || s.head == "square")
//		x += 1;
	staffb = staff_tb[s.st].y

	/* output the ledger lines */
	if (!s.invisible) {
		if (s.grace) {
			hltype = "ghl"
		} else {
			switch (s.head) {
			default:
				hltype = "hl"
				break
			case "oval":
				hltype = "hl1"
				break
			case "square":
				hltype = "hl2"
				break
			}
		}
		draw_hl(x, 3 * (s.notes[0].pit - 18), 3 * (s.notes[s.nhd].pit - 18),
			s.st, hltype)
	}

	/* draw the stem and flags */
	y = y_head(s, note)
	if (!s.invisible && !s.stemless) {
		slen = s.ys - s.y;
		nflags = s.nflags
		if (s.ntrem)
			nflags -= s.ntrem
		if (!fl || nflags <= 0) {	/* stem only */
			if (s.nflags > 0) {	/* (fix for PS low resolution) */
				if (s.stem >= 0)
					slen -= 1
				else
					slen += 1
			}
			out_stem(x, y, slen, s.grace)
		} else {				/* stem and flags */
			out_stem(x, y, slen, s.grace,
				 nflags, cfmt.straightflags)
		}
	} else if (s.xstem) {				/* cross-staff stem */
		s2 = s.ts_prev;
		slen = (s2.stem > 0 ? s2.y : s2.ys) - s.y;
		slen += staff_tb[s2.st].y - staffb;
/*fixme:KO when different scales*/
		slen /= voice_tb[s.v].scale;
		out_stem(x, y, slen)
	}

	/* draw the tremolo bars */
	if (!s.invisible
	 && fl
	 && s.trem1) {
		var	ntrem = s.ntrem ? s.ntrem : 0,
			x1 = x;
		slen = 3 * (s.notes[s.stem > 0 ? s.nhd : 0].pit - 18)
		if (s.head == "full" || s.head == "empty") {
			x1 += (s.grace ? GSTEM_XOFF : 3.5) * s.stem
			if (s.stem > 0)
				slen += 6 + 5.4 * ntrem
			else
				slen -= 6 + 5.4
		} else {
			if (s.stem > 0)
				slen += 5 + 5.4 * ntrem
			else
				slen -= 5 + 5.4
		}
		slen /= voice_tb[s.v].scale;
		out_trem(x1, staffb + slen, ntrem)
	}

	/* draw the note heads */
	x = s.x
	for (m = 0; m <= s.nhd; m++)
		draw_basic_note(x, s, m, y_tb)
}

/* -- find where to terminate/start a slur -- */
function next_scut(s) {
	var prev = s

	for (s = s.next; s; s = s.next) {
		if (s.type == BAR
		 && (s.bar_type[0] == ':'
			|| s.bar_type == "|]"
			|| s.bar_type == "[|"
			|| (s.text && s.text[0] != '1')))
			return s
		prev = s
	}
	/*fixme: KO when no note for this voice at end of staff */
	return prev
}

function prev_scut(s) {
	while (s.prev) {
		s = s.prev
		if (s.type == BAR
		 && (s.bar_type[0] == ':'
		  || s.bar_type == "|]"
		  || s.bar_type == "[|"
		  || (s.text && s.text[0] != '1')))
			return s
	}

	/* return a symbol of any voice starting before the start of the voice */
	s = voice_tb[s.v].sym
	while (s.type != CLEF)
		s = s.ts_prev		/* search a main voice */
	if (s.next.type == KEY)
		s = s.next
	if (s.next.type == METER)
		return s.next
	return s
}

/* -- decide whether a slur goes up or down -- */
function slur_direction(k1, k2) {
	var s, some_upstem, low

	for (s = k1; ; s = s.next) {
		if (s.type == NOTE) {
			if (!s.stemless) {
				if (s.stem < 0)
					return 1
				some_upstem = true
			}
			if (s.notes[0].pit < 22)	/* if under middle staff */
				low = true
		}
		if (s == k2)
			break
	}
	if (!some_upstem && !low)
		return 1
	return -1
}

/* -- output a slur / tie -- */
function slur_out(x1, y1, x2, y2, dir, height, dotted)
{
	var	dx, dy, dz,
		alfa = .3,
		beta = .45

	/* for wide flat slurs, make shape more square */
	dy = y2 - y1
	if (dy < 0)
		dy = -dy
	dx = x2 - x1
	if (dx > 40. && dy / dx < .7) {
		alfa = .3 + .002 * (dx - 40.)
		if (alfa > .7)
			alfa = .7
	}

	/* alfa, beta, and height determine Bezier control points pp1,pp2
	 *
	 *           X====alfa===|===alfa=====X
	 *	    /		 |	       \
	 *	  pp1		 |	        pp2
	 *	  /	       height		 \
	 *	beta		 |		 beta
	 *      /		 |		   \
	 *    p1		 m		     p2
	 *
	 */

	var	mx = .5 * (x1 + x2),
		my = .5 * (y1 + y2),
		xx1 = mx + alfa * (x1 - mx),
		yy1 = my + alfa * (y1 - my) + height;
	xx1 = x1 + beta * (xx1 - x1);
	yy1 = y1 + beta * (yy1 - y1)

	var	xx2 = mx + alfa * (x2 - mx),
		yy2 = my + alfa * (y2 - my) + height;
	xx2 = x2 + beta * (xx2 - x2);
	yy2 = y2 + beta * (yy2 - y2);

	dx = .03 * (x2 - x1);
//	if (dx > 10.)
//		dx = 10.
//	dy = 1.6 * dir
	dy = 2 * dir;
	dz = .2 + .001 * (x2 - x1)
	if (dz > .6)
		dz = .6;
	dz *= dir
	
	var scale_y = stv_g.v ? stv_g.scale : 1
	if (!dotted)
		output.push('<path class="fill" d="M')
	else
		output.push('<path class="stroke" stroke-dasharray="5,5" d="M')
	out_sxsy(x1, ' ', y1);
	output.push('c' +
		((xx1 - x1) / stv_g.scale).toFixed(2) + ' ' +
		((y1 - yy1) / scale_y).toFixed(2) + ' ' +
		((xx2 - x1) / stv_g.scale).toFixed(2) + ' ' +
		((y1 - yy2) / scale_y).toFixed(2) + ' ' +
		((x2 - x1) / stv_g.scale).toFixed(2) + ' ' +
		((y1 - y2) / scale_y).toFixed(2))

	if (!dotted)
		output.push('\n\tv' +
			(-dz).toFixed(2) + 'c' +
			((xx2 - dx - x2) / stv_g.scale).toFixed(2) + ' ' +
			((y2 + dz - yy2 - dy) / scale_y).toFixed(2) + ' ' +
			((xx1 + dx - x2) / stv_g.scale).toFixed(2) + ' ' +
			((y2 + dz - yy1 - dy) / scale_y).toFixed(2) + ' ' +
			((x1 - x2) / stv_g.scale).toFixed(2) + ' ' +
			((y2 + dz - y1) / scale_y).toFixed(2));
	output.push('"/>\n')
}

/* -- check if slur sequence in a multi-voice staff -- */
function slur_multi(k1, k2) {
	while (1) {
		if (k1.multi)		/* if multi voice */
			/*fixme: may change*/
			return k1.multi
		if (k1 == k2)
			break
		k1 = k1.next
	}
	return 0
}

/* -- draw a phrasing slur between two symbols -- */
/* (the staves are not yet defined) */
/* (not a pretty routine, this) */
function draw_slur(k1_o, k2, m1, m2, slur_type) {
	var	k1 = k1_o,
		k, g, x1, y1, x2, y2, height, addy,
		a, y, z, h, dx, dy, dir

	while (k1.v != k2.v)
		k1 = k1.ts_next
/*fixme: if two staves, may have upper or lower slur*/
	switch (slur_type & 0x07) {	/* (ignore dotted flag) */
	case SL_ABOVE: dir = 1; break
	case SL_BELOW: dir = -1; break
	default:
		dir = slur_multi(k1, k2)
		if (!dir)
			dir = slur_direction(k1, k2)
		break
	}

	var	nn = 1,
		upstaff = k1.st,
		two_staves = false

	if (k1 != k2) {
		k = k1.next
		while (1) {
			if (k.type == NOTE || k.type == REST) {
				nn++
				if (k.st != upstaff) {
					two_staves = true
					if (k.st < upstaff)
						upstaff = k.st
				}
			}
			if (k == k2)
				break
			k = k.next
		}
	}
/*fixme: KO when two staves*/
if (two_staves) error(2, k1, "*** multi-staves slurs not treated yet")

	/* fix endpoints */
//	x1 = k1.x + k1.xmx		/* take the max right side */
	x1 = k1_o.x
	if (k1_o.notes && k1_o.notes[0].shhd)
		x1 += k1_o.notes[0].shhd
	if (k1_o != k2) {
		x2 = k2.x
		if (k2.notes)
			x2 += k2.notes[0].shhd
	} else {		/* (the slur starts on last note of the line) */
		for (k = k2.ts_next; k; k = k.ts_next)
//fixme: must check if the staff continues
			if (k.new_sy)
				break
		if (!k)
			x2 = realwidth
		else
			x2 = k.x
	}

	if (m1 >= 0) {
		y1 = 3 * (k1.notes[m1].pit - 18) + 5 * dir
	} else {
		y1 = dir > 0 ? k1.ymx + 2 : k1.ymn - 2
		if (k1.type == NOTE) {
			if (dir > 0) {
				if (k1.stem > 0) {
					x1 += 5
					if (k1.beam_end
					 && k1.nflags >= -1	/* if with a stem */
//fixme: check if at end of tuplet
					 && (!k1.in_tuplet)) {
//					  || k1.ys > y1 - 3)) {
						if (k1.nflags > 0) {
							x1 += 2;
							y1 = k1.ys - 3
						} else {
							y1 = k1.ys - 6
						}
					} else {
						y1 = k1.ys + 3
					}
				} else {
					y1 = k1.y + 8
				}
			} else {
				if (k1.stem < 0) {
					x1 -= 1
					if (k1.beam_end
					 && k1.nflags >= -1
					 && (!k1.in_tuplet
					  || k1.ys < y1 + 3)) {
						if (k1.nflags > 0) {
							x1 += 2;
							y1 = k1.ys + 3
						} else {
							y1 = k1.ys + 6
						}
					} else {
						y1 = k1.ys - 3
					}
				} else {
					y1 = k1.y - 8
				}
			}
		}
	}
	if (m2 >= 0) {
		y2 = 3 * (k2.notes[m2].pit - 18) + 5 * dir
	} else {
		y2 = dir > 0 ? k2.ymx + 2 : k2.ymn - 2
		if (k2.type == NOTE) {
			if (dir > 0) {
				if (k2.stem > 0) {
					x2 += 1
					if (k2.beam_st
					 && k2.nflags >= -1
					 && (!k2.in_tuplet))
//						|| k2.ys > y2 - 3))
						y2 = k2.ys - 6
					else
						y2 = k2.ys + 3
				} else {
					y2 = k2.y + 8
				}
			} else {
				if (k2.stem < 0) {
					x2 -= 5
					if (k2.beam_st
					 && k2.nflags >= -1
					 && (!k2.in_tuplet))
//						|| k2.ys < y2 + 3))
						y2 = k2.ys + 6
					else
						y2 = k2.ys - 3
				} else {
					y2 = k2.y - 8
				}
			}
		}
	}

	if (k1.type != NOTE) {
		y1 = y2 + 1.2 * dir;
		x1 = k1.x + k1.wr * .5
		if (x1 > x2 - 12)
			x1 = x2 - 12
	}

	if (k2.type != NOTE) {
		if (k1.type == NOTE)
			y2 = y1 + 1.2 * dir
		else
			y2 = y1
		if (k1 != k2)
			x2 = k2.x - k2.wl * .3
	}

	if (nn >= 3) {
		if (k1.next.type != BAR
		 && k1.next.x < x1 + 48) {
			if (dir > 0) {
				y = k1.next.ymx - 2
				if (y1 < y)
					y1 = y
			} else {
				y = k1.next.ymn + 2
				if (y1 > y)
					y1 = y
			}
		}
		if (k2.prev
		 && k2.prev.type != BAR
		 && k2.prev.x > x2 - 48) {
			if (dir > 0) {
				y = k2.prev.ymx - 2
				if (y2 < y)
					y2 = y
			} else {
				y = k2.prev.ymn + 2
				if (y2 > y)
					y2 = y
			}
		}
	}

	a = (y2 - y1) / (x2 - x1)		/* slur steepness */
	if (a > SLUR_SLOPE || a < -SLUR_SLOPE) {
		a = a > SLUR_SLOPE ? SLUR_SLOPE : -SLUR_SLOPE
		if (a * dir > 0)
			y1 = y2 - a * (x2 - x1)
		else
			y2 = y1 + a * (x2 - x1)
	}

	/* for big vertical jump, shift endpoints */
	y = y2 - y1
	if (y > 8)
		y = 8
	else if (y < -8)
		y = -8
	z = y
	if (z < 0)
		z = -z;
	dx = .5 * z;
	dy = .3 * y
	if (y * dir > 0) {
		x2 -= dx;
		y2 -= dy
	} else {
		x1 += dx;
		y1 += dy
	}

	/* special case for grace notes */
	if (k1.grace)
		x1 = k1.x - GSTEM_XOFF * .5
	if (k2.grace)
		x2 = k2.x + GSTEM_XOFF * 1.5;

	h = 0;
	a = (y2 - y1) / (x2 - x1)
	if (k1 != k2
	 && k1.v == k2.v) {
	    addy = y1 - a * x1
	    for (k = k1.next; k != k2 ; k = k.next) {
		if (k.st != upstaff)
			continue
		switch (k.type) {
		case NOTE:
		case REST:
			if (dir > 0) {
				y = 3 * (k.notes[k.nhd].pit - 18) + 6
				if (y < k.ymx)
					y = k.ymx;
				y -= a * k.x + addy
				if (y > h)
					h = y
			} else {
				y = 3 * (k.notes[0].pit - 18) - 6
				if (y > k.ymn)
					y = k.ymn;
				y -= a * k.x + addy
				if (y < h)
					h = y
			}
			break
		case GRACE:
			for (g = k.extra; g; g = g.next) {
				if (g.type != NOTE)
					continue
				if (dir > 0) {
					y = 3 * (g.notes[g.nhd].pit - 18) + 6
					if (y < g.ymx)
						y = g.ymx;
					y -= a * g.x + addy
					if (y > h)
						h = y
				} else {
					y = 3 * (g.notes[0].pit - 18) - 6
					if (y > g.ymn)
						y = g.ymn;
					y -= a * g.x + addy
					if (y < h)
						h = y
				}
			}
			break
		}
	    }
	    y1 += .45 * h;
	    y2 += .45 * h;
	    h *= .65
	}

	if (nn > 3)
		height = (.08 * (x2 - x1) + 12) * dir
	else
		height = (.03 * (x2 - x1) + 8) * dir
	if (dir > 0) {
		if (height < 3 * h)
			height = 3 * h
		if (height > 40)
			height = 40
	} else {
		if (height > 3 * h)
			height = 3 * h
		if (height < -40)
			height = -40
	}

	y = y2 - y1
	if (y < 0)
		y = -y
	if (dir > 0) {
		if (height < .8 * y)
			height = .8 * y
	} else {
		if (height > -.8 * y)
			height = -.8 * y
	}
	height *= cfmt.slurheight

	slur_out(x1, y1, x2, y2, dir, height, slur_type & SL_DOTTED);

	/* have room for other symbols */
	dx = x2 - x1;
	a = (y2 - y1) / dx;
/*fixme: it seems to work with .4, but why?*/
	addy = y1 - a * x1 + .4 * height
	if (k1.v == k2.v)
	    for (k = k1; k != k2; k = k.next) {
		if (k.st != upstaff)
			continue
		y = a * k.x + addy
		if (k.ymx < y)
			k.ymx = y
		else if (k.ymn > y)
			k.ymn = y
		if (k.next == k2) {
			dx = x2
			if (k2.sl1)
				dx -= 5
		} else {
			dx = k.next.x
		}
		if (k != k1)
			x1 = k.x;
		dx -= x1;
		y_set(upstaff, dir > 0, x1, dx, y)
	}
	return (dir > 0 ? SL_ABOVE : SL_BELOW) | (slur_type & SL_DOTTED)
}

/* -- draw the slurs between 2 symbols --*/
function draw_slurs(first, last) {
	var	s1, k, gr1, gr2, i, m1, m2, slur_type, cont,
		s = first

	while (1) {
		if (!s || s == last) {
			if (!gr1
			 || !(s = gr1.next)
			 || s == last)
				break
			gr1 = null
		}
		if (s.type == GRACE) {
			gr1 = s;
			s = s.extra
			continue
		}
		if ((s.type != NOTE && s.type != REST
		  && s.type != SPACE)
		 || (!s.slur_start && !s.sl1)) {
			s = s.next
			continue
		}
		k = null;		/* find matching slur end */
		s1 = s.next
		var gr1_out = false
		while (1) {
			if (!s1) {
				if (gr2) {
					s1 = gr2.next;
					gr2 = null
					continue
				}
				if (!gr1 || gr1_out)
					break
				s1 = gr1.next;
				gr1_out = true
				continue
			}
			if (s1.type == GRACE) {
				gr2 = s1;
				s1 = s1.extra
				continue
			}
			if (s1.type == BAR
			 && (s1.bar_type[0] == ':'
			  || s1.bar_type == "|]"
			  || s1.bar_type == "[|"
			  || (s1.text && s1.text[0] != '1'))) {
				k = s1
				break
			}
			if (s1.type != NOTE && s1.type != REST
			 && s1.type != SPACE) {
				s1 = s1.next
				continue
			}
			if (s1.slur_end || s1.sl2) {
				k = s1
				break
			}
			if (s1.slur_start || s1.sl1) {
				if (gr2) {	/* if in grace note sequence */
					for (k = s1; k.next; k = k.next)
						;
					k.next = gr2.next
					if (gr2.next)
						gr2.next.prev = k;
//					gr2.slur_start = SL_AUTO
					k = null
				}
				draw_slurs(s1, last)
				if (gr2
				 && gr2.next) {
					delete gr2.next.prev.next;
					gr2.next.prev = gr2
				}
			}
			if (s1 == last)
				break
			s1 = s1.next
		}
		if (!s1) {
			k = next_scut(s)
		} else if (!k) {
			s = s1
			if (s == last)
				break
			continue
		}

		/* if slur in grace note sequence, change the linkages */
		if (gr1) {
			for (s1 = s; s1.next; s1 = s1.next)
				;
			s1.next = gr1.next
			if (gr1.next)
				gr1.next.prev = s1;
			gr1.slur_start = SL_AUTO
		}
		if (gr2) {
			gr2.prev.next = gr2.extra;
			gr2.extra.prev = gr2.prev;
			gr2.slur_start = SL_AUTO
		}
		if (s.slur_start) {
			slur_type = s.slur_start & 0x0f;
			s.slur_start >>= 4;
			m1 = -1
		} else {
			for (m1 = 0; m1 <= s.nhd; m1++)
				if (s.notes[m1].sl1)
					break
			slur_type = s.notes[m1].sl1 & 0x0f;
			s.notes[m1].sl1 >>= 4;
			s.sl1--
		}
		m2 = -1;
		cont = 0
		if ((k.type == NOTE || k.type == REST || k.type == SPACE) &&
		    (k.slur_end || k.sl2)) {
			if (k.slur_end) {
				k.slur_end--
			} else {
				for (m2 = 0; m2 <= k.nhd; m2++)
					if (k.notes[m2].sl2)
						break
				k.notes[m2].sl2--;
				k.sl2--
			}
		} else {
			if (k.type != BAR
			 || (k.bar_type[0] != ':'
			  && k.bar_type != "|]"
			  && k.bar_type != "[|"
			  && (!k.text || k.text[0] == '1')))
				cont = 1
		}
		slur_type = draw_slur(s, k, m1, m2, slur_type)
		if (cont) {
/*fixme: the slur types are inverted*/
			voice_tb[k.v].slur_start <<= 4;
			voice_tb[k.v].slur_start += slur_type
		}

		/* if slur in grace note sequence, restore the linkages */
		if (gr1
		 && gr1.next) {
			delete gr1.next.prev.next;
			gr1.next.prev = gr1
		}
		if (gr2) {
			gr2.prev.next = gr2;
			delete gr2.extra.prev
		}

		if (s.slur_start || s.sl1)
			continue
		if (s == last)
			break
		s = s.next
	}
}

/* -- draw a tuplet -- */
/* (the staves are not yet defined) */
/* See 'tuplets' in format.txt about the value of 'f' */
function draw_tuplet(t,		/* tuplet in extra */
		     s) {	/* main note */
	var	s1, s2, s3, g, r, upstaff, nb_only, some_slur,
		x1, x2, y1, y2, xm, ym, a, s0, yy, yx, dy, a, b,
		next = s

	if (t.tuplet_f[0] == 1)		/* if 'when' == never */
		return next

	/* treat the nested tuplets starting on this symbol */
	for (g = t.next; g; g = g.next) {
		if (g.type == TUPLET) {
			s3 = draw_tuplet(g, s)
			if (s3.time > next.time)
				next = s3
		}
	}

	/* search the first and last notes/rests of the tuplet */
	r = t.tuplet_r;
	upstaff = s.st
	for (s2 = s; s2; s2 = s2.next) {
		if (s2 != s
		 && s2.in_tuplet) {
			for (g = s2.extra; g; g = g.next) {
				if (g.type == TUPLET) {
					s3 = draw_tuplet(g, s2)
					if (s3.time > next.time)
						next = s3
				}
			}
		}
		if (s2.type != NOTE && s2.type != REST) {
			if (s2.type == GRACE) {
				for (g = s2.extra; g; g = g.next) {
					if (g.type != NOTE)
						continue
					if (g.slur_start || g.sl1)
						some_slur = true
				}
			}
			continue
		}
		if (s2.slur_start || s2.slur_end /* if slur start/end */
		 || s2.sl1 || s2.sl2)
			some_slur = true
		if (s2.st < upstaff)
			upstaff = s2.st
		if (!s1)
			s1 = s2
		if (--r <= 0)
			break
	}
	if (!s2)
		return next			/* no solution... */
	if (s2.time > next.time)
		next = s2

	if (s1 == s2) {				/* tuplet with 1 note (!) */
		nb_only = true
	} else if (t.tuplet_f[1] == 1) {	/* 'what' == slur */
		nb_only = true;
		draw_slur(s1, s2, -1, -1, 
			  s1.stem > 0 ? SL_ABOVE : SL_BELOW)
	} else {

		/* search if a bracket is needed */
		if (t.tuplet_f[0] == 2		/* if 'when' == always */
		 || s1.type != NOTE || s2.type != NOTE) {
			nb_only = false
		} else {
			nb_only = true
			for (s3 = s1; ; s3 = s3.next) {
				if (s3.type != NOTE
				 && s3.type != REST) {
					if (s3.type == GRACE
					 || s3.type == SPACE)
						continue
					nb_only = false
					break
				}
				if (s3 == s2)
					break
				if (s3.beam_end) {
					nb_only = false
					break
				}
			}
			if (nb_only
			 && !s1.beam_st
			 && !s1.beam_br1
			 && !s1.beam_br2) {
				for (s3 = s1.prev; s3; s3 = s3.prev) {
					if (s3.type == NOTE
					 || s3.type == REST) {
						if (s3.nflags >= s1.nflags)
							nb_only = false
						break
					}
				}
			}
			if (nb_only && !s2.beam_end) {
				for (s3 = s2.next; s3; s3 = s3.next) {
					if (s3.type == NOTE
					 || s3.type == REST) {
						if (!s3.beam_br1
						 && !s3.beam_br2
						 && s3.nflags >= s2.nflags)
							nb_only = false
						break
					}
				}
			}
		}
	}

	/* if number only, draw it */
	if (nb_only) {
		if (t.tuplet_f[2] == 1)		/* if 'value' == none */
			return next
		xm = (s2.x + s1.x) * .5
		if (s1 == s2)			/* tuplet with 1 note */
			a = 0
		else
			a = (s2.ys - s1.ys) / (s2.x - s1.x);
		b = s1.ys - a * s1.x;
		yy = a * xm + b
		if (s1.stem > 0) {
			ym = y_get(upstaff, 1, xm - 3, 6)
			if (ym > yy)
				b += ym - yy;
			b += 2
		} else {
			ym = y_get(upstaff, 0, xm - 3, 6)
			if (ym < yy)
				b += ym - yy;
			b -= 10
		}
		for (s3 = s1; ; s3 = s3.next) {
			if (s3.x >= xm)
				break
		}
		if (s1.stem * s2.stem > 0) {
			if (s1.stem > 0)
				xm += 1.5
			else
				xm -= 1.5
		}
		ym = a * xm + b
		if (t.tuplet_f[2] == 0)		/* if 'value' == number */
			out_bnum(xm, ym, t.tuplet_p)
		else
			out_bnum(xm, ym, t.tuplet_p + ':' +  t.tuplet_q)
		if (s1.stem > 0) {
			ym += 10
			if (s3.ymx < ym)
				s3.ymx = ym;
			y_set(upstaff, true, xm - 3, 6, ym)
		} else {
			if (s3.ymn > ym)
				s3.ymn = ym;
			y_set(upstaff, false, xm - 3, 6, ym)
		}
		s.in_tuplet = false		/* the tuplet is drawn */
		return next
	}

	/* draw the slurs when inside the tuplet */
	if (some_slur) {
		draw_slurs(s1, s2)
		if (s1.slur_start || s1.sl1)
			return next
		for (s3 = s1.next; s3 != s2; s3 = s3.next) {
			if (s3.slur_start || s3.slur_end /* if slur start/end */
			 || s3.sl1 || s3.sl2)
				return next		/* don't draw now */
		}

		/* don't draw the tuplet when a slur ends on the last note */
		if (s2.slur_end || s2.sl2)
			return next
	}
	if (t.tuplet_f[1] != 0)				/* if 'what' != square */
		error(2, t, "'what' value of %%tuplets not yet coded")

/*fixme: two staves not treated*/
/*fixme: to optimize*/
    if (s1.multi >= 0) {

	/* sole or upper voice: the bracket is above the staff */
	x1 = s1.x - 4;
	y1 = 24
	if (s1.st == upstaff) {
		s3 = s1
		if (s3.type != NOTE) {
			for (s3 = s3.next; s3 != s2; s3 = s3.next)
				if (s3.type == NOTE)
					break
		}
		ym = y_get(upstaff, 1, s3.x, 0)
		if (ym > y1)
			y1 = ym
		if (s1.stem > 0)
			x1 += 3
	}
	y2 = 24
	if (s2.st == upstaff) {
		s3 = s2
		if (s3.type != NOTE) {
			for (s3 = s3.prev; s3 != s1; s3 = s3.prev)
				if (s3.type == NOTE)
					break
		}
		ym = y_get(upstaff, 1, s3.x, 0)
		if (ym > y2)
			y2 = ym
	}

	/* end the backet according to the last note duration */
	if (s2.dur > s2.prev.dur) {
		if (s2.next)
			x2 = s2.next.x - s2.next.wl - 5
		else
			x2 = realwidth - 6
	} else {
		x2 = s2.x + 4;
		r = s2.stem >= 0 ? 0 : s2.nhd
		if (s2.notes[r].shhd > 0)
			x2 += s2.notes[r].shhd
		if (s2.st == upstaff
		 && s2.stem > 0)
			x2 += 3.5
	}

	xm = .5 * (x1 + x2);
	ym = .5 * (y1 + y2);

	a = (y2 - y1) / (x2 - x1);
	s0 = 3 * (s2.notes[s2.nhd].pit - s1.notes[s1.nhd].pit) / (x2 - x1)
	if (s0 > 0) {
		if (a < 0)
			a = 0
		else if (a > s0)
			a = s0
	} else {
		if (a > 0)
			a = 0
		else if (a < s0)
			a = s0
	}
	if (a * a < .1 * .1)
		a = 0

	/* shift up bracket if needed */
	dy = 0
	for (s3 = s1; ; s3 = s3.next) {
		if (!s3.dur			/* not a note or a rest */
		 || s3.st != upstaff) {
			if (s3 == s2)
				break
			continue
		}
		yy = ym + (s3.x - xm) * a;
		yx = y_get(upstaff, 1, s3.x, 0)
		if (yx - yy > dy)
			dy = yx - yy
		if (s3 == s2)
			break
	}

	ym += dy + 2;
	y1 = ym + a * (x1 - xm);
	y2 = ym + a * (x2 - xm);
	out_tubr(x1, y1 + 4, x2 - x1, y2 - y1, true);

	/* shift the slurs / decorations */
	ym += 8
	for (s3 = s1; ; s3 = s3.next) {
		if (s3.st == upstaff) {
			yy = ym + (s3.x - xm) * a
			if (s3.ymx < yy)
				s3.ymx = yy
			if (s3 == s2)
				break
			y_set(upstaff, true, s3.x, s3.next.x - s3.x, yy)
		} else if (s3 == s2) {
			break
		}
	}

    } else {	/* lower voice of the staff: the bracket is below the staff */
/*fixme: think to all that again..*/
	x1 = s1.x - 7

	if (s2.dur > s2.prev.dur) {
		if (s2.next)
			x2 = s2.next.x - s2.next.wl - 8
		else
			x2 = realwidth - 6
	} else {
		x2 = s2.x + 2
		if (s2.notes[s2.nhd].shhd > 0)
			x2 += s2.notes[s2.nhd].shhd
	}

	if (s1.st == upstaff) {
		s3 = s1
		if (s3.type != NOTE) {
			for (s3 = s3.next; s3 != s2; s3 = s3.next)
				if (s3.type == NOTE)
					break
		}
		y1 = y_get(upstaff, 0, s3.x, 0)
	} else {
		y1 = 0
	}
	if (s2.st == upstaff) {
		s3 = s2
		if (s3.type != NOTE) {
			for (s3 = s3.prev; s3 != s1; s3 = s3.prev)
				if (s3.type == NOTE)
					break
		}
		y2 = y_get(upstaff, 0, s3.x, 0)
	} else {
		y2 = 0
	}

	xm = .5 * (x1 + x2);
	ym = .5 * (y1 + y2);

	a = (y2 - y1) / (x2 - x1);
	s0 = 3 * (s2.notes[0].pit - s1.notes[0].pit) / (x2 - x1)
	if (s0 > 0) {
		if (a < 0)
			a = 0
		else if (a > s0)
			a = s0
	} else {
		if (a > 0)
			a = 0
		else if (a < s0)
			a = s0
	}
	if (a * a < .1 * .1)
		a = 0

	/* shift down bracket if needed */
	dy = 0
	for (s3 = s1; ; s3 = s3.next) {
		if (!s3.dur			/* not a note nor a rest */
		 || s3.st != upstaff) {
			if (s3 == s2)
				break
			continue
		}
		yy = ym + (s3.x - xm) * a;
		yx = y_get(upstaff, 0, s3.x, 0)
		if (yx - yy < dy)
			dy = yx - yy
		if (s3 == s2)
			break
	}

	ym += dy - 10;
	y1 = ym + a * (x1 - xm);
	y2 = ym + a * (x2 - xm);
	out_tubr(x1, y1 + 4, x2 - x1, y2 - y1);

	/* shift the slurs / decorations */
	ym -= 2
	for (s3 = s1; ; s3 = s3.next) {
		if (s3.st == upstaff) {
			if (s3 == s2)
				break
			yy = ym + (s3.x - xm) * a
			if (s3.ymn > yy)
				s3.ymn = yy;
			y_set(upstaff, false, s3.x, s3.next.x - s3.x, yy)
		}
		if (s3 == s2)
			break
	}
    } /* lower voice */

	if (t.tuplet_f[2] == 1) {	/* if 'value' == none */
		s.in_tuplet = false
		return next
	}
	yy = .5 * (y1 + y2)
	if (t.tuplet_f[2] == 0)		/* if 'value' == number */
		out_bnum(xm, yy, t.tuplet_p, true)
	else
		out_bnum(xm, yy, t.tuplet_p + ':' +  t.tuplet_q, true)
	if (s1.multi >= 0) {
//		yy += 8
		yy += 9;
//		if (s3.ymx < yy)
//			s3.ymx = yy
		y_set(upstaff, true, xm - 3, 6, yy)
	} else {
//		if (s3.ymn > yy)
//			s3.ymn = yy
		y_set(upstaff, false, xm - 3, 6, yy)
	}
	s.in_tuplet = false
	return next
}

/* -- draw the ties between two notes/chords -- */
function draw_note_ties(k1, k2, mhead1, mhead2, job) {
	var i, dir, m1, m2, p, p1, p2, y, st, k, x1, x2, h, sh

	for (i = 0; i < mhead1.length; i++) {
		m1 = mhead1[i];
		p1 = k1.notes[m1].pit;
		m2 = mhead2[i];
		p2 = k2.notes[m2].pit;
		dir = (k1.notes[m1].ti1 & 0x07) == SL_ABOVE ? 1 : -1;

		x1 = k1.x;
		sh = k1.notes[m1].shhd		/* head shift */
		if (dir > 0) {
			if (m1 < k1.nhd && p1 + 1 == k1.notes[m1 + 1].pit)
				if (k1.notes[m1 + 1].shhd > sh)
					sh = k1.notes[m1 + 1].shhd
		} else {
			if (m1 > 0 && p1 == k1.notes[m1 - 1].pit + 1)
				if (k1.notes[m1 - 1].shhd > sh)
					sh = k1.notes[m1 - 1].shhd
		}
		x1 += sh * 0.6;

		x2 = k2.x;
		sh = k2.notes[m2].shhd
		if (dir > 0) {
			if (m2 < k2.nhd && p2 + 1 == k2.notes[m2 + 1].pit)
				if (k2.notes[m2 + 1].shhd < sh)
					sh = k2.notes[m2 + 1].shhd
		} else {
			if (m2 > 0 && p2 == k2.notes[m2 - 1].pit + 1)
				if (k2.notes[m2 - 1].shhd < sh)
					sh = k2.notes[m2 - 1].shhd
		}
		x2 += sh * 0.6;

		st = k1.st
		switch (job) {
		case 0:
			if (p1 == p2 || (p1 & 1))
				p = p1
			else
				p = p2
			break
		case 1:				/* no starting note */
		case 3:				/* clef or staff change */
			x1 = k1.x
			if (x1 > x2 - 20)
				x1 = x2 - 20;
			p = p2;
			st = k2.st
			if (job == 3)
				dir = -dir
			break
/*		case 2:				 * no ending note */
		default:
			if (k1 != k2) {
				x2 -= k2.wl
			} else {
				for (k = k2.ts_next; k; k = k.ts_next)
//fixme: must check if the staff continues
					if (k.new_sy)
						break
				if (!k)
					x2 = realwidth
				else
					x2 = k.x
			}
			if (x2 < x1 + 16)
				x2 = x1 + 16;
			p = p1
			break
		}
		if (x2 - x1 > 20) {
			x1 += 3.5;
			x2 -= 3.5
		}

		y = 3 * (p - 18)
		if (job != 1 && job != 3) {
			if (p & 1)
				y += 2 * dir
			if (dir > 0) {
//				if (k1.nflags > -2 && k1.stem > 0
//				 && k1.nhd == 0)
//					x1 += 4.5
				if (!(p & 1) && k1.dots > 0)
					y = 3 * (p - 18) + 6
			}
		} else {
			if (p & 1)
				y += 2 * dir
//			if (dir < 0) {
//				if (k2.nflags > -2 && k2.stem < 0
//				 && k2.nhd == 0)
//					x2 -= 4.5
//			}
		}

		h = (.04 * (x2 - x1) + 10) * dir;
		slur_out(x1, staff_tb[st].y + y,
			 x2, staff_tb[st].y + y,
			 dir, h, k1.notes[m1].ti1 & SL_DOTTED)
	}
}

/* -- draw ties between neighboring notes/chords -- */
function draw_ties(k1, k2,
			job) {		/* 0: normal
					 * 1: no starting note
					 * 2: no ending note
					 * 3: no start for clef or staff change */
	var	k3, i, j, m1, pit, tie2,
		mhead1 = [],
		mhead2 = [],
		mhead3 = [],
		nh1 = k1.nhd,
		time = k1.time + k1.dur

	/* special cases for ties to/from a grace note */
	if (k1.type == GRACE) {
		k3 = k1.extra
		while (k3) {
			if (k3.type == NOTE)
				k1 = k3		/* last grace note */
			k3 = k3.next
		}
	}
	if (k2 && k2.type == GRACE) {
		k3 = k2.extra
		while (k3) {
			if (k3.type == NOTE) {
				k2 = k3		/* first grace note */
				if (job == 2)
					job = 0
				break
			}
			k3 = k3.next
		}
	}

	/* half ties from last note in line or before new repeat */
	if (job == 2) {
		for (i = 0; i <= nh1; i++) {
			if (k1.notes[i].ti1)
				mhead3.push(i)
		}
//		draw_note_ties(k1, k2 /*&& k2.type == NOTE*/ ? k2 : k1,
		draw_note_ties(k1, k2 || k1,
				mhead3, mhead3, job)
		return
	}

	/* set up list of ties to draw */
	for (i = 0; i <= nh1; i++) {
		if (k1.notes[i].ti1 == 0)
			continue
		tie2 = -1;
		pit = k1.notes[i].apit
		for (m1 = k2.nhd; m1 >= 0; m1--) {
			switch (k2.notes[m1].apit - pit) {
			case 1:			/* maybe ^c - _d */
			case -1:		/* _d - ^c */
				if (k1.notes[i].acc != k2.notes[m1].acc)
					tie2 = m1
			default:
				continue
			case 0:
				tie2 = m1
				break
			}
			break
		}
		if (tie2 >= 0) {		/* 1st or 2nd choice */
			mhead1.push(i);
			mhead2.push(tie2)
		} else {
			mhead3.push(i)		/* no match */
		}
	}

	/* draw the ties */
	draw_note_ties(k1, k2, mhead1, mhead2, job)

	/* if any bad tie, try an other voice of the same staff */
	if (mhead3.length == 0)
		return				/* no bad tie */

	k3 = k1.ts_next
	while (k3 && k3.time < time)
		k3 = k3.ts_next
	while (k3 && k3.time == time) {
		if (k3.type != NOTE
		 || k3.st != k1.st) {
			k3 = k3.ts_next
			continue
		}
		mhead1.length = 0;
		mhead2.length = 0
		for (i = mhead3.length; --i >= 0; ) {
			j = mhead3[i];
			pit = k1.notes[j].apit
			for (m1 = k3.nhd; m1 >= 0; m1--) {
				if (k3.notes[m1].apit == pit) {
					mhead1.push(j);
					mhead2.push(m1);
					mhead3[i] = mhead3.pop()
					break
				}
			}
		}
		if (mhead1.length > 0) {
			draw_note_ties(k1, k3,
					mhead1, mhead2,
					job == 1 ? 1 : 0)
			if (mhead3.length == 0)
				return
		}
		k3 = k3.ts_next
	}

	if (mhead3.length != 0)
		error(1, k1, "Bad tie")
}

/* -- try to get the symbol of a ending tie when combined voices -- */
function tie_comb(s)
{
	var	s1, time, st;

	time = s.time + s.dur;
	st = s.st;
	for (s1 = s.ts_next; s1; s1 = s1.ts_next) {
		if (s1.st != st)
			continue
		if (s1.time == time) {
			if (s1.type == NOTE)
				return s1
			continue
		}
		if (s1.time > time)
			return s		// bad tie
	}
	return null				// no ending tie
}

/* -- draw all ties between neighboring notes -- */
function draw_all_ties(p_voice) {
	var s1, s2, s3, clef_chg, time, s_rtie, s_tie, x, dx

	for (s1 = p_voice.sym; s1; s1 = s1.next) {
		switch (s1.type) {
		case CLEF:
		case KEY:
		case METER:
			continue
		}
		break
	}
	s_rtie = p_voice.s_rtie			/* tie from 1st repeat bar */
	for (s2 = s1; s2; s2 = s2.next) {
//		if (s2.type == NOTE
		if (s2.dur
		 || s2.type == GRACE)
			break
		if (s2.type != BAR
		 || !s2.text)			// not a repeat bar
			continue
		if (s2.text[0] == '1')		/* 1st repeat bar */
			s_rtie = p_voice.s_tie
		else
			p_voice.s_tie = s_rtie
	}
	if (!s2)
		return
	if (p_voice.s_tie) {			/* tie from previous line */
		p_voice.s_tie.x = s1.x + s1.wr;
		s1 = p_voice.s_tie;
		delete p_voice.s_tie;
		s1.st = s2.st;
//		s1.ts_next = tsfirst.next;	/* (for tie to other voice) */
		s1.ts_next = s2.ts_next;	/* (for tie to other voice) */
		s1.time = s2.time - s1.dur;	/* (if after repeat sequence) */
		draw_ties(s1, s2, 1)		/* tie to 1st note */
	}

	/* search the start of ties */
//	clef_chg = false
	while (1) {
		for (s1 = s2; s1; s1 = s1.next) {
			if (s1.ti1)
				break
			if (!s_rtie)
				continue
			if (s1.type != BAR
			 || !s1.text)			// not a repeat bar
				continue
			if (s1.text[0] == '1') {	/* 1st repeat bar */
				s_rtie = null
				continue
			}
			if (s1.bar_type == '|')
				continue		// not a repeat
//			if (s1.bar_type == '[')
//			 && s1.prev.type != BAR)
//				continue		// not a repeat
			for (s2 = s1.next; s2; s2 = s2.next)
				if (s2.type == NOTE)
					break
			if (!s2) {
				s1 = null
				break
			}
			s_tie = clone(s_rtie);
			s_tie.x = s1.x + s1.wr;
			s_tie.next = s2;
			s_tie.st = s2.st;
			s_tie.time = s2.time - s_tie.dur;
			draw_ties(s_tie, s2, 1)
			continue
		}
		if (!s1)
			break

		/* search the end of the tie
		 * and notice the clef changes (may occur in an other voice) */
		time = s1.time + s1.dur
		for (s2 = s1.next; s2; s2 = s2.next) {
			if (s2.dur)
				break
		}
		if (!s2) {
			for (s2 = s1.ts_next; s2; s2 = s2.ts_next) {
				if (s2.st != s1.st)
					continue
				if (s2.time < time)
					continue
				if (s2.time > time) {
					s2 = null
					break
				}
				if (s2.dur)
					break
			}
			if (!s2) {
				draw_ties(s1, null, 2);
				p_voice.s_tie = s1
				break
			}
		} else {
			if (s2.type != NOTE) {
				error(1, s1, "Bad tie")
				continue
			}
			if (s2.time != time)
				s2 = tie_comb(s1)
		}
		for (s3 = s1.ts_next; s3; s3 = s3.ts_next) {
			if (s3.st != s1.st)
				continue
			if (s3.time > time)
				break
			if (s3.type == CLEF) {
				clef_chg = true
				continue
			}
			if (s3.type == BAR) {
				if (s3.bar_type[0] == ':'
				 || s3.bar_type == "|]"
				 || s3.bar_type == "[|") {
					s2 = s3;
					break;
				}
				if (!s3.text)		// not a repeat bar
					continue
				if (s3.text[0] != '1') {
					s2 = s3
					break
				}
				s_rtie = s1		/* 1st repeat bar */
			}
		}

		/* ties with clef or staff change */
		if (clef_chg || s1.st != s2.st) {
			clef_chg = false;
			dx = (s2.x - s1.x) * 0.4;
			x = s2.x;
			s2.x -= dx
			if (s2.x > s1.x + 32.)
				s2.x = s1.x + 32.;
			draw_ties(s1, s2, 2);
			s2.x = x;
			x = s1.x;
			s1.x += dx
			if (s1.x < s2.x - 24.)
				s1.x = s2.x - 24.;
			draw_ties(s1, s2, 3);
			s1.x = x
			continue
		}
		draw_ties(s1, s2, s2.type == NOTE ? 0 : 2)
	}
	p_voice.s_rtie = s_rtie
}

/* -- draw all phrasing slurs for one staff -- */
/* (the staves are not yet defined) */
function draw_all_slurs(p_voice) {
	var	k, i, m2, slur_type,
		s = p_voice.sym

	if (!s)
		return

	/* the starting slur types are inverted */
	var slur_st = 0;
	slur_type = p_voice.slur_start
	if (slur_type) {
		while (slur_type != 0) {
			slur_st <<= 4;
			slur_st |= (slur_type & 0x0f);
			slur_type >>= 4
		}
	}
	delete p_voice.slur_start;

	/* draw the slurs inside the music line */
	draw_slurs(s, undefined)

	/* do unbalanced slurs still left over */
	for ( ; s; s = s.next) {
		if (s.type != NOTE && s.type != REST
		 && s.type != SPACE)
			continue
		while (s.slur_end || s.sl2) {
			if (s.slur_end) {
				s.slur_end--;
				m2 = -1
			} else {
				for (m2 = 0; m2 <= s.nhd; m2++)
					if (s.notes[m2].sl2)
						break
				s.notes[m2].sl2--;
				s.sl2--
			}
			slur_type = slur_st & 0x0f;
			k = prev_scut(s);
			draw_slur(k, s, -1, m2, slur_type)
			if (k.type != BAR
			 || (k.bar_type[0] != ':'
			  && k.bar_type != "|]"
			  && k.bar_type != "[|"
			  && (!k.text || k.text[0] == '1')))
				slur_st >>= 4
		}
	}
	s = p_voice.sym
	while (slur_st != 0) {
		slur_type = slur_st & 0x0f;
		slur_st >>= 4;
		k = next_scut(s);
		draw_slur(s, k, -1, -1, slur_type)
		if (k.type != BAR
		 || (k.bar_type[0] != ':'
		  && k.bar_type != "|]"
		  && k.bar_type != "[|"
		  && (!k.text || k.text[0] == '1'))) {
/*fixme: the slur types are inverted again*/
			p_voice.slur_start <<= 4;
			p_voice.slur_start += slur_type
		}
	}
}

/* -- draw the symbols near the notes -- */
/* (the staves are not yet defined) */
/* order:
 * - beams
 * - decorations near the notes
 * - measure bar numbers
 * - n-plets
 * - decorations tied to the notes
 * - slurs
 * - guitar chords
 * - then remaining decorations
 * The buffer output is delayed until the definition of the staff system
 */
function draw_sym_near() {
	var p_voice, p_st, s, v, st, y, g, w, top, bot, i, st

	/* calculate the beams but don't draw them (the staves are not yet defined) */
	for (v = 0; v < voice_tb.length; v++) {
		var	bm = {},
			first_note = true;

		p_voice = voice_tb[v]
		for (s = p_voice.sym; s; s = s.next) {
			if (s.type != NOTE)
				continue
			if ((s.beam_st && !s.beam_end)
			 || (first_note && !s.beam_st)) {
				first_note = false;
				calculate_beam(bm, s)
			}
		}
	}

	/* initialize the min/max vertical offsets */
	for (st = 0; st <= nstaff; st++) {
		p_st = staff_tb[st]
		if (!p_st.top) {
			p_st.top = [];
			p_st.bot = []
		}
		for (i = 0; i < YSTEP; i++) {
			p_st.top[i] = 0;
			p_st.bot[i] = 24
		}
	}

	set_tie_room();
	draw_deco_near()

	/* set the min/max vertical offsets */
	for (s = tsfirst; s; s = s.ts_next) {
		if (s.invisible)
			continue
		if (s.type == GRACE) {
			for (g = s.extra; g; g = g.next) {
				y_set(s.st, true, g.x - 2, 4, g.ymx + 1);
				y_set(s.st, false, g.x - 2, 4, g.ymn - 1)
			}
			continue
		}
		if (s.type != MREST) {
			y_set(s.st, true, s.x - s.wl, s.wl + s.wr, s.ymx + 2);
			y_set(s.st, false, s.x - s.wl, s.wl + s.wr, s.ymn - 2)
		} else {
			y_set(s.st, true, s.x - 16, 32, s.ymx + 2)
		}
		if (s.type != NOTE)
			continue

		/* have room for the accidentals */
		if (s.notes[s.nhd].acc) {
			y = s.y + 8
			if (s.ymx < y)
				s.ymx = y;
			y_set(s.st, true, s.x, 0, y)
		}
		if (s.notes[0].acc) {
			y = s.y
			if (s.notes[0].acc == 1		// sharp
			 || s.notes[0].acc == 3)	// natural
				y -= 7
			else
				y -= 5
			if (s.ymn > y)
				s.ymn = y;
			y_set(s.st, false, s.x, 0., y)
		}
	}

	if (cfmt.measurenb >= 0)
		draw_measnb();

	draw_deco_note()

	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v];
		s = p_voice.sym
		if (!s)
			continue
//fixme: KO: the voice has no color yet
//		set_color(p_voice.color);
//		st = cur_sy.voices[v].st;
		st = p_voice.st;
//  if (st == undefined) {
//error(1, s, "BUG: no staff for voice " + p_voice.id)
//    continue
//  }
//		output = staff_tb[st].output;
		set_dscale(st)

		/* draw the tuplets near the notes */
		for ( ; s; s = s.next) {
			if (!s.in_tuplet)
				continue
			for (g = s.extra; g; g = g.next) {
				if (g.type == TUPLET) {
					s = draw_tuplet(g, s)
					break
				}
			}
		}
		draw_all_slurs(p_voice)

		/* draw the tuplets over the slurs */
		for (s = p_voice.sym; s; s = s.next) {
			if (!s.in_tuplet)
				continue
			for (g = s.extra; g; g = g.next) {
				if (g.type == TUPLET) {
					s = draw_tuplet(g, s)
					break
				}
			}
		}
	}
//	set_color(undefined)

	/* set the top and bottom for all symbols to be out of the staves */
	for (st = 0; st <= nstaff; st++) {
		p_st = staff_tb[st];
		top = p_st.topbar + 2;
		bot = p_st.botbar - 2
/*fixme:should handle stafflines changes*/
		for (i = 0; i < YSTEP; i++) {
			if (top > p_st.top[i])
				p_st.top[i] = top
			if (bot < p_st.bot[i])
				p_st.bot[i] = bot
		}
	}

	/* if any lyric, draw them */
	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		if (p_voice.have_ly) {
//		 || p_voice.tblts) {
			draw_all_lyrics()
			break
		}
	}
	draw_deco_staff();
	set_sscale(-1)		/* restore the scale parameters */
}

/* -- draw the name/subname of the voices -- */
function draw_vname(indent) {
	var	p_voice, n, st, v, a_p, p, y,
		staff_d = []

	for (st = cur_sy.nstaff; st >= 0; st--) {
		if (!cur_sy.staves[st].empty)
			break
	}
	if (st < 0)
		return

	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		if (!p_voice.sym)
			continue
		st = cur_sy.voices[v].st
		if (!cur_sy.staves[st])
			continue
		if (cur_sy.staves[st].empty)
			continue
		if (p_voice.new_name) {
			delete p_voice.new_name
			p = p_voice.nm
		} else {
			p = p_voice.snm
		}
		if (!p)
			continue
		if (cur_sy.staves[st].flags & CLOSE_BRACE2) {
			while (!(cur_sy.staves[st].flags & OPEN_BRACE2))
				st--
		} else if (cur_sy.staves[st].flags & CLOSE_BRACE) {
			while (!(cur_sy.staves[st].flags & OPEN_BRACE))
				st--
		}
		if (!staff_d[st])
			staff_d[st] = p
		else
			staff_d[st] += "\\n" + p
	}
	if (staff_d.length == 0)
		return
	set_font("voice");
	indent = -indent * .5			/* center */
	for (st = 0; st < staff_d.length; st++) {
		if (!staff_d[st])
			continue
		a_p = staff_d[st].split('\\n');
		y = staff_tb[st].y
			+ staff_tb[st].topbar * .5
				* staff_tb[st].staffscale
			+ 9 * (a_p.length - 1)
			- gene.curfont.size * .3;
		n = st
		if (cur_sy.staves[st].flags & OPEN_BRACE2) {
			while (!(cur_sy.staves[n].flags & CLOSE_BRACE2))
				n++
		} else if (cur_sy.staves[st].flags & OPEN_BRACE) {
			while (!(cur_sy.staves[n].flags & CLOSE_BRACE))
				n++
		}
		if (n != st)
			y -= (staff_tb[st].y - staff_tb[n].y) * .5
		for (n = 0; n < a_p.length; n++) {
			p = a_p[n];
			xy_str(indent, y, p, "c");
			y -= 18
		}
	}
}

/* -- set the y offset of the staves and return the height of the whole system -- */
function set_staff() {
	var	s, sy, i, st, prev_staff, v,
		y, staffsep, dy, maxsep, mbot, val, p_voice, p_staff,
		empty = []

	/* search the empty staves in each parts */
	for (st = 0; st <= nstaff; st++) {
		staff_tb[st].empty = false;
		empty[st] = true
	}
	sy = cur_sy
	for (st = 0; st < sy.staves.length; st++) {
		if (!sy.staves[st].empty)
			empty[st] = false
	}
//--fixme: could use sy.next with a stop flag
	for (s = tsfirst; s; s = s.ts_next) {
		if (!s.new_sy)
			continue
		sy = sy.next
		for (st = 0; st < sy.staves.length; st++) {
			if (!sy.staves[st].empty)
				empty[st] = false
		}
	}

	/* set the scale of the voices
	 * and flag as non empty the staves with tablatures */
	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		if (p_voice.scale != 1)
			p_voice.scale_str = 
				'transform="scale(' + p_voice.scale.toFixed(2) + ')"'
//		if (p_voice.tblts)
//			empty[p_voice.st] = false
	}

	/* set the vertical offset of the 1st staff */
	for (st = 0; st <= nstaff; st++) {
		if (!empty[st])
			break
		staff_tb[st].empty = true
	}
	y = 0
	if (st > nstaff) {
		st--			/* one staff, empty */
	} else {
		p_staff = staff_tb[st]
		for (i = 0; i < YSTEP; i++) {
			val = p_staff.top[i]
			if (y < val)
				y = val
		}
	}

	/* draw the parts and tempo indications if any */
	y += draw_partempo(st, y)

	if (empty[st])
		return y

	staffsep = cfmt.staffsep * 0.5 +
			staff_tb[st].topbar * staff_tb[st].staffscale
	if (y < staffsep)
		y = staffsep
	p_staff.y = -y;

	/* set the offset of the other staves */
	prev_staff = st
	var sy_staff_prev = sy.staves[prev_staff]
	for (st++; st <= nstaff; st++) {
		p_staff = staff_tb[st]
		if (empty[st]) {
			p_staff.empty = true
			continue
		}
		if (sy_staff_prev.sep)
			staffsep = sy_staff_prev.sep
		else
			staffsep = cfmt.sysstaffsep
		if (sy_staff_prev.maxsep)
			maxsep = sy_staff_prev.maxsep
		else
			maxsep = cfmt.maxsysstaffsep;

		dy = 0
		if (p_staff.staffscale == staff_tb[prev_staff].staffscale) {
			for (i = 0; i < YSTEP; i++) {
				val = p_staff.top[i] -
						staff_tb[prev_staff].bot[i]
				if (dy < val)
					dy = val
			}
			dy *= p_staff.staffscale
		} else {
			for (i = 0; i < YSTEP; i++) {
				val = p_staff.top[i] * p_staff.staffscale
				  - staff_tb[prev_staff].bot[i]
					* staff_tb[prev_staff].staffscale
				if (dy < val)
					dy = val
			}
		}
		staffsep += p_staff.topbar * p_staff.staffscale
		if (dy < staffsep)
			dy = staffsep
		maxsep += p_staff.topbar * p_staff.staffscale
		if (dy > maxsep)
			dy = maxsep
		y += dy;
		p_staff.y = -y;

		prev_staff = st;
		sy_staff_prev = sy.staves[prev_staff]
	}
	mbot = 0
	for (i = 0; i < YSTEP; i++) {
		val = staff_tb[prev_staff].bot[i]
		if (mbot > val)
			mbot = val
	}
	mbot *= staff_tb[prev_staff].staffscale

	/* output the staff offsets */
	for (st = 0; st <= nstaff; st++) {
		p_staff = staff_tb[st];
		dy = p_staff.y
		if (p_staff.staffscale != 1) {
			p_staff.scale_str =
				'transform="translate(0,' +
					(posy - dy).toFixed(2) + ') ' +
				'scale(' + p_staff.staffscale.toFixed(2) + ')"';
			p_staff.y_delayed = 0
		} else {
			p_staff.y_delayed = posy - dy
		}
	}

	if (mbot == 0) {
		for (st = nstaff; st >= 0; st--) {
			if (!empty[st])
				break
		}
		if (st < 0)		/* no symbol in this system ! */
			return y
	}
	dy = -mbot;
	staffsep = cfmt.staffsep * 0.5
	if (dy < staffsep)
		dy = staffsep;
	maxsep = cfmt.maxstaffsep * 0.5
	if (dy > maxsep)
		dy = maxsep;
	y += dy
	if (y > cfmt.maxstaffsep)
		y = cfmt.maxstaffsep

	/* return the whole staff system height */
	return y
}

/* -- set the bottom and height of the measure bars -- */
		/* !! max number of staff lines !! */
//var	top_staff = [18, 18, 12, 18, 18, 24, 30, 36, 42, 48],
//	bot_staff = [ 6,  6,  6,  6,  0,  0,  0,  0,  0,  0]

function bar_set(bar_bot, bar_height) {
	var	bar_bot = [],
		bar_height = [],
		st, nlines, staffscale, top, bot,
		dy = 0

	for (st = 0; st <= cur_sy.nstaff; st++) {
		if (cur_sy.staves[st].empty) {
			bar_bot[st] = bar_height[st] = 0
			continue
		}
//		nlines = staff_tb[st].stafflines.length;
		top = staff_tb[st].topbar;
		bot = staff_tb[st].botbar;
		staffscale = staff_tb[st].staffscale
		if (dy == 0)
//			dy = staff_tb[st].y + top_staff[nlines] * staffscale;
			dy = staff_tb[st].y + top * staffscale;
		bar_height[st] = dy
//				- staff_tb[st].y - bot_staff[nlines] * staffscale;
				- staff_tb[st].y - bot * staffscale;
//		bar_bot[st] = staff_tb[st].y + bot_staff[nlines] * staffscale
		bar_bot[st] = staff_tb[st].y + bot * staffscale
		if (cur_sy.staves[st].flags & STOP_BAR)
			dy = 0
		else
			dy = bar_bot[st]
	}
	return [bar_bot, bar_height]
}

/* -- draw the staff systems and the measure bars -- */
function draw_systems(indent) {
	var	next_sy, s, s2, st, x, x2, res,
		xstaff = []

	/* -- draw a staff -- */
	function draw_staff(st, x1, x2) {
		var	w, i, dx,
			y = staff_tb[st].y,
			stafflines = staff_tb[st].stafflines

		if (stafflines[stafflines.length - 1] == '.')
			return
		set_sscale(st);
		w = (x2 - x1) / stv_g.scale
		for (i = 0; i < stafflines.length; i++) {
			if (stafflines[i] != '.')
				break
			y += 6
		}
		xypath(x1, y);
		output.push('h' + w.toFixed(2));
		y = 0
		for (i++; i < stafflines.length; i++) {
			y -= 6
			if (stafflines[i] != '.') {
				output.push('m-' + w.toFixed(2) + ' ' + y);
				output.push('h' + w.toFixed(2));
				y = 0
			}
		}
		output.push('"/>\n')
	}

	draw_vname(indent)

	/* draw the staff, skipping the staff breaks */
	for (st = 0; st <= nstaff; st++)
		xstaff[st] = (!cur_sy.staves[st] || cur_sy.staves[st].empty) ?
				-1 : 0;
	res = bar_set()
	var	bar_bot = res[0],
		bar_height = res[1];
	draw_lstaff(0)
	for (s = tsfirst; s; s = s.ts_next) {
		if (s.new_sy) {
//fixme next_sy useless
			next_sy = cur_sy.next
			for (st = 0; st <= nstaff; st++) {
				x = xstaff[st]
				if (x < 0) {			// no staff yet
					if (next_sy.staves[st]
					 && !next_sy.staves[st].empty) {
						if (s.type == BAR)
							xstaff[st] = s.x
						else
							xstaff[st] = s.x - s.wl - 2
					}
					continue
				}
				if (s.ts_prev.type == BAR)
					x2 = s.ts_prev.x
				else
					x2 = s.x - s.wl - 2
				if (!next_sy.staves[st]
				 || next_sy.staves[st].empty) { //staff stop
					xstaff[st] = -1
				} else if (next_sy.staves[st].stafflines
						== cur_sy.staves[st].stafflines) {
					continue
				} else {
					xstaff[st] = x2
				}
				draw_staff(st, x, x2)
			}
			cur_sy = next_sy;
			res = bar_set();
			bar_bot = res[0];
			bar_height = res[1]
		}
		st = s.st
		switch (s.type) {
		case BAR:
			if (s.second
			 || cur_sy.staves[st].empty)
				s.invisible = true
			if (s.invisible)
				break
			if (user.anno_start)
				anno_start(s);
			draw_bar(s, bar_bot[st], bar_height[st])
			if (user.anno_stop)
				anno_stop(s)
			break
		case STBRK:
			if (cur_sy.voices[s.v].range == 0) {
				if (s.xmx > 14) {

					/* draw the left system if stbrk in all voices */
					var nvoice = 0
					for (var i = 0; i < voice_tb.length; i++) {
						if (cur_sy.voices[i].range > 0)
							nvoice++
					}
					for (s2 = s.ts_next; s2; s2 = s2.ts_next) {
						if (s2.type != STBRK)
							break
						nvoice--
					}
					if (nvoice == 0)
						draw_lstaff(s.x)
				}
			}
			s2 = s.prev
			if (!s2)
				break
			x2 = s2.x
			if (s2.type != BAR)
				x2 += s2.wr;
			st = s.st;
			x = xstaff[st]
			if (x >= 0) {
				if (x >= x2)
					continue
				draw_staff(st, x, x2)
			}
			xstaff[st] = s.x
			break
		default:
//fixme:does not work for "%%staves K: M: $" */
//removed for K:/M: in empty staves
//			if (cur_sy.staves[st].empty)
//				s.invisible = true
			break
		}
	}
	for (st = 0; st <= nstaff; st++) {
		if ((x = xstaff[st]) < 0)
//		 || x >= realwidth - 8)
			continue
		draw_staff(st, x, realwidth)
	}
//	set_sscale(-1)
}

/* -- draw remaining symbols when the staves are defined -- */
function draw_symbols(p_voice) {
	var	bm = {},
		s, g, x, y, st, first_note;

//	bm.s2 = undefined
	first_note = true;
	for (s = p_voice.sym; s; s = s.next) {
		if (s.extra) {
			for (g = s.extra; g; g = g.next) {
				if (g.type == FORMAT
				 && g.fmt_type == "voicecolor") {
					p_voice.color = g.color;
					set_color(p_voice.color)
				}
			}
		}
		if (s.invisible
		 && s.type != NOTE && s.type != REST
		 && s.type != GRACE)
			continue
		x = s.x
		switch (s.type) {
		case NOTE:
//--fixme: recall set_scale if different staff
			set_color(p_voice.color);
			set_scale(s);
			if ((s.beam_st && !s.beam_end)
			 || (first_note && !s.beam_st)) {
				first_note = false
				if (calculate_beam(bm, s))
					draw_beams(bm)
			}
			if (user.anno_start)
				anno_start(s);
			draw_note(s, !bm.s2)
			if (user.anno_stop)
				anno_stop(s)
			if (s == bm.s2)
				bm.s2 = null
			break
		case REST:
			set_color(p_voice.color);
			set_scale(s)
			if (user.anno_start)
				anno_start(s);
			draw_rest(s)
			if (user.anno_stop)
				anno_stop(s)
			break
		case BAR:
			break			/* drawn in draw_systems */
		case CLEF:
			st = s.st
			if (s.second)
/*			 || p_voice.st != st)	*/
				break		/* only one clef per staff */
			if (s.invisible
			 || staff_tb[st].empty)
				break
			set_color(undefined);
			set_sscale(st)
			if (user.anno_start)
				anno_start(s);
			y = staff_tb[st].y
			if (s.clef_name)
				xygl(x, y + s.y, s.clef_name)
			else if (!s.clef_small)
				xygl(x, y + s.y, s.clef_type + "clef")
			else
				xygl(x, y + s.y, "s" + s.clef_type + "clef")
			if (s.clef_octave) {
/*fixme:break the compatibility and avoid strange numbers*/
				if (s.clef_octave > 0) {
					y += s.ymx - 10
					if (s.clef_small)
						y -= 1
				} else {
					y += s.ymn + 2
					if (s.clef_small)
						y += 1
				}
				xygl(x - 2, y, "oct")
			}
			if (user.anno_stop)
				anno_stop(s)
//			set_scale(p_voice.sym)
			break
		case METER:
			p_voice.meter = s
			if (s.second
			 || staff_tb[s.st].empty)
				break
			if (cfmt.alignbars && s.st != 0)
				break
			set_color(undefined);
			set_sscale(s.st)
			if (user.anno_start)
				anno_start(s)
			draw_meter(x, s)
			if (user.anno_stop)
				anno_stop(s)
//			set_scale(p_voice.sym)
			break
		case KEY:
			p_voice.key = s
			if (s.second
			 || staff_tb[s.st].empty)
				break
			set_color(undefined);
			set_sscale(s.st)
			if (user.anno_start)
				anno_start(s);
			draw_keysig(p_voice, x, s)
			if (user.anno_stop)
				anno_stop(s)
//			set_scale(p_voice.sym)
			break
		case MREST:
			set_color(p_voice.color);
			set_scale(s);
			xygl(x, staff_tb[s.st].y + 12, "mrest");
			output.push('<text style="font:bold 15px serif"\n\
	x ="');
			out_sxsy(x, '" y="', staff_tb[s.st].y + 28);
			output.push('" text-anchor="middle">' + s.nmes + '</text>\n')
			break
		case GRACE:
			set_color(p_voice.color);
			set_scale(s);
			draw_gracenotes(s)
			break
		case SPACE:
		case STBRK:
		case FORMAT:
			break			/* nothing */
		case CUSTOS:
			set_color(p_voice.color);
			set_scale(s);
			s.stemless = true;
			draw_note(s, 0)
			break
		default:
			error(2, s, "draw_symbols - Cannot draw symbol " + s.type)
			break
		}
	}
	set_color(p_voice.color);
	set_scale(p_voice.sym);
	draw_all_ties(p_voice);
	set_color(undefined)
}

/* -- draw all symbols -- */
function draw_all_sym() {
	var	p_voice, s, v,
		n = voice_tb.length

	for (v = 0; v < n; v++) {
		p_voice = voice_tb[v]
//		if (p_voice.sym
//		 && !staff_tb[p_voice.st].empty)
		if (p_voice.sym)
			draw_symbols(p_voice)
	}

	// update the clefs
	for (s = tsfirst; s; s = s.ts_next) {
		if (s.type == CLEF)
			staff_tb[s.st].clef = s
	}
}

/* -- set the tie directions for one voice -- */
function set_tie_dir(sym) {
	var s, i, ntie, dir, sec, pit, ti

	for (s = sym; s; s = s.next) {
		if (!s.ti1)
			continue

		/* if other voice, set the ties in opposite direction */
		if (s.multi != 0) {
			dir = s.multi > 0 ? SL_ABOVE : SL_BELOW
			for (i = 0; i <= s.nhd; i++) {
				ti = s.notes[i].ti1;
				if (!((ti & 0x07) == SL_AUTO))
					continue
				s.notes[i].ti1 = (ti & SL_DOTTED) | dir
			}
			continue
		}

		/* if one note, set the direction according to the stem */
		sec = ntie = 0;
		pit = 128
		for (i = 0; i <= s.nhd; i++) {
			if (s.notes[i].ti1) {
				ntie++
				if (pit < 128
				 && s.notes[i].pit <= pit + 1)
					sec++;
				pit = s.notes[i].pit
			}
		}
		if (ntie <= 1) {
			dir = s.stem < 0 ? SL_ABOVE : SL_BELOW
			for (i = 0; i <= s.nhd; i++) {
				ti = s.notes[i].ti1
				if (ti != 0) {
					if ((ti & 0x07) == SL_AUTO)
						s.notes[i].ti1 =
							(ti & SL_DOTTED) | dir
					break
				}
			}
			continue
		}
		if (sec == 0) {
			if (ntie & 1) {
/* in chords with an odd number of notes, the outer noteheads are paired off
 * center notes are tied according to their position in relation to the
 * center line */
				ntie = (ntie - 1) / 2;
				dir = SL_BELOW
				for (i = 0; i <= s.nhd; i++) {
					ti = s.notes[i].ti1
					if (ti == 0)
						continue
					if (ntie == 0) {	/* central tie */
						if (s.notes[i].pit >= 22)
							dir = SL_ABOVE
					}
					if ((ti & 0x07) == SL_AUTO)
						s.notes[i].ti1 =
							(ti & SL_DOTTED) | dir
					if (ntie-- == 0)
						dir = SL_ABOVE
				}
				continue
			}
/* even number of notes, ties divided in opposite directions */
			ntie /= 2;
			dir = SL_BELOW
			for (i = 0; i <= s.nhd; i++) {
				ti = s.notes[i].ti1
				if (ti == 0)
					continue
				if ((ti & 0x07) == SL_AUTO)
					s.notes[i].ti1 =
						(ti & SL_DOTTED) | dir
				if (--ntie == 0)
					dir = SL_ABOVE
			}
			continue
		}
/*fixme: treat more than one second */
/*		if (nsec == 1) {	*/
/* When a chord contains the interval of a second, tie those two notes in
 * opposition; then fill in the remaining notes of the chord accordingly */
			pit = 128
			for (i = 0; i <= s.nhd; i++) {
				if (s.notes[i].ti1) {
					if (pit < 128
					 && s.notes[i].pit <= pit + 1) {
						ntie = i
						break
					}
					pit = s.notes[i].pit
				}
			}
			dir = SL_BELOW
			for (i = 0; i <= s.nhd; i++) {
				ti = s.notes[i].ti1
				if (ti == 0)
					continue
				if (ntie == i)
					dir = SL_ABOVE
				if ((ti & 0x07) == SL_AUTO)
					s.notes[i].ti1 = (ti & SL_DOTTED) | dir
			}
/*fixme..
			continue
		}
..*/
/* if a chord contains more than one pair of seconds, the pair farthest
 * from the center line receives the ties drawn in opposition */
	}
}

/* -- have room for the ties out of the staves -- */
function set_tie_room() {
	var p_voice, s, s2, v, dx, y, dy

	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v];
		s = p_voice.sym
		if (!s)
			continue
		s = s.next
		if (!s)
			continue
		set_tie_dir(s)
		for ( ; s; s = s.next) {
			if (!s.ti1)
				continue
			if (s.notes[0].pit < 20
			 && (s.notes[0].ti1 & 0x07) == SL_BELOW)
				;
			else if (s.notes[s.nhd].pit > 24
			      && (s.notes[s.nhd].ti1 & 0x07) == SL_ABOVE)
				;
			else
				continue
			s2 = s.next
			while (s2 && s2.type != NOTE)
				s2 = s2.next
			if (s2) {
				if (s2.st != s.st)
					continue
				dx = s2.x - s.x - 10
			} else {
				dx = realwidth - s.x - 10
			}
			if (dx < 100)
				dy = 9
			else if (dx < 300)
				dy = 12
			else
				dy = 16
			if (s.notes[s.nhd].pit > 24) {
				y = 3 * (s.notes[s.nhd].pit - 18) + dy
				if (s.ymx < y)
					s.ymx = y
				if (s2 && s2.ymx < y)
					s2.ymx = y;
				y_set(s.st, true, s.x + 5, dx, y)
			}
			if (s.notes[0].pit < 20) {
				y = 3 * (s.notes[0].pit - 18) - dy
				if (s.ymn > y)
					s.ymn = y
				if (s2 && s2.ymn > y)
					s2.ymn = y;
				y_set(s.st, false, s.x + 5, dx, y)
			}
		}
	}
}
// abc2svg - format.js - formatting functions
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

var	defined_font = {},
	font_tb = {},
	fid = 1,
	font_scale_tb = {
		serif: 1.05,
		serifBold: 1.05,
		'sans-serif': 1.1,
		'sans-serifBold': 1.15,
		Palatino: 1.1,
		Mono: 1.35
	},
	lock= {}

var cfmt = {
//	autoclef: true,
	aligncomposer: 1,
//	botmargin: 0.7 * IN,		// != 1.8 * CM,
	breaklimit: 0.7,
	breakoneoln: true,
	composerspace: 6,
	combinevoices: 0,
//	contbarnb: 0,
	dblrepbar: ':][:',
	decoerr: true,
	dynalign: true,
	fullsvg: '',
	gracespace: [6.5, 8, 12],	/* left, inside, right */
	graceslurs: true,
	hyphencont: true,
	indent: 0,
	infoname: 'R "Rhythm: "\n\
B "Book: "\n\
S "Source: "\n\
D "Discography: "\n\
N "Notes: "\n\
Z "Transcription: "\n\
H "History: "',
	infospace: 0,
	keywarn: true,
	leftmargin: 0.7 * IN,
	lineskipfac: 1.1,
	linewarn: true,
	maxshrink: 0.65,
	maxstaffsep: 2000,
	maxsysstaffsep: 2000,
	measurefirst: 1,
	measurenb: -1,
	musicspace: 6,
//	notespacingfactor: 1.414,
	parskipfac: 0.4,
	partsspace: 8,
//	pageheight: 29.7 * CM,
	pagewidth: 21 * CM,
	pos: {
		dyn: 0,
		gch: 0,
		gst: 0,
		orn: 0,
		ste: 0,
		voc: 0,
		vol: 0
	},
	rightmargin: 0.7 * IN,
	scale: 1,
	slurheight: 1.0,
	staffnonote: 1,
	staffsep: 46,
	stemheight: 21,			// one octave
	stretchlast: 0.25,
	stretchstaff: true,
	subtitlespace: 3,
	sysstaffsep: 34,
//	textoption: undefined,
	textspace: 14,
//	titleleft: false,
	titlespace: 6,
	titletrim: true,
	transpose: 0,			// global transpose
//	topmargin: 0.7 * IN,
	topspace: 22,
	tuplets: [0, 0, 0],
	vocalspace: 23,
	writefields: "CMOPQTWw",
	wordsspace: 5
}

function get_bool(param) {
	return !param.match(/^(0|n|f)/i)
}

function get_int(param) {
	var	v = parseInt(param)

	if (isNaN(v)) {
		parse.line.error("Bad integer value\n");
		v = 1
	}
	return v
}

// %%font <font> [<encoding>] <scale>]
function get_font_scale(param) {
	var	a = param.split(/\s+/)	// a[0] = font name

	if (a.length <= 1)
		return
	var scale = parseFloat(a[a.length - 1])

	if (isNaN(scale) || a <= 0) {
		parse.line.error("Bad scale value in %%font")
		return
	}
	font_scale_tb[a[0]] = scale
	for (var fn in font_tb) {
		var font = font_tb[fn]
		if (font.name == a[0])
			font.swfac = font.size * scale
	}
}

// %%xxxfont fontname|* [encoding] [size|*]
function param_set_font(xxxfont, param) {
	var font, fn, old_fn, n, a, new_name, new_fn, new_size, scale

	// "setfont-<n>" goes to "u<n>font"
	if (xxxfont[xxxfont.length - 2] == '-') {
		n = xxxfont[xxxfont.length - 1]
		if (n < '1' || n > '9')
			return
		xxxfont = "u" + n + "font"
	}
	fn = cfmt[xxxfont]
	if (fn) {
		font = font_tb[fn]
		if (font)
			old_fn = font.name + "." + font.size
	}
	a = param.split(/\s+/);
	new_name = a[0]
	if (new_name == "*"
	 && font) {
		new_name = font.name
	} else {
		new_name = new_name.replace('Times-Roman', 'serif');
		new_name = new_name.replace('Times', 'serif');
		new_name = new_name.replace('Helvetica', 'sans-serif');
		new_name = new_name.replace('Courier', 'monospace')
	}
	if (a.length > 1) {
		new_size = a[a.length - 1]
		if (new_size == '*')
			new_size = font.size
	} else {
		new_size = font.size
	}
	new_fn = new_name + "." + new_size
	if (new_fn == old_fn)
		return
	font = font_tb[new_fn]
	if (!font) {
		scale = font_scale_tb[new_name]
		if (!scale)
			scale = 1.1;
		font = {
			name: new_name,
			size: Number(new_size),
			swfac: new_size * scale
		}
		font_tb[new_fn] = font
	}
	cfmt[xxxfont] = new_fn
}

/* -- get a value with a unit in 72 PPI -- */
function get_unit(param) {
//-fixme: check the value
	var v = parseFloat(param)

	switch (param.slice(-2)) {
	case "CM":
	case "cm":
		v *= 28.35
		break
	case "IN":
	case "in":
		v *= 72
		break
	}
	return v
}

/* -- get a page value with a unit -- */
function get_unitp(param) {
//-fixme: check the value
	var v = parseFloat(param)

	switch (param.slice(-2)) {
	case "CM":
	case "cm":
		v *= CM
		break
	case "IN":
	case "in":
		v *= IN
		break
//	default:
//		unit required...
	}
	return v
}

// set the infoname
function set_infoname(param) {
//fixme: check syntax: '<letter> ["string"]'
	var	tmp = cfmt.infoname.split("\n"),
		letter = param[0]

	for (var i = 0; i < tmp.length; i++) {
		var infoname = tmp[i]
		if (infoname[0] != letter)
			continue
		if (param.length == 1)
			tmp.splice(i, 1)
		else
			tmp[i] = param
		cfmt.infoname = tmp.join('\n')
		return
	}
	cfmt.infoname += "\n" + param
}

// get the text option
const textopt = {
	align: 'j',
	center: 'c',
	fill: 'f',
	justify: 'j',
	ragged: 'f',
	right: 'r',
	skip: 's'
}
function get_textopt(param) {
	return textopt[param]
}

/* -- position of a voice element -- */
const posval = {
	above: SL_ABOVE,
	below: SL_BELOW,
	down: SL_BELOW,
	hidden: SL_HIDDEN,
	opposite: SL_HIDDEN,
	up: SL_ABOVE
}

/* -- set the position of elements in a voice -- */
function set_pos(k,			// keyword
		   a) {			// value
	var v, val, pos

	if (a[0] >= '0' && a[0] <= '3')
		val = parseInt(a)
	else
		val = posval[a] || 0
	switch (k[0]) {
	case 'd':
		k = "dyn"		// dynamic
		break
	case 'g':
		if (k[1] == 'c')
			k = "gch"	// gchord
		else
			k = "gst"	// gstem
		break
	case 'o':
		k = "orn"		// ornament
		break
	case 's':
		k = "ste"		// stem
		break
	case 'v':
		if (k[2] == 'c')
			k = "voc"	// vocal
		else
			k = "vol"	// volume
		break
	default:
//fixme: error or no error?
		return
	}
	pos = curvoice ? curvoice.pos : cfmt.pos;
	pos[k] = val
	if (!curvoice) {
		for (v = 0; v < voice_tb.length; v++)
			voice_tb[v].pos[k] = val
	}
}

// set/unset the fields to write
function set_writefields(param) {
	var	c, i,
		a = param.split(/\s+/)

	if (get_bool(a[1])) {
		for (i = 0; i < a[0].length; i++) {	// set
			c = a[0][i]
			if (cfmt.writefields.indexOf(c) < 0)
				cfmt.writefields += c
		}
	} else {
		for (i = 0; i < a[0].length; i++) {	// unset
			c = a[0][i]
			if (cfmt.writefields.indexOf(c) >= 0)
				cfmt.writefields = cfmt.writefields.replace(c, '')
		}
	}
}

// set a format parameter
function set_format(cmd, param, lock) {
	var f, v, box

//fixme: should check the type and limits of the parameter values
	if (lock) {
		lock[cmd] = true
	} else if (lock[cmd])
		return

	if (cmd.match(/.+font$/)
	 || cmd.match(/.+font-[\d]$/)) {
		if (param.slice(-4) == " box") {
			box = true;
			param = param.slice(0, -4)
		}
		param_set_font(cmd, param)
		if (box) {
			switch (cmd) {
			case "gchordfont":
				cfmt.gchordbox = box
				break
//			case "annotationfont":
//				cfmt.annotationbox = box
//				break
			case "measurefont":
				cfmt.measurebox = box
				break
			case "partsfont":
				cfmt.partsbox = box
				break
			}
		}
		return
	}

	switch (cmd) {
	case "aligncomposer":
	case "barsperstaff":
	case "combinevoices":
	case "infoline":
	case "measurefirst":
	case "measurenb":
	case "shiftunison":
	case "staffnonote":
		cfmt[cmd] = get_int(param)
		break
	case "microscale":
		cfmt.microscale = get_int(param)
		if (parse.state == 0)
			break
//--fixme: should test curvoice
		if (parse.state == 1) {
			for (v = 0; v < voice_tb.length; v++)
				voice_tb[v].microscale = cfmt.microscale
		} else {
			if (parse.state == 2)
				goto_tune();
			curvoice.microscale = cfmt.microscale
		}
		break
	case "bgcolor":
	case "dblrepbar":
	case "titleformat":
		cfmt[cmd] = param
		break
	case "breaklimit":			// float values
	case "lineskipfac":
	case "maxshrink":
	case "pagescale":
	case "parskipfac":
	case "scale":
	case "slurheight":
	case "stemheight":
	case "stretchlast":
		f = parseFloat(param)
		if (!f) {
			parse.line.error("Bad value for " + cmd)
			break
		}
		if (cmd == "scale")	// old scale
			f /= 0.75
		else if (cmd == "pagescale")
			cmd = "scale";
		cfmt[cmd] = f
		break
//	case "autoclef":
	case "bstemdown":
	case "breakoneoln":
	case "cancelkey":
	case "custos":
	case "decoerr":
	case "dynalign":
	case "flatbeams":
	case "gchordbox":
	case "graceslurs":
	case "hyphencont":
	case "keywarn":
	case "linewarn":
	case "measurebox":
	case "partsbox":
	case "squarebreve":
	case "straightflags":
	case "stretchstaff":
	case "timewarn":
	case "titlecaps":
	case "titleleft":
	case "titletrim":
		cfmt[cmd] = get_bool(param)
		break
	case "composerspace":
	case "indent":
	case "infospace":
	case "maxstaffsep":
	case "maxsysstaffsep":
	case "musicspace":
	case "partsspace":
	case "staffsep":
	case "subtitlespace":
	case "sysstaffsep":
	case "textspace":
	case "titlespace":
	case "topspace":
	case "vocalspace":
	case "wordsspace":
		cfmt[cmd] = get_unit(param)
		break
//	case "botmargin":
	case "leftmargin":
//	case "pageheight":
	case "pagewidth":
	case "rightmargin":
//	case "topmargin":
		cfmt[cmd] = get_unitp(param)
		break
	case "contbarnb":
		cfmt.contbarnb = get_int(param)
		break
	case "writefields":
		set_writefields(param)
		break
	case "dynamic":
	case "gchord":
	case "gstemdir":
	case "ornament":
	case "stemdir":
	case "vocal":
	case "volume":
		set_pos(cmd, param)
		break
	case "font":
		get_font_scale(param)
		break
	case "fullsvg":
		if (parse.state != 0) {
			parse.line.error("Cannot have 'fullsvg' inside a tune")
			break
		}
//fixme: should check only alpha, num and '_' characters
		cfmt[cmd] = param
		break
	case "gracespace":
	case "tuplets":
		cfmt[cmd] = param.split(/\s+/)
		break
	case "infoname":
		set_infoname(param)
		break
	case "notespacingfactor":
		f = parseFloat(param)
		if (!f || f < 1 || f > 2) {
			parse.line.error("Bad value for notespacingfactor")
			break
		}
		i = 5				// index of crotchet
		var f2 = space_tb[i]
		for ( ; --i >= 0; ) {
			f2 /= f;
			space_tb[i] = f2
		}
		i = 5;
		f2 = space_tb[i]
		for ( ; ++i < space_tb.length; ) {
			f2 *= f;
			space_tb[i] = f2
		}
		break
	case "pos":
		cmd = param.match(/(\w|-)+/);
		cmd = cmd[0];
		param = param.replace(cmd, '').trim();
		set_pos(cmd, param)
		break
	case "staffwidth":
		v = cfmt.pagewidth - get_unitp(param) - cfmt.leftmargin

		if (v < 0)
			parse.line.error("'staffwidth' too big")
		else
			cfmt.rightmargin = v
		break
	case "textoption":
		cfmt[cmd] = get_textopt(param)
		break
	}
}

// font stuff

// initialize the default fonts
function font_init() {
	param_set_font("annotationfont", "sans-serif 12");
	param_set_font("composerfont", "serifItalic 14");
	param_set_font("gchordfont", "sans-serif 12");
	param_set_font("historyfont", "serif 16");
	param_set_font("infofont", "serifItalic 14");
	param_set_font("measurefont", "serifItalic 14");
	param_set_font("partsfont", "serif 15");
	param_set_font("repeatfont", "serif 13");
	param_set_font("subtitlefont", "serif 16");
	param_set_font("tempofont", "serifBold 15");
	param_set_font("textfont", "serif 16");
	param_set_font("titlefont", "serif 20");
	param_set_font("vocalfont", "serifBold 13");
	param_set_font("voicefont", "serifBold 13");
	param_set_font("wordsfont", "serif 16")
}

// output a font style
function style_add_font(font) {
	var	name = font.name,
		i = name.indexOf("Italic"),
		j = 100,
		o = name.indexOf("Oblique"),
		b = name.indexOf("Bold")

	font_style += "\n.f" + font.fid + cfmt.fullsvg + " {font:"
	if (b > 0) {
		font_style += "bold ";
		j = b
	}
	if (i > 0 || o > 0) {
		if (i > 0) {
			font_style += "italic "
			if (i < j)
				j = i
		}
		if (o > 0) {
			font_style += "oblique "
			if (o < j)
				j = o
		}
	}
	if (j != 100) {
		if (name[j - 1] == '-')
			j--;
		name = name.slice(0, j)
	}
	font_style += font.size + "px " + name + "}"
}

// use the font
function use_font(font) {
	if (!defined_font[font.fid]) {
		defined_font[font.fid] = true;
		style_add_font(font)
	}
}

// get the font of the 'xxxfont' parameter
function get_font(xxx) {
	xxx += "font"
	var	fn = cfmt[xxx],
		font = font_tb[fn]
	if (!font) {
		parse.line.error("Unknown font " + xxx)
		return null
	}
	if (!font.fid)
		font.fid = fid++;
	use_font(font)
	return font
}
// abc2svg - front.js - ABC parsing front-end
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

/* translation table from the ABC draft version 2 */
var abc_utf = {
	"`A": "À",
	"`E": "È",
	"`I": "Ì",
	"`O": "Ò",
	"`U": "Ù",
	"`a": "à",
	"`e": "è",
	"`i": "ì",
	"`o": "ò",
	"`u": "ù",
	"'A": "Á",
	"'E": "É",
	"'I": "Í",
	"'O": "Ó",
	"'U": "Ú",
	"'Y": "Ý",
	"'a": "á",
	"'e": "é",
	"'i": "í",
	"'o": "ó",
	"'u": "ú",
	"'y": "ý",
	"'S": "Ś",
	"'Z": "Ź",
	"'s": "ś",
	"'z": "ź",
	"'R": "Ŕ",
	"'L": "Ĺ",
	"'C": "Ć",
	"'N": "Ń",
	"'r": "ŕ",
	"'l": "ĺ",
	"'c": "ć",
	"'n": "ń",
	"^A": "Â",
	"^E": "Ê",
	"^I": "Î",
	"^O": "Ô",
	"^U": "Û",
	"^a": "â",
	"^e": "ê",
	"^i": "î",
	"^o": "ô",
	"^u": "û",
	"^H": "Ĥ",
	"^J": "Ĵ",
	"^h": "ĥ",
	"^j": "ĵ",
	"^C": "Ĉ",
	"^G": "Ĝ",
	"^S": "Ŝ",
	"^c": "ĉ",
	"^g": "ĝ",
	"^s": "ŝ",
	",C": "Ç",
	",c": "ç",
	",S": "Ş",
	",s": "ş",
	",T": "Ţ",
	",t": "ţ",
	",R": "Ŗ",
	",L": "Ļ",
	",G": "Ģ",
	",r": "ŗ",
	",l": "ļ",
	",g": "ģ",
	",N": "Ņ",
	",K": "Ķ",
	",n": "ņ",
	",k": "ķ",
	'"A': "Ä",
	'"E': "Ë",
	'"I': "Ï",
	'"O': "Ö",
	'"U': "Ü",
	'"Y': "Ÿ",
	'"a': "ä",
	'"e': "ë",
	'"i': "ï",
	'"o': "ö",
	'"u': "ü",
	'"y': "ÿ",
	"~A": "Ã",
	"~N": "Ñ",
	"~O": "Õ",
	"~a": "ã",
	"~n": "ñ",
	"~o": "õ",
	"~I": "Ĩ",
	"~i": "ĩ",
	"~U": "Ũ",
	"~u": "ũ",
	"oA": "Å",
	"oa": "å",
	"oU": "Ů",
	"ou": "ů",
	"=A": "Ā",
	"=D": "Đ",
	"=E": "Ē",
	"=H": "Ħ",
	"=I": "Ī",
	"=O": "Ō",
	"=T": "Ŧ",
	"=U": "Ū",
	"=a": "ā",
	"=d": "đ",
	"=e": "ē",
	"=h": "ħ",
	"=i": "ī",
	"=o": "ō",
	"=t": "ŧ",
	"=u": "ū",
	"/O": "Ø",
	"/o": "ø",
	"/D": "Đ",
	"/d": "đ",
	"/L": "Ł",
	"/l": "ł",
	";A": "Ą",
	";E": "Ę",
	";I": "Į",
	";U": "Ų",
	";a": "ą",
	";e": "ę",
	";i": "į",
	";u": "ų",
	"vL": "Ľ",
	"vS": "Š",
	"vT": "Ť",
	"vZ": "Ž",
	"vl": "ľ",
	"vs": "š",
	"vt": "ť",
	"vz": "ž",
	"vC": "Č",
	"vE": "Ě",
	"vD": "Ď",
	"vN": "Ň",
	"vR": "Ř",
	"vc": "č",
	"ve": "ě",
	"vd": "ď",
	"vn": "ň",
	"vr": "ř",
	"uA": "Ă",
	"ua": "ă",
	"uE": "Ĕ",
	"ue": "ĕ",
	"uG": "Ğ",
	"ug": "ğ",
	"uI": "Ĭ",
	"ui": "ĭ",
	"uO": "Ŏ",
	"uo": "ŏ",
	"uU": "Ŭ",
	"uu": "ŭ",
	":O": "Ő",
	":U": "Ű",
	":o": "ő",
	":u": "ű",
	".Z": "Ż",
	".z": "ż",
	".I": "İ",
	".i": "ı",
	".C": "Ċ",
	".c": "ċ",
	".G": "Ġ",
	".g": "ġ",
	".E": "Ė",
	".e": "ė",
	"AA": "Å",
	"aa": "å",
	"AE": "Æ",
	"ae": "æ",
	"cc": "ç",
	"cC": "Ç",
	"DH": "Ð",
	"dh": "ð",
	"ng": "ŋ",
	"OE": "Œ",
	"oe": "œ",
	"ss": "ß",
	"TH": "Þ",
	"th": "þ"
}

// convert the escape sequences to utf-8
function cnv_escape(src) {
	var	c, c2,
		dst = "",
		i, j = 0, codeUnits
	while (1) {
		i = src.indexOf('\\', j)
		if (i < 0)
			break
		dst += src.slice(j, i);
		c = src[++i]
		if (c == undefined)
			return dst + '\\'
		switch (c) {
		case '0':
		case '2':
			if (src[i + 1] == '0') {
				switch (src[i + 2]) {	// compatibility
				case '1':
					dst += "\u266f"
					j = i + 3
					continue
				case '2':
					dst += "\u266d"
					j = i + 3
					continue
				case '3':
					dst += "\u266e"
					j = i + 3
					continue
				case '4':
					codeUnits = [0xd834, 0xdd2a]
					dst += String.fromCharCode.apply(null, codeUnits);
					j = i + 3
					continue
				case '5':
					codeUnits = [0xd834, 0xdd2b]
					dst += String.fromCharCode.apply(null, codeUnits);
					j = i + 3
					continue
				}
			}
				// fall thru
		case '1':
		case '3':
			if (src[i + 1] >= '0' && src[i + 1] <= '7'
			 && src[i + 2] >= '0' && src[i + 2] <= '7') {
				j = parseInt(src.slice(i, i + 3), 8);
				dst += String.fromCharCode(j);
				j = i + 3
				continue
			}
			break
		case 'u':
			codeUnits = []
			j = parseInt(src.slice(i + 1, i + 5), 16);
			codeUnits.push(j)
			if (j >= 0xd800 && j <= 0xdfff) {	// surrogates
				j = parseInt(src.slice(i + 7, i + 11), 16);
				codeUnits.push(j);
				j = i + 11
			} else {
				j = i + 5
			}
			dst += String.fromCharCode.apply(null, codeUnits)
			continue
		default:
			c2 = abc_utf[src.slice(i, i + 2)]
			if (c2) {
				dst += c2;
				j = i + 2
				continue
			}
			break
		}
		dst += '\\' + c;
		j = i + 1
	}
	return dst + src.slice(j)
}

// ABC include
var include = 2

function do_include(fname) {
	var file, parse_sav

	if (!user.read_file) {
		syntax(1, "No read_file support")
		return
	}
	if (include <= 0) {
		syntax(1, "Too many include levels")
		return
	}
	include--;
	file = user.read_file(fname)
	if (!file) {
		error(1, undefined, "Cannot read file '" + fname + "'")
		return
	}
	parse_sav = clone(parse);
	tosvg(fname, file);
	parse = parse_sav;
	include++
}

// parse the input file
function tosvg(in_fname,		// file name
		file) {			// file content
	var	i, c, bol, eol, boc, eoc, end,
		ext, select,
		line0, line1,
		last_info, opt, text, a, b, s,
		cfmt_sav, info_sav, char_tb_sav, glovar_sav, maps_sav,
		pscom,
		txt_add = '\n',		// for "+:"
		eof = file.length

	function set_boc() {
		boc = bol
		while (boc < eol) {
			c = file[boc]
			if (c != ' ' &&  c != '\t')
				break
			boc++
		}
	}

	function set_eoc() {
		eoc = eol - 1
		while (eoc > bol) {
			c = file[eoc]
			if (c != ' ' && c != '\t')
				break
			eoc--
		}
		eoc++
	}

	// check if a tune is selected
	function tune_selected() {
		var	i = file.indexOf('K:', bol)

		if (i < 0) {
//			syntax(1, "No K: in tune")
			return false
		}
		i = file.indexOf('\n', i)
		if (parse.select.test(file.slice(bol, i)))
			return true
		eol = file.indexOf('\n\n', i)
		if (eol < 0)
			eol = eof - 1
		else
			eol++
		return false
	}

	// remove the comment at end of text
	function uncomment(src, do_escape) {
		var i, j, c, l

		if (do_escape && src.indexOf('\\') >= 0)
			src = cnv_escape(src);
		l = src.length
		for (i = 0; i < l; i++) {
			c = src[i]
			switch (c) {
			case '\\':
				i++
				continue
			case '%':
				return src.slice(0, i).replace(/\s+$/,'')
			case '"':
				break
			default:
				continue
			}
			j = i + 1
			for (;;) {			// in ".." sequence
				j = src.indexOf('"', j)
				if (j < 0)
					break		// fixme: no string end
				if (src[j - 1] != '\\')
					break
			}
			if (j < 0)
				break
			i = j
		}
		src = src.replace(/\s+$/,'');		// trimRight
		return src.replace(/\\%/g,'%')
	}

	function end_tune() {
		gen_ly(false);
		put_history();
		blk_out();
		blk_flush();
		parse.state = 0;		// file header
		cfmt = cfmt_sav;
		posx = cfmt.leftmargin / cfmt.scale;
		info = info_sav;
		char_tb = char_tb_sav;
		glovar = glovar_sav;
		maps = maps_sav;
		init_tune()
	}

	// initialize
	parse.file = file;
	parse.ctx = {
		fname: in_fname
	}
//--fixme: temporary
 line = new scanBuf();
 parse.line = line;
 line.buffer = file;
 line.index = 0;

	// scan the file
	bol = 0
	for (bol = 0; ; bol = eol + 1) {
		if (bol >= eof)
			break

		// get a line
		eol = file.indexOf('\n', bol)
		if (eol < 0)
			eol = eof
		if (eol == bol) {
			if (parse.state == 1) {
				parse.istart = bol;
				syntax(1, "Empty line in tune header - ignored")
			} else if (parse.state >= 2)
				end_tune()
			continue
		}
//fixme: are bol and iend useful?
		parse.istart = parse.bol = bol;
		parse.iend = parse.eol = eol;

		// check if the line is a pseudo-comment or I:
		line0 = file[bol];
		line1 = file[bol + 1]
		if (line0 == '%') {
			if (parse.prefix.indexOf(line1) < 0)
				continue		// comment

			// change "%%abc xxxx" to "xxxx"
			if (file[bol + 2] == 'a'
			 && file[bol + 3] == 'b'
			 && file[bol + 4] == 'c'
			 && file[bol + 5] == ' ') {
				bol += 6;
				line0 = file[bol];
				line1 = file[bol + 1]
			} else {
				pscom = true
			}
		} else if (line0 == 'I' && line1 == ':') {
			pscom = true
		}

		// pseudo-comments
		if (pscom) {
			pscom = false;
			bol += 2;		// skip %%/I:
			set_boc();
			set_eoc();
			text = file.slice(boc, eoc)
			if (!text || text[0] == '%')
				continue
			a = text.split(/\s+/, 2)
			if (!a[0])
				a.shift()
			switch (a[0]) {
			case "abcm2ps":
				parse.prefix = a[1]
				continue
			case "abc-include":
//			case "abc2svg-include":
				ext = a[1].match(/.*\.(.*)/)
				if (!ext)
					continue
				switch (ext[1]) {
				case "abc":
					do_include(a[1])
					break
//fixme: does not work with edit.xhtml
//				case "js":
//					load(a[1])
//					break
				}
				continue
			}

			// beginxxx/endxxx
			b = a[0].match(/begin(.*)/)
			if (b) {
//fixme: ignore "I:beginxxx" ... ?
				end = '\n' + line0 + line1 + "end" + b[1];
				i = file.indexOf(end, eol)
				if (i < 0) {
					syntax(1, "No " + end.slice(1) +
							" after %%" + b[0]);
					eol = eof
					continue
				}
				do_begin_end(b[1], a[1],
					parse.file.slice(eol + 1, i).replace(
						new RegExp('\n' + line0 + line1, 'g'),
									'\n'))
				eol = file.indexOf('\n', i + 6)
				if (eol < 0)
					eol = eof
				continue
			}
			switch (a[0]) {
			case "select":
				if (parse.state != 0) {
					syntax(1, "%%select ignored")
					continue
				}
				select = uncomment(text.slice(7).trim(),
							false)
				if (select[0] == '"')
					select = select.slice(1, -1);
				select = select.replace(/\(/g, '\\(');
				select = select.replace(/\)/g, '\\)');
//				select = select.replace(/\|/g, '\\|');
				parse.select = new RegExp(select, 'm')
				continue
			case "tune":
				syntax(1, "%%tune not treated yet")
				continue
			case "voice":
				if (parse.state != 0) {
					syntax(1, "%%voice ignored")
					continue
				}
				select = uncomment(text.slice(6).trim(), false)

				/* if void %%voice, free all voice options */
				if (!select) {
					if (parse.cur_tune_opts)
						parse.cur_tune_opts.voice_opts = null
					else
						parse.voice_opts = null
					continue
				}
				
				if (select == "end")
					continue	/* end of previous %%voice */

				/* get the voice options */
				if (parse.cur_tune_opts) {
					if (!parse.cur_tune_opts.voice_opts)
						parse.cur_tune_opts.voice_opts = {}
					opt = parse.cur_tune_opts.voice_opts
				} else {
					if (!parse.voice_opts)
						parse.voice_opts = {}
					opt = parse.voice_opts
				}
				opt[select] = []
				while (1) {
					bol = ++eol
					if (file[bol] != '%')
						break
					eol = file.indexOf('\n', eol);
					if (file[bol + 1] != line1)
						continue
					bol += 2
					if (eol < 0)
						text = file.slice(bol)
					else
						text = file.slice(bol, eol);
					a = text.split(/\s+/, 1)
					switch (a[0]) {
					default:
						opt[select].push(
							uncomment(text.trim(), true))
						continue
					case "score":
					case "staves":
					case "tune":
					case "voice":
						bol -= 2
						break
					}
					break
				}
				eol = bol - 1
				continue
			}
			do_pscom(uncomment(text.trim(), true))
			continue
		}
		if (line1 != ':') {
			last_info = undefined
			if (parse.state != 3) {		// not tune body
				if (parse.state != 2)
					continue
				goto_tune()
			}
//fixme: what was this test used for?
//			if (line.buffer) {
				parse_music_line()
//			}
			continue
		}

		// information fields
		text = file.slice(bol + 2, eol);
		text = uncomment(text.trim(), true)
		if (line0 == '+' && line1 == ':') {
			if (!last_info) {
				syntax(1, "No previous info field")
				continue
			}
			txt_add = ' ';
			line0 = last_info;
		}

		switch (line0) {
		case 'X':			// start of tune
			if (parse.state != 0) {
				syntax(1, "X: found in tune - ignored")
				continue
			}
			if (parse.select
			 && !tune_selected())
				continue

			cfmt_sav = clone(cfmt);
			cfmt.pos = clone(cfmt.pos);
			info_sav = clone(info);
			char_tb_sav = clone(char_tb);
			glovar_sav = clone(glovar);
			maps_sav = maps;
//			for (var i in info)
//				delete info[i]
			info.X = text;
			parse.state = 1			// tune header
			continue
		case 'T':
			if (parse.state == 0)
				continue
//			if (parse.state == 1) {		// tune header
			curvoice = voice_tb[0];
			if (!curvoice) {		// tune header
				if (info.T == undefined)	// (keep empty T:)
					info.T = text
				else
					info.T += "\n" + text
				continue
			}
			s = {
				type: BLOCK,
				subtype: "title",
//fixme: no annotation
//				ctx: parse.ctx,
//				istart: parse.istart,
//				iend:  parse.iend,
				text: text
			}
			sym_link(s)
			continue
		case 'K':
			if (parse.state == 0)
				continue
			if (parse.state == 1)		// tune header
				info.K = text
			else if (parse.state == 2)
				goto_tune();
//temporary
 parse.line.buffer = text;
 parse.line.index = 0
			do_info(line0, text)
			if (parse.state != 1)
				continue
			parse.state = 2			// tune header after K:
			if (!glovar.ulen)
				glovar.ulen = BASE_LEN / 8
			continue
		case 'W':
			if (parse.state == 0
			 || cfmt.writefields.indexOf('W') < 0)
				break
			if (!info.W)
				info.W = text
			else
				info.W += txt_add + text
			break

		// info fields in tune body only
		case 's':
			if (parse.state != 3)
				break
//--fixme: to do
			break
		case 'w':
			if (parse.state != 3
			 || cfmt.writefields.indexOf('w') < 0)
				break
			get_lyrics(text, txt_add == ' ')
			if (text[text.length - 1] == '\\') {	// old continuation
				txt_add = ' ';
				last_info = line0
				continue
			}
			break
		// music line
		case '|':
			if (parse.state != 3) {		// not tune body
				if (parse.state != 2)
					continue
				goto_tune()
			}
			parse_music_line()
			continue
		default:
			if ("ABCDFGHOSZ".indexOf(line0) >= 0) {
				if (parse.state >= 2) {
					syntax(1, line0 + ": in tune - ignored")
					continue
				}
//				if (cfmt.writefields.indexOf(c) < 0)
//					break
				if (!info[line0])
					info[line0] = text
				else
					info[line0] += txt_add + text
				break
			}

			// info field which may be embedded
//temporary
 parse.line.buffer = text;
 parse.line.index = 0
			do_info(line0, text)
			continue
		}
		txt_add = '\n';
		last_info = line0
	}
//fixme: try to continue the tune in the next file
	if (parse.state >= 2)
		end_tune()
	blk_flush();
	parse.state = 0
}
Abc.prototype.tosvg = tosvg
// abc2svg - music.js - music generation
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

var	gene,
	staff_tb,
	tsnext,			/* next line when cut */
	realwidth,		/* real staff width while generating */
	insert_meter,		/* insert time signature (1) and indent 1st line (2) */
	beta_last		/* for last short short line.. */

/* width of notes indexed by log2(note_length) */
var	space_tb = [
		7, 10, 14.15, 20, 28.3,
		40,			/* crotchet (BASE_LEN / 4) */
		56.6, 80, 113, 150
	],
	smallest_duration

/* -- decide whether to shift heads to other side of stem on chords -- */
/* this routine is called only once per tune */

// distance for no overlap - index: [prev acc][cur acc]
//var dt_tb = [
//	[5, 5, 5, 5],		/* dble sharp */
//	[5, 6, 6, 6],		/* sharp */
//	[5, 6, 5, 6],		/* natural */
//	[5, 5, 5, 5]		/* flat / dble flat */
//]

const dx_tb = {
	full: 9,
	empty: 10,
	oval: 12,
	square: 15.3
}

function set_head_shift(s) {
	var	i, i1, i2, d, ps, dx,
		dx_head = dx_tb[s.head],
		dir = s.stem,
		n = s.nhd

	if (s.dur >= BASE_LEN * 2 && s.head == "oval")
		dx_head = 15.8

	/* special case when single note */
	if (n == 0) {
		if (s.notes[0].acc) {
			if (s.grace)
				dx_head *= 0.7;
			s.notes[0].shac = dx_head
		}
		return
	}

	/* set the head shifts */
	dx = dx_head * 0.78
	if (s.grace)
		dx *= 0.5
	if (dir >= 0) {
		i1 = 1;
		i2 = n + 1;
		ps = s.notes[0].pit
	} else {
		dx = -dx;
		i1 = n - 1;
		i2 = -1;
		ps = s.notes[n].pit
	}
	var	shift = false,
		dx_max = 0
	for (i = i1; i != i2; i += dir) {
		d = s.notes[i].pit - ps;
		ps = s.notes[i].pit
		if (d == 0) {
			if (shift) {		/* unison on shifted note */
				var new_dx = s.notes[i].shhd =
						s.notes[i - dir].shhd + dx
				if (dx_max < new_dx)
					dx_max = new_dx
				continue
			}
			if (i + dir != i2	/* second after unison */
//fixme: should handle many unisons after second
			 && ps + dir == s.notes[i + dir].pit) {
				s.notes[i].shhd = -dx
				if (dx_max < -dx)
					dx_max = -dx
				continue
			}
		}
		if (d < 0)
			d = -d
		if (d > 3 || (d >= 2 && s.head != "square")) {
			shift = false
		} else {
			shift = !shift
			if (shift) {
				s.notes[i].shhd = dx
				if (dx_max < dx)
					dx_max = dx
			}
		}
	}
	s.xmx = dx_max				/* shift the dots */
}

/* set the horizontal shift of accidentals */
/* this routine is called only once per tune */
function set_acc_shft() {
	var s, s2, st, i, acc, st, t, dx_head

	// set the accidental shifts for a set of chords
	function acc_shift(notes, dx_head) {
		var i, i1, dx, dx1, ps, p1, acc,
			n = notes.length

		// set the shifts from the head shifts
		for (i = n - 1; --i >= 0; ) {	// (no shift on top)
			dx = notes[i].shhd
			if (!dx || dx > 0)
				continue
			dx = dx_head - dx;
			ps = notes[i].pit
			for (i1 = n; --i1 >= 0; ) {
				if (!notes[i1].acc)
					continue
				p1 = notes[i1].pit
				if (p1 < ps - 3)
					break
				if (p1 > ps + 3)
					continue
				if (notes[i1].shac < dx)
					notes[i1].shac = dx
			}
		}

		// set the shifts from accidental shifts
		for (i = n; --i >= 0; ) {		// from top to bottom
			acc = notes[i].acc
			if (!acc)
				continue
			dx = notes[i].shac
			if (!dx) {
				dx = notes[i].shhd
				if (dx < 0)
					dx = dx_head - dx
				else
					dx = dx_head
			}
			ps = notes[i].pit
			for (i1 = n; --i1 > i; ) {
				if (!notes[i1].acc)
					continue
				p1 = notes[i1].pit
				if (p1 >= ps + 4) {	// pitch far enough
					if (p1 > ps + 4	// if more than a fifth
					 || acc < 0	// if flat/dble flat
					 || notes[i1].acc < 0)
						continue
				}
				if (dx > notes[i1].shac - 6) {
					dx1 = notes[i1].shac + 7
					if (dx1 > dx)
						dx = dx1
				}
			}
			notes[i].shac = dx
		}
	}

	// search the notes with accidentals at the same time
	s = tsfirst
	while (s) {
		if (s.type != NOTE
		 || s.invisible) {
			s = s.ts_next
			continue
		}
		st = s.st;
		t = s.time;
		acc = false
		for (s2 = s; s2; s2 = s2.ts_next) {
			if (s2.time != t
			 || s2.type != NOTE
			 || s2.st != st)
				break
			if (acc)
				continue
			for (i = 0; i <= s2.nhd; i++) {
				if (s2.notes[i].acc) {
					acc = true
					break
				}
			}
		}
		if (!acc) {
			s = s2
			continue
		}

		dx_head = dx_tb[s.head]
		if (s.dur >= BASE_LEN * 2 && s.head == "oval")
			dx_head = 15.8;

		// build a pseudo chord and shift the accidentals
		st = {
			notes: []
		}
		for ( ; s != s2; s = s.ts_next)
			st.notes = st.notes.concat(s.notes);
		sort_pitch(st);
		acc_shift(st.notes, dx_head)
	}
}

/* -- unlink a symbol -- */
function unlksym(s) {
	if (!s.next) {
		if (s.extra) {
			s.type = FORMAT;
			s.fmt_type = undefined
			return
		}
	} else {
		s.next.prev = s.prev
		if (s.extra) {
			var g = s.next.extra
			if (!g) {
				s.next.extra = s.extra
			} else {
				for (; g.next; g = g.next)
					;
				g.next = s.extra
			}
		}
	}
	if (s.prev)
		s.prev.next = s.next
	else
		voice_tb[s.v].sym = s.next
	if (s.ts_next) {
		if (s.seqst
		 && !s.ts_next.seqst) {
			s.ts_next.seqst = true;
			s.ts_next.shrink = s.shrink;
			s.ts_next.space = s.space
		}
		if (s.new_sy)
			s.ts_next.new_sy = true;
		s.ts_next.ts_prev = s.ts_prev
	}
	if (s.ts_prev)
		s.ts_prev.ts_next = s.ts_next
	if (tsfirst == s)
		tsfirst = s.ts_next
	if (tsnext == s)
		tsnext = s.ts_next
}

/* -- check if voice combine may occur -- */
function may_combine(s) {
	var	nhd2,
		s2 = s.ts_next

	if (!s2 || (s2.type != NOTE && s2.type != REST))
		return false
	if (s2.v == s.v
	 || s2.st != s.st
	 || s2.time != s.time
	 || s2.dur != s.dur)
		return false
	if (s.combine <= 0
	 && s2.type != s.type)
		return false
//	if (s2.a_dd) { //fixme: should check the double decorations
//		return false
//	}
	if (s.a_gch && s2.a_gch)
		return false
	if (s.type == REST) {
		if (s.type == s2.type && s.invisible && !s2.invisible)
			return false
		return true
	}
	if (s2.a_ly
	 || s2.sl1 || s2.sl2
	 || s2.slur_start || s2.slur_end)
		return false
	if (s2.beam_st != s.beam_st
	 || s2.beam_end != s.beam_end)
		return false;
	nhd2 = s2.nhd
	if (s.combine <= 1
	 && s.notes[0].pit <= s2.notes[nhd2].pit + 1)
		return false
	return true
}

/* combine two notes */
function combine_notes(s, s2) {
	var nhd, type, m

	s.notes = s.notes.concat(s2.notes);
	s.nhd = nhd = s.notes.length - 1;
	sort_pitch(s)			/* sort the notes by pitch */

	if (s.combine >= 3) {		// remove unison heads
		for (m = nhd; m > 0; m--) {
			if (s.notes[m].pit == s.notes[m - 1].pit
			 && s.notes[m].acc == s.notes[m - 1].acc)
				s.notes.splice(m, 1)
		}
		s.nhd = nhd = s.notes.length - 1
	}

	s.ymx = 3 * (s.notes[nhd].pit - 18) + 4;
	s.ymn = 3 * (s.notes[0].pit - 18) - 4;
	s.yav = (s.ymx + s.ymn) / 2

	if (s.a_dd) {
		if (s2.a_dd)
			s.a_dd = s.a_dd.concat(s2.a_dd)
	} else {
		s.a_dd = s2.a_dd
	}

	/* force the tie directions */
	type = s.notes[0].ti1
	if ((type & 0x0f) == SL_AUTO)
		s.notes[0].ti1 = SL_BELOW | (type & ~SL_DOTTED);
	type = s.notes[nhd].ti1
	if ((type & 0x0f) == SL_AUTO)
		s.notes[nhd].ti1 = SL_ABOVE | (type & ~SL_DOTTED)
}

/* -- combine 2 voices -- */
function do_combine(s) {
	var s2, nhd, nhd2, type

	while (1) {
		nhd = s.nhd;
		s2 = s.ts_next;
		nhd2 = s2.nhd
		delete s2.extra
		if (s.type != s2.type) {	/* if note and rest */
			if (s2.type != REST) {
				s2 = s;
				s = s2.ts_next
			}
		} else if (s.type == REST) {
			if (s.invisible
			 && !s2.invisible)
				delete s.invisible
		} else {
			combine_notes(s, s2)
		}

		if (s2.text && !s.text) {
			s.text = s2.text;
			s.a_gch = s2.a_gch
		}
		unlksym(s2)			/* remove the next symbol */

		/* there may be more voices */
		if (s.in_tuplet || !may_combine(s))
			break
	}
}

/* try to combine voices */
function combine_voices() {
	var s2, g, i, r

	for (var s = tsfirst; s.ts_next; s = s.ts_next) {
		if (s.combine < 0)
			continue
		if (s.combine == 0
		 && s.type != REST)
			continue
		if (s.in_tuplet) {
			g = s.extra
			if (!g)
				continue	/* tuplet already treated */
			r = 0
			for ( ; g; g = g.next) {
				if (g.type == TUPLET
				 && g.tuplet_r > r)
					r = g.tuplet_r
			}
			if (r == 0)
				continue
			i = r
			for (s2 = s; s2; s2 = s2.next) {
				if (!s2.ts_next)
					break
				if (s2.type != NOTE
				 && s2.type != REST)
					continue
				if (!may_combine(s2))
					break
				if (--i <= 0)
					break
			}
			if (i > 0)
				continue
			for (s2 = s; /*s2*/; s2 = s2.next) {
				if (s2.type != NOTE
				 && s2.type != REST)
					continue
				do_combine(s2)
				if (--r <= 0)
					break
			}
			continue
			
		}

		if (s.type != NOTE) {
			if (s.type == REST) {
				if (may_combine(s))
					do_combine(s)
			}
			continue
		}
		if (!s.beam_st)
			continue
		if (s.beam_end) {
			if (may_combine(s))
				do_combine(s)
			continue
		}

		s2 = s
		while (1) {
			if (!may_combine(s2)) {
				s2 = null
				break
			}
//fixme: may have rests in beam
			if (s2.beam_end)
				break
			do {
				s2 = s2.next
			} while (s2.type != NOTE && s2.type != REST)
		}
		if (!s2)
			continue
		s2 = s
		while (1) {
			do_combine(s2)
//fixme: may have rests in beam
			if (s2.beam_end)
				break
			do {
				s2 = s2.next
			} while (s2.type != NOTE && s2.type != REST)
		}
	}
}

/* -- insert a clef change (treble or bass) before a symbol -- */
function insert_clef(s, clef_type, clef_line) {
	var	p_voice = voice_tb[s.v],
		new_s,
		st = s.st

	/* don't insert the clef between two bars */
	if (s.type == BAR && s.prev && s.prev.type == BAR)
		s = s.prev;

	/* create the symbol */
	p_voice.last_sym = s.prev
	if (!p_voice.last_sym)
		p_voice.sym = null;
	p_voice.time = s.time;
	new_s = sym_add(p_voice);
	new_s.type = CLEF;
	new_s.next = s;
	s.prev = new_s;

	new_s.clef_type = clef_type;
	new_s.clef_line = clef_line;
	new_s.st = st;
	new_s.clef_small = true;
	new_s.second = undefined;
	new_s.notes = []
	new_s.notes[0] = {
		pit: s.notes[0].pit
	}
	new_s.nhd = 0;

	/* link in time */
	while (!s.seqst)
		s = s.ts_prev
//	if (!s.ts_prev || s.ts_prev.type != CLEF)
	if (s.ts_prev.type != CLEF)
		new_s.seqst = true;
	new_s.ts_prev = s.ts_prev;
//	if (new_s.ts_prev)
		new_s.ts_prev.ts_next = new_s;
//	else
//		tsfirst = new_s
	new_s.ts_next = s;
	s.ts_prev = new_s
	return new_s
}

/* -- set the staff of the floating voices -- */
/* this function is called only once per tune */
function set_float() {
	var p_voice, st, staff_chg, v, s, s1, up, down

	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		if (!p_voice.floating)
			continue
		staff_chg = false;
		st = p_voice.st
		for (s = p_voice.sym; s; s = s.next) {
			if (s.type != NOTE) {
				if (staff_chg)
					s.st++
				continue
			}
			if (!s.floating) {
				staff_chg = false
				continue
			}
			if (s.notes[0].pit >= 19) {		/* F */
				staff_chg = false
				continue
			}
			if (s.notes[s.nhd].pit <= 12) {	/* F, */
				staff_chg = true
				s.st++
				continue
			}
			up = 127
			for (s1 = s.ts_prev; s1; s1 = s1.ts_prev) {
				if (s1.st != st
				 || s1.v == s.v)
					break
				if (s1.type == NOTE)
				    if (s1.notes[0].pit < up)
					up = s1.notes[0].pit
			}
			if (up == 127) {
				if (staff_chg)
					s.st++
				continue
			}
			if (s.notes[s.nhd].pit > up - 3) {
				staff_chg = false
				continue
			}
			down = -127
			for (s1 = s.ts_next; s1; s1 = s1.ts_next) {
				if (s1.st != st + 1
				 || s1.v == s.v)
					break
				if (s1.type == NOTE)
				    if (s1.notes[s1.nhd].pit > down)
					down = s1.notes[s1.nhd].pit
			}
			if (down == -127) {
				if (staff_chg)
					s.st++
				continue
			}
			if (s.notes[0].pit < down + 3) {
				staff_chg = true
				s.st++
				continue
			}
			up -= s.notes[s.nhd].pit
			down = s.notes[0].pit - down
			if (!staff_chg) {
				if (up < down + 3)
					continue
				staff_chg = true
			} else {
				if (up < down - 3) {
					staff_chg = false
					continue
				}
			}
			s.st++
		}
	}
}

/* -- set the x offset of the grace notes -- */
function set_graceoffs(s) {
	var g, next, m, xx, gspleft, gspinside, gspright;

	gspleft = Number(cfmt.gracespace[0]);
	gspinside = Number(cfmt.gracespace[1]);
	gspright = Number(cfmt.gracespace[2]);
	xx = 0
	for (g = s.extra; ; g = g.next) {
		if (g.type == NOTE)
			break
	}
	g.beam_st = true
	for ( ; ; g = g.next) {
		if (g.type != NOTE) {
			if (!g.next)
				break
			continue
		}
		set_head_shift(g)
		for (m = g.nhd; m >= 0; m--) {
			if (g.notes[m].acc) {
				xx += 5
				if (g.notes[m].micro)
					xx += 2
				break
			}
		}
		g.x = xx

		if (g.nflags <= 0) {
			g.beam_st = true;
			g.beam_end = true
		}
		next = g.next
		if (!next) {
			g.beam_end = true
			break
		}
		if (next.nflags <= 0)
			g.beam_end = true
		if (g.beam_end) {
			next.beam_st = true;
			xx += gspinside / 4
		}
		if (g.nflags <= 0)
			xx += gspinside / 4
		if (g.y > next.y + 8)
			xx -= 1.5
		xx += gspinside
	}

	xx += gspleft + gspright;
	next = s.next
	if (next
	 && next.type == NOTE) {	/* if before a note */
		if (g.y >= 3 * (next.notes[next.nhd].pit - 18))
			xx -= 1		/* above, a bit closer */
		else if ((g.beam_st)
		      && g.y < 3 * (next.notes[0].pit - 18) - 7)
			xx += 2		/* below with flag, a bit further */
	}

	/* return the whole width */
	return xx
}

/* -- compute the width needed by the guitar chords / annotations -- */
function gchord_width(s, wlnote, wlw) {
	var	s2, gch, w, wl,
		lspc = 0,
		rspc = 0
	for (var ix = 0; ix < s.a_gch.length; ix++) {
		gch = s.a_gch[ix]
		switch (gch.type) {
		default:		/* default = above */
			wl = -gch.x
			if (wl > lspc)
				lspc = wl;
			w = gch.w + 2- wl
			if (w > rspc)
				rspc = w
			break
		case '<':		/* left */
			w = gch.w + wlnote
			if (w > lspc)
				lspc = w
			break
		case '>':		/* right */
			w = gch.w + s.wr
			if (w > rspc)
				rspc = w
			break
		}
	}

	/* adjust width for no clash */
	s2 = s.prev
	if (s2 && s2.a_gch) {
		for (s2 = s.ts_prev; ; s2 = s2.ts_prev) {
			if (s2 == s.prev) {
				if (wlw < lspc)
					wlw = lspc
				break
			}
			if (s2.seqst)
				lspc -= s2.shrink
		}
	}
	s2 = s.next
	if (s2 && s2.a_gch) {
		for (s2 = s.ts_next; ; s2 = s2.ts_next) {
			if (s2 == s.next) {
				if (s.wr < rspc)
					s.wr = rspc
				break
			}
			if (s2.seqst)
				rspc -= 8
		}
	}
	return wlw
}

/* -- set the width of a symbol -- */
/* This routine sets the minimal left and right widths wl,wr
 * so that successive symbols are still separated when
 * no extra glue is put between them */
function set_width(s) {
	var s2, i, m, xx, w, wlnote, wlw, acc

	switch (s.type) {
	case NOTE:
	case REST:

		/* set the note widths */
		switch (s.head) {
		default:
			wlnote = 8
			break
		case "oval":
			wlnote = 6
			break
		case "empty":
			wlnote = 5
			break
		case "full":
			wlnote = 4.5
			break
		}
		s.wr = wlnote

		/* room for shifted heads and accidental signs */
		if (s.xmx > 0)
			s.wr += s.xmx + 4;
		s2 = s.prev
		if (s2) {
			switch (s2.type) {
			case BAR:
			case CLEF:
			case KEY:
			case METER:
				wlnote += 3
				break
			}
		}
		for (m = 0; m <= s.nhd; m++) {
			xx = s.notes[m].shhd
			if (xx < 0) {
				if (wlnote < -xx + 5)
					wlnote = -xx + 5
			}
			if (s.notes[m].acc) {
				var tmp = s.notes[m].shac +
					(s.notes[m].micro ? 6.5 : 4.5)
				if (wlnote < tmp)
					wlnote = tmp
			}
		}
		if (s2) {
			switch (s2.type) {
			case BAR:
			case CLEF:
			case KEY:
			case METER:
				wlnote -= 3
				break
			}
		}

		/* room for the decorations */
		if (s.a_dd)
			wlnote += deco_width(s)

		/* space for flag if stem goes up on standalone note */
		if (s.beam_st && s.beam_end
		 && s.stem > 0 && s.nflags > 0) {
			if (s.wr < s.xmx + 9)
				s.wr = s.xmx + 9
		}

		/* leave room for dots and set their offset */
		if (s.dots > 0) {
			switch (s.head) {
			case "square":
			case "oval":
				s.xmx += 2
				break
			case "empty":
				s.xmx += 1
				break
			}
			if (s.wr < s.xmx + 12)
				s.wr = s.xmx + 12
			if (s.dots >= 2)
				s.wr += 3.5 * (s.dots - 1)
		}

		/* if a tremolo on 2 notes, have space for the small beam(s) */
		if (s.trem2 && s.beam_end
		 && wlnote < 20)
			wlnote = 20

		wlw = wlnote

		if (s2) {
			switch (s2.type) {
			case NOTE:	/* extra space when up stem - down stem */
				if (s2.stem > 0 && s.stem < 0) {
					if (wlw < 7)
						wlw = 7
				}

				/* make sure helper lines don't overlap */
				if ((s.y > 27 && s2.y > 27)
				 || (s.y < -3 && s2.y < -3)) {
					if (wlw < 6)
						wlw= 6
				}

				/* have ties wide enough */
				if (s2.ti1) {
					if (wlw < 14)
						wlw = 14
				}
				break
			case CLEF:		/* extra space at start of line */
				if (s2.second
				 || s2.clef_small)
					break
				wlw += 8
				break
			case KEY:
/*			case METER:	*/
				wlw += 4
				break
			}
		}

		/* leave room for guitar chord */
		if (s.a_gch)
			wlw = gchord_width(s, wlnote, wlw)

		/* leave room for vocals under note */
		/* related to draw_lyrics() */
		if (s.a_ly)
			wlw = ly_width(s, wlw)

		/* if preceeded by a grace note sequence, adjust */
		if (s2 && s2.type == GRACE)
			s.wl = wlnote - 4.5
		else
			s.wl = wlw
		return
	case SPACE:
		xx = s.width / 2;
		s.wr = xx
		if (s.a_gch)
			xx = gchord_width(s, xx, xx)
		if (s.a_dd)
			xx += deco_width(s);
		s.wl = xx
		return
	case BAR:
		if (s.norepbra)
			break
		if (!s.invisible) {
			var bar_type = s.bar_type
			switch (bar_type) {
			case "|":
				w = 5 + 3
				break
			case "|:":
			case ":|":
				w = 5 + 3 + 3 + 5
				break
			case "::":
				w = 5 + 5 + 3 + 3 + 3 + 5
				break
			default:
				if (!bar_type)
					break
				w = 5 + 3 * bar_type.length
				for (i = 0; i < bar_type.length; i++) {
					switch (bar_type[i]) {
					case "[":
					case "]":
						w += 3
						break
					case ":":
						w += 2
						break
					}
				}
				break
			}
			s.wl = w
			if (s.next
			 && s.next.type != METER)
				s.wr = 8
			else
				s.wr = 5
//			s.notes[0].shhd = (w - 5) * -0.5
		} else {
			s.wl = s.wr = 0
		}
		if (s.a_dd)
			s.wl += deco_width(s)

		/* have room for the repeat numbers / guitar chord */
		if (s.a_gch
		 && s.a_gch[0].text.length < 4)
			s.wl = gchord_width(s, s.wl, s.wl)
		return
	case CLEF:
		/* shift the clef to the left - see draw_symbols() */
		if (s.invisible)
			break
//		s.wl = 12 + 10;
//		s.wr = (s.clef_small ? 10 : 12) - 10
		s.wl = 12;
		s.wr = s.clef_small ? 10 : 12
//		s.wl = 4;
//		s.wr = s.clef_small ? 18 : 20
		return
	case KEY:
		var n1, n2, esp;
		s.wl = 3;
		esp = 4
		if (!s.k_a_acc) {
			n1 = s.k_sf			/* new key sig */
			if (s.k_old_sf && (cfmt.cancelkey || n1 == 0))
				n2 = s.k_old_sf	/* old key */
			else
				n2 = 0
			if (n1 * n2 >= 0) {		/* if no natural */
				if (n1 < 0)
					n1 = -n1
				if (n2 < 0)
					n2 = -n2
				if (n2 > n1)
					n1 = n2
			} else {
				n1 -= n2
				if (n1 < 0)
					n1 = -n1
				esp += 3	/* see extra space in draw_keysig() */
			}
		} else {
			n1 = n2 = s.k_a_acc.length
			var last_acc = s.k_a_acc[0].acc
			for (i = 1; i < n2; i++) {
				acc = s.k_a_acc[i]
				if (acc.pit > s.k_a_acc[i - 1].pit + 6
				 || acc.pit < s.k_a_acc[i - 1].pit - 6)
					n1--		// no clash
				else if (acc.acc != last_acc)
					esp += 3;
				last_acc = acc.acc
			}
		}
		s.wr = 5.5 * n1 + esp
		return
	case METER:
		/* !!tied to draw_meter()!! */
		w = 0
		for (i = 0; i < s.a_meter.length; i++) {
			var meter = s.a_meter[i]
			if (meter.top == "C|") {
				w += 6.5
			} else {
				if (!meter.bot
				 || meter.top.length > meter.bot.length)
					w += 6.5 * meter.top.length
				else
					w += 6.5 * meter.bot.length
			}
		}
		s.wl = w;
		s.wr = w + 7
		return
	case MREST:
		s.wl = 40 / 2 + 16;
		s.wr = 40 / 2 + 16
		return
	case GRACE:
		s.wl = set_graceoffs(s);
		s.wr = 0
		return
	case STBRK:
		s.wl = s.xmx
		if (s.next && s.next.type == CLEF) {
			s.wr = 2
			delete s.next.clef_small	/* big clef */
		} else {
			s.wr = 8
		}
		return
	case FORMAT:
		s.wl = 6;
		s.wr = 0
		return
	default:
		error(2, s, "set_width - Cannot set width for symbol " + s.type)
		break
	}
	s.wl = s.wr = 0
}

/* -- set the natural space -- */
function set_space(s) {
	var s2, i, l, space,
//		prev_time = !s.ts_prev ? s.time : s.ts_prev.time,
		prev_time = s.ts_prev.time,
		len = s.time - prev_time		/* time skip */

	if (len == 0) {
		switch (s.type) {
		case MREST:
			return s.wl + 16
/*fixme:do same thing at start of line*/
		case NOTE:
		case REST:
			if (s.ts_prev.type == BAR) {
				if (s.nflags < -2)
					return space_tb[0]
				return space_tb[2]
			}
			break
		}
		return 0
	}
	if (s.ts_prev.type == MREST)
		return s.ts_prev.wr + 16
				+3		// (bar wl=5 wr=8)
	if (smallest_duration >= BASE_LEN / 2) {
		if (smallest_duration >= BASE_LEN)
			len /= 4
		else
			len /= 2
	}
	if (len >= BASE_LEN / 4) {
		if (len < BASE_LEN / 2)
			i = 5
		else if (len < BASE_LEN)
			i = 6
		else if (len < BASE_LEN * 2)
			i = 7
		else if (len < BASE_LEN * 4)
			i = 8
		else
			i = 9
	} else {
		if (len >= BASE_LEN / 8)
			i = 4
		else if (len >= BASE_LEN / 16)
			i = 3
		else if (len >= BASE_LEN / 32)
			i = 2
		else if (len >= BASE_LEN / 64)
			i = 1
		else
			i = 0
	}
	l = len - ((BASE_LEN / 16 / 8) << i)
	space = space_tb[i]
	if (l != 0) {
		if (l < 0) {
			space = space_tb[0] * len / (BASE_LEN / 16 / 8)
		} else {
			if (i >= 9)
				i = 8
			space += (space_tb[i + 1] - space_tb[i])
				* l / len
		}
	}
	if (!s.dur) {
		switch (s.type) {
		case BAR:
			if (s.bar_type.length > 1)
				space *= 0.8	/* complex bar */
			else
				space *= 0.7
			break
		case CLEF:
			space -= s.wl
			break
		}
		return space
	}

	/* reduce spacing within a beam */
	if (!s.beam_st)
		space *= 0.9			// ex fnnp

	/* decrease spacing when stem down followed by stem up */
/*fixme:to be done later, after x computed in sym_glue*/
	if (s.type == NOTE && s.nflags >= -1
	 && s.stem > 0) {
		var stemdir = true

		for (s2 = s.ts_prev;
		     s2 && s2.time == prev_time;
		     s2 = s2.ts_prev) {
			if (s2.type == NOTE
			 && (s2.nflags < -1 || s2.stem > 0)) {
				stemdir = false
				break
			}
		}
		if (stemdir) {
			for (s2 = s.ts_next;
			     s2 && s2.time == s.time;
			     s2 = s2.ts_next) {
				if (s2.type == NOTE
				 && (s2.nflags < -1 || s2.stem < 0)) {
					stemdir = false
					break
				}
			}
			if (stemdir)
				space *= 0.9
		}
	}
	return space
}

/* -- set the width and space of all symbols -- */
/* this function is called once for the whole tune
 * then, once per music line up to the first sequence */
function set_allsymwidth(last_s) {
	var p_voice, s2, s3, i, v, shrink, space

	/* set the space of the starting symbols */
	var	new_val = 0,
		s = tsfirst

	while (1) {
		set_width(s)
		if (new_val < s.wl)
			new_val = s.wl;
		s = s.ts_next
		if (s == last_s || s.seqst)
			break
	}
	tsfirst.shrink = new_val;
	tsfirst.space = 0

	if (s == last_s)
//fixme: treat the tablatures
		return

	/* loop on all remaining symbols */
	while (1) {
		s2 = s;
		shrink = space = 0
		do {
			var ymx1, ymn1, ymx2, ymn2, wl;

			/* set the minimum space before and after the symbol */
			set_width(s2)

			/* calculate the minimum space before the symbol,
			 * looping in the previous time sequence */
			if (s2.type == BAR) {
				ymx1 = 50;
				ymn1 = -50
			} else {
				ymx1 = s2.ymx;
				ymn1 = s2.ymn
			}
			wl = s2.wl;
			new_val = 0
			for (s3 = s.ts_prev; s3; s3 = s3.ts_prev) {
				if (new_val < s3.wr
				 && (s3.type == NOTE || s3.type == REST)
				 && (s2.type == NOTE || s2.type == REST))
					new_val = s3.wr
				if (s3.st == s2.st
				 && (!s3.invisible
				  || s3.v == s2.v)
				 && new_val < s3.wr + wl) {
					switch (s3.type) {
					case NOTE:
					case REST:
						if (s2.type == NOTE
						 || s2.type == REST) {
							new_val = s3.wr + wl
							break
						}
						/* fall thru */
					default:
						ymx2 = s3.ymx;
						ymn2 = s3.ymn
						if (ymn1 > ymx2
						 || ymx1 < ymn2)
							break
						/* fall thru */
					case SPACE:
					case BAR:
					case CLEF:
					case METER:
					case KEY:
						new_val = s3.wr + wl
						break
					}
				}
				if (s3.seqst) {
					if (new_val != 0)
						break
					wl -= s3.shrink
					if (wl < 0)
						break
				}
			}
			if (shrink < new_val)
				shrink = new_val;
			new_val = set_space(s2)
			if (space < new_val)
				space = new_val
			if ((s2 = s2.ts_next) == last_s)
				break
		} while (!s2.seqst)

		/* set the spaces at start of sequence */
		if (shrink == 0 && space == 0 && s.type == CLEF) {
			delete s.seqst;		/* no space */
			s.time = s.ts_prev.time
		}
		s.shrink = shrink;
		s.space = space
		if ((s = s2) == last_s)
			break
	}

	/* have room for the tablature header */
//	space = 0
//	for (v = 0; v < voice_tb.length; v++) {
//		p_voice = voice_tb[v]
//		if (p_voice.tblts) {
//			for (i = 0; i < p_voice.tblts.length; i++) {
//				var tblt = p_voice.tblts[i]
//				if (tblt.wh > space)
//					space = tblt.wh
//			}
//		}
//	}
//	if (space == 0)
//		return
//	shrink = 0
//	for (s = tsfirst; s != last_s; s = s.ts_next) {
//		if (s.shrink != 0)
//			shrink += s.shrink
//		if (s.type == NOTE)
//			break
//	}
//	if (s != last_s && shrink < space) {
//		while (!s.seqst)
//			s = s.ts_prev
//		s.shrink += space - shrink
//	}
}

/* change a symbol to a rest */
function to_rest(s) {
	s.type = REST
// just keep nl and seqst
	delete s.in_tuplet
	delete s.sl1
	delete s.sl2
	delete s.a_dd
	delete s.a_gch
	delete s.extra;
	s.slur_start = s.slur_end = 0
/*fixme: should set many parameters for set_width*/
//	set_width(s)
}

/* -- set the repeat sequences / measures -- */
function set_repeat(g,		// repeat format
		    s) {	// first note
	var	s2, s3,  i, j, n, dur,
		st = s.st,
		v = s.v

	/* treat the sequence repeat */
	if ((n = g.repeat_n) < 0) {		/* number of notes / measures */
		n = -n;
		i = n				/* number of notes to repeat */
		for (s3 = s.prev; s3; s3 = s3.prev) {
			if (!s3.dur) {
				if (s3.type == BAR) {
					error(1, s3, "Bar in sequence to repeat");
					g.fmt_type = undefined
					return
				}
				continue
			}
			if (--i <= 0)
				break
		}
		if (!s3) {
			error(1, s, "Not enough symbols to repeat");
			g.fmt_type = undefined
			return
		}

		i = g.repeat_k * n	/* number of notes/rests to repeat */
		for (s2 = s; s2; s2 = s2.next) {
			if (!s2.dur) {
				if (s2.type == BAR) {
					error(1, s2, "Bar in repeat sequence");
					g.fmt_type = undefined
					return
				}
				continue
			}
			if (--i <= 0)
				break
		}
		if (!s2
		 || !s2.next) {		/* should have some symbol */
			error(1, s, "Not enough symbols after repeat sequence");
			g.fmt_type = undefined
			return
		}
		for (s2 = s.prev; s2 != s3; s2 = s2.prev) {
			if (s2.type == NOTE) {
				s2.beam_end = true
				break
			}
		}
		s3 = s
		for (j = g.repeat_k; --j >= 0; ) {
			i = n			/* number of notes/rests */
			if (s3.dur)
				i--;
			s2 = s3.ts_next
			while (i > 0) {
				if (s2.st != st)
					continue
				if (s2.v == v
				 && s2.dur)
					i--
				delete s2.extra;
				unlksym(s2);
				s2 = s2.ts_next
			}
			to_rest(s3);
			s3.dur = s3.notes[0].dur = s2.time - s3.time;
			s3.repeat_n = -1;	// single repeat
			s3.beam_st = true;
			set_width(s3)
			if (s3.seqst)
				s3.space = set_space(s3);
			s3.head = "square";
			s3 = s2
		}
		g.fmt_type = undefined
		return				/* done */
	}

	/* check the measure repeat */
	i = n				/* number of measures to repeat */
	for (s2 = s.prev.prev ; s2; s2 = s2.prev) {
		if (s2.type == BAR
		 || s2.time == tsfirst.time) {
			if (--i <= 0)
				break
		}
	}
	if (!s2) {
		error(1, s, "Not enough measures to repeat");
		g.fmt_type = undefined
		return
	}

	dur = s.time - s2.time	/* repeat duration */

	if (n == 1)
		i = g.repeat_k		/* repeat number */
	else
		i = n			/* check only 2 measures */
	for (s2 = s; s2; s2 = s2.next) {
		if (s2.type == BAR) {
			if (--i <= 0)
				break
		}
	}
	if (!s2) {
		error(1, s, "Not enough bars after repeat measure");
		g.fmt_type = undefined
		return
	}

	/* if many 'repeat 2 measures'
	 * insert a new %%repeat after the next bar */
	i = g.repeat_k		/* repeat number */
	if (n == 2 && i > 1) {
		s2 = s2.next
		if (!s2) {
			error(1, s, "Not enough bars after repeat measure");
			g.fmt_type = undefined
			return
		}
		g.repeat_k = 1;
		s = clone(g);
		s.next = s2.extra
		if (s.next)
			s.next.prev = s
		delete s.prev;
		s2.extra = s;
		s.repeat_k = --i
	}

	/* replace */
	dur /= n
	if (n == 2) {			/* repeat 2 measures (once) */
		s3 = s
		for (s2 = s.ts_next; ;s2 = s2.ts_next) {
			if (s2.st != st)
				continue
			if (s2.v == v
			 && s2.type == BAR)
				break
			delete s2.extra;
			unlksym(s2)
		}
		to_rest(s3);
		s3.dur = s3.notes[0].dur = dur;
		s3.invisible = true
		if (s3.seqst)
			s3.space = set_space(s3);
		s2.bar_mrep = 2
		if (s2.seqst)
			s2.space = set_space(s2);
		s3 = s2.next;
		s2 = s3.next
		while (1) {
			if (s2.type == BAR || s2.type == CLEF)
				break
			delete s2.extra;
			unlksym(s2);
			s2 = s2.next
		}
		to_rest(s3);
		s3.dur = s3.notes[0].dur = dur;
		s3.invisible = true;
		set_width(s3)
		if (s3.seqst)
			s3.space = set_space(s3)
		if (s2.seqst)
			s2.space = set_space(s2)
		return
	}

	/* repeat 1 measure */
	s3 = s
	for (j = g.repeat_k; --j >= 0; ) {
		for (s2 = s3.ts_next; ; s2 = s2.ts_next) {
			if (s2.st != st)
				continue
			if (s2.v == v
			 && s2.type == BAR)
				break
			delete s2.extra;
			unlksym(s2)
		}
		to_rest(s3);
		s3.dur = s3.notes[0].dur = dur;
		s3.beam_st = true
		if (s3.seqst)
			s3.space = set_space(s3)
		if (s2.seqst)
			s2.space = set_space(s2)
		if (g.repeat_k == 1) {
			s3.repeat_n = 1
			break
		}
		s3.repeat_n = g.repeat_k - j + 1;
					// number to print above the repeat rest
		s3 = s2.next
	}
}

/* add a custos before the symbol of the next line */
function custos_add(s) {
	var	p_voice, new_s, i,
		s2 = s

	while (1) {
		if (s2.type == NOTE)
			break
		s2 = s2.next
		if (!s2)
			return
	}

	p_voice = voice_tb[s.v];
	p_voice.last_sym = s.prev;
//	if (!p_voice.last_sym)
//		p_voice.sym = null;
	p_voice.time = s.time;
	new_s = sym_add(p_voice);
	new_s.type = CUSTOS;
	new_s.next = s;
	s.prev = new_s;
	new_s.ts_prev = s.ts_prev;
	new_s.ts_prev.ts_next = new_s;
	new_s.ts_next = s;
	s.ts_prev = new_s;

	new_s.seqst = true;
	new_s.wl = 8;
	new_s.wr = 4;
	new_s.shrink = s.shrink
	if (new_s.shrink < 8 + 4)
		new_s.shrink = 8 + 4;
	new_s.space = s2.space;

	new_s.nhd = s2.nhd;
	new_s.notes = []
	for (i = 0; i < s.notes.length; i++) {
		new_s.notes[i] = {
			pit: s2.notes[i].pit,
			shhd: 0,
			dur: BASE_LEN / 4
		}
	}
	new_s.stemless = true
}

/* -- define the beginning of a new music line -- */
function set_nl(s) {
	var s2, p_voice, cut_here, new_sy, extra, done

	// set the end of line marker and
	// if needed, add a symbol at the end of the music line
	function set_eol(s) {
		if (cfmt.custos && voice_tb.length == 1) {
			custos_add(s)
		} else {
			s2 = s.ts_prev
			switch (s2.type) {
			case BAR:
			case FORMAT:
			case CLEF:
			case KEY:
			case METER:
				break
			default:			/* add an extra symbol at eol */
				p_voice = voice_tb[s2.v];
				p_voice.last_sym = s2;
				p_voice.time = s.time;
				s2 = s2.next;
				extra = sym_add(p_voice);
				extra.type = FORMAT;
				extra.next = s2;
				if (s2)
					s2.prev = extra;
				extra.ts_prev = extra.prev;
				extra.ts_prev.ts_next = extra;
				extra.ts_next = s;
				s.ts_prev = extra;
//				extra.fmt_type = undefined;
				extra.seqst = true;
				extra.wl = 6;
//fixme: wr not useful
//				extra.wr = 6;
				extra.shrink = s.shrink;
				extra.space = s.space
				if (s.x)
					extra.x = s.x
				break
			}
		}
		s.nl = true
	}

	// set the eol on the next symbol
	function set_eol_next(s) {
		s = s.next
		if (!s)
			return s
		while (!s.seqst)
			s = s.ts_prev;
		set_eol(s)
		return s
	}

	/* if explicit EOLN, cut on the next symbol */
	if (s.eoln && !cfmt.keywarn && !cfmt.timewarn)
		return set_eol_next(s)

	/* if normal symbol, cut here */
	switch (s.type) {
	case CLEF:
	case BAR:
		break
	case KEY:
		if (cfmt.keywarn && !s.k_none)
			break
		return set_eol_next(s)
	case METER:
		if (cfmt.timewarn)
			break
		return set_eol_next(s)
	case GRACE:			/* don't cut on a grace note */
		s = s.next
		if (!s)
			return s
		/* fall thru */
	default:
		return set_eol_next(s)
	}

	/* go back to handle the staff breaks at end of line */
	for (; s; s = s.ts_prev) {
		if (!s.seqst)
			continue
		switch (s.type) {
		case KEY:
		case CLEF:
		case METER:
			continue
		}
		break
	}
	done = 0
	for ( ; ; s = s.ts_next) {
		if (!s)
			return s
		if (s.new_sy) {
			new_sy = true;
			s.new_sy = false
		}
		if (!s.seqst)
			continue
		if (done < 0)
			break
		switch (s.type) {
		case BAR:
			if (done
			 || (!s.bar_num		/* incomplete measure */
			  && s.next		/* not at end of tune */
			  && s.bar_type[s.bar_type.length - 1] == ':'
			  && s.bar_type[0] != ':'))	/* 'xx:' (not ':xx:') */
				cut_here = true
			else
				done = 1
			break
		case STBRK:
			if (!s.stbrk_forced) {
				unlksym(s)	/* remove */
				break
			}
			done = -1	/* keep the next symbols on the next line */
			break
		case METER:
			if (!cfmt.timewarn)
				cut_here = true
			break
		case CLEF:
			if (done)
				cut_here = true
			break
		case KEY:
			if (!cfmt.keywarn || s.k_none)
				cut_here = true
			break
		default:
			if (!done || (s.prev && s.prev.type == GRACE))
				break
			cut_here = true
			break
		}
		if (cut_here)
			break
		if (s.extra) {
			if (!extra)
				extra = s
			else
				error(2, s, "Extra symbol may be misplaced")
		}
	}
	if (extra			/* extra symbol(s) to be moved */
	 && extra != s) {
		s2 = extra.extra
		while (s2.next)
			s2 = s2.next;
		s2.next = s.extra;
		s.extra = extra.extra
		delete extra.extra
	}
	if (new_sy) {
//		for (s2 = s.ts_next; /*s*/; s2 = s2.ts_next) {
//			if (s2.seqst) {
//				s2.new_sy = true
//				break
//			}
//		}
		s.new_sy = true
	}
	set_eol(s)
	return s
}

/* -- search where to cut the lines according to the staff width -- */
function set_lines(first,		/* first symbol */
			last,		/* last symbol / 0 */
			lwidth,		/* w - (clef & key sig) */
			indent) {	/* for start of tune */
	var	s, s2, s3, x, xmin, xmax, wwidth, shrink, space,
		nlines, cut_here;

	/* calculate the whole size of the piece of tune */
	wwidth = indent
	for (s = first; s != last; s = s.ts_next) {
		if (!s.seqst)
			continue
		s.x = wwidth;
		shrink = s.shrink
		if ((space = s.space) < shrink)
			wwidth += shrink
		else
			wwidth += shrink * cfmt.maxshrink
				+ space * (1 - cfmt.maxshrink)
	}

	/* loop on cutting the tune into music lines */
	s = first
	while (1) {
		nlines = Math.ceil(wwidth / lwidth)
		if (nlines <= 1) {
			if (last)
				last = set_nl(last)
			return last
		}

		/* try to cut on a measure bar */
		s2 = first = s;
		xmin = s.x + wwidth / nlines * cfmt.breaklimit;
		xmax = s.x + lwidth;
		cut_here = false
		for ( ; s != last; s = s.ts_next) {
			x = s.x
			if (!x)
				continue
			if (x > xmax)
				break
			if (s.type != BAR)
				continue
			if (x > xmin) {
				cut_here = true
				break
			}
			s2 = s				// keep the last bar
//fixme: might go further ?
		}

		/* if a bar, cut here */
		if (s == last)
			return last
//		if (s.type == BAR)
//			cut_here = true

		/* try to avoid to cut a beam */
		if (!cut_here) {
			var	beam = s2.dur &&
					!s2.beam_st && !s2.beam_end ? 1 : 0,
				bar_time = s2.time;

			s = s2;			/* restart from start or last bar */
			s2 = s3 = null;
			xmax -= 6		// a FORMAT will be added
			for ( ; s != last; s = s.ts_next) {
				if (s.beam_st) {
					if (!s.beam_end) {
						beam++
						continue
					}
				} else if (s.beam_end) {
					beam--
				}
				x = s.x
				if (!x || x < xmin)
					continue
				if (x + x.shrink >= xmax)
					break
				if (beam != 0)
					continue
				s2 = s
				if ((s.time - bar_time) % (BASE_LEN / 8) == 0)
					s3 = s
			}
			if (s3)
				s2 = s3
			if (s2)
				s = s2
			while (!s.x || s.x + s.shrink * 2 >= xmax)
				s = s.ts_prev
		}

		if (s.nl) {		/* already set here - advance */
			error(0, s, "Line split problem - " +
					"adjust maxshrink and/or breaklimit");
			nlines = 2
			for (s = s.ts_next; s != last; s = s.ts_next) {
				if (!s.x)
					continue
				if (--nlines <= 0)
					break
			}
		}
		s = set_nl(s)
		if (!s
		 || (last && s.time >= last.time))
			break
		wwidth -= s.x - first.x
	}
	return s
}

/* -- cut the tune into music lines -- */
function cut_tune(lwidth, indent) {
	var	s, s2, p_voice, i, v,
		nv = voice_tb.length,
		s = tsfirst

	/* adjust the line width according to the starting clef
	 * and key signature */
/*fixme: may change in the tune*/
	for (v = 0; v < nv; v++) {
		p_voice = voice_tb[v]
		if (p_voice.clef)
			break
	}
	set_width(p_voice.clef);
	set_width(p_voice.key);
	lwidth -= p_voice.clef.wl + p_voice.clef.wr +
		p_voice.key.wl + p_voice.key.wr

//	for (s = tsfirst; ; s = s.ts_next) {
//		if (!s.shrink)
//			continue
//		if (s.type != CLEF && s.type != KEY)
//			break
//		lwidth -= s.shrink
//	}
	if (cfmt.custos && nv == 1)
		lwidth -= 12

	/* if asked, count the measures and set the EOLNs */
	if (cfmt.barsperstaff) {
		i = cfmt.barsperstaff;
		s2 = s
		for ( ; s; s = s.ts_next) {
			if (s.type != BAR
			 || !s.bar_num)
				continue
			if (--i > 0)
				continue
			s.eoln = true;
			i = cfmt.barsperstaff
		}
		s = s2
	}

	/* cut at explicit end of line, checking the line width */
	var xmin = indent;
	s2 = s
	for ( ; s; s = s.ts_next) {
		if (!s.seqst && !s.eoln)
			continue
		xmin += s.shrink
		if (xmin > lwidth) {
//			if (cfmt.linewarn)
//				error(0, s, "Line overfull (%.0fpt of %.0fpt)",
//					xmin, lwidth)
			for ( ; s; s = s.ts_next) {
				if (s.eoln)
					break
			}
			s = s2 = set_lines(s2, s, lwidth, indent)
			if (!s)
				break
			xmin = s.shrink;
			indent = 0
//fixme: added in 1.2.5
			continue
		}
		if (!s.eoln)
			continue
		s2 = set_nl(s)
		delete s.eoln;
		s = s2
		if (!s)
			break
		xmin = s.shrink;
		indent = 0
	}
}

/* -- set the y values of some symbols -- */
function set_yval(s) {
//fixme: staff_tb is not yet defined
//	var top = staff_tb[s.st].topbar
//	var bot = staff_tb[s.st].botbar
	switch (s.type) {
	case CLEF:
		if (s.second
		 || s.invisible) {
//			s.ymx = s.ymn = (top + bot) / 2
			s.ymx = s.ymn = 12
			break
		}
		s.y = (s.clef_line - 1) * 6
		switch (s.clef_type) {
		default:			/* treble / perc */
			s.ymx = s.y + 28
			s.ymn = s.y - 14
			break
		case "c":
			s.ymx = s.y + 13
			s.ymn = s.y - 11
			break
		case "b":
			s.ymx = s.y + 7
			s.ymn = s.y - 12
			break
		}
		if (s.clef_small) {
			s.ymx -= 2;
			s.ymn += 2
		}
		if (s.ymx < 26)
			s.ymx = 26
		if (s.ymn > -1)
			s.ymn = -1
//		s.y += s.clef_line * 6
//		if (s.y > 0)
//			s.ymx += s.y
//		else if (s.y < 0)
//			s.ymn += s.y
		if (s.clef_octave) {
			if (s.clef_octave > 0)
				s.ymx += 12
			else
				s.ymn -= 12
		}
		break
	case KEY:
		if (s.k_sf > 2)
			s.ymx = 24 + 10
		else if (s.k_sf > 0)
			s.ymx = 24 + 6
		else
			s.ymx = 24 + 2;
		s.ymn = -2
		break
	default:
//		s.ymx = top + 2;
		s.ymx = 24 + 2;
		s.ymn = -2
		break
	}
}

// set the clefs (treble or bass) in a 'auto clef' sequence
// return the starting clef type
function set_auto_clef(st, s_start, clef_type_start) {
	var s, min, max, time, s2, s3;

	/* get the max and min pitches in the sequence */
	max = 12;					/* "F," */
	min = 20					/* "G" */
	for (s = s_start; s; s = s.ts_next) {
		if (s.new_sy && s != s_start)
			break
		if (s.st != st)
			continue
		if (s.type != NOTE) {
			if (s.type == CLEF) {
				if (s.clef_type != 'a')
					break
				unlksym(s)
			}
			continue
		}
		if (s.notes[0].pit < min)
			min = s.notes[0].pit
		else if (s.notes[s.nhd].pit > max)
			max = s.notes[s.nhd].pit
	}

	if (min >= 19					/* upper than 'F' */
	 || (min >= 13 && clef_type_start != 'b'))	/* or 'G,' */
		return 't'
	if (max <= 13					/* lower than 'G,' */
	 || (max <= 19 && clef_type_start != 't'))	/* or 'F' */
		return 'b'

	/* set clef changes */
	if (clef_type_start == 'a') {
		if ((max + min) / 2 >= 16)
			clef_type_start = 't'
		else
			clef_type_start = 'b'
	}
	var	clef_type = clef_type_start,
		s_last = s,
		s_last_chg = null
	for (s = s_start; s != s_last; s = s.ts_next) {
		if (s.new_sy && s != s_start)
			break
		if (s.st != st || s.type != NOTE)
			continue

		/* check if a clef change may occur */
		time = s.time
		if (clef_type == 't') {
			if (s.notes[0].pit > 12		/* F, */
			 || s.notes[s.nhd].pit > 20) {	/* G */
				if (s.notes[0].pit > 20)
					s_last_chg = s
				continue
			}
			s2 = s.ts_prev
			if (s2
			 && s2.time == time
			 && s2.st == st
			 && s2.type == NOTE
			 && s2.notes[0].pit >= 19)	/* F */
				continue
			s2 = s.ts_next
			if (s2
			 && s2.st == st
			 && s2.time == time
			 && s2.type == NOTE
			 && s2.notes[0].pit >= 19)	/* F */
				continue
		} else {
			if (s.notes[0].pit < 12		/* F, */
			 || s.notes[s.nhd].pit < 20) {	/* G */
				if (s.notes[s.nhd].pit < 12)
					s_last_chg = s
				continue
			}
			s2 = s.ts_prev
			if (s2
			 && s2.time == time
			 && s2.st == st
			 && s2.type == NOTE
			 && s2.notes[0].pit <= 13)	/* G, */
				continue
			s2 = s.ts_next
			if (s2
			 && s2.st == st
			 && s2.time == time
			 && s2.type == NOTE
			 && s2.notes[0].pit <= 13)	/* G, */
				continue
		}

		/* if first change, change the starting clef */
		if (!s_last_chg) {
			clef_type = clef_type_start =
					clef_type == 't' ? 'b' : 't';
			s_last_chg = s
			continue
		}

		/* go backwards and search where to insert a clef change */
		s3 = s
		for (s2 = s.ts_prev; s2 != s_last_chg; s2 = s2.ts_prev) {
			if (s2.st != st)
				continue
			if (s2.type == BAR
			 && s2.v == s.v) {
				s3 = s2
				break
			}
			if (s2.type != NOTE)
				continue

			/* have a 2nd choice on beam start */
			if (s2.beam_st
			 && !voice_tb[s2.v].second)
				s3 = s2
		}

		/* no change possible if no insert point */
		if (s3.time == s_last_chg.time) {
			s_last_chg = s
			continue
		}
		s_last_chg = s;

		/* insert a clef change */
		clef_type = clef_type == 't' ? 'b' : 't';
		s2 = insert_clef(s3, clef_type, clef_type == "t" ? 2 : 4);
		s2.clef_auto = true
//		s3.prev.st = st
	}
	return clef_type_start
}

/* set the clefs */
/* this function is called once at start of tune generation */
/*
 * global variables:
 *	- staff_tb[st].clef = clefs at start of line (here, start of tune)
 *				(created here, updated on clef draw)
 *	- voice_tb[v].clef = clefs at end of generation
 *				(created on voice creation, updated here)
 */
function set_clefs() {
	var	s, s2, st, v, p_voice, g, new_type, new_line, p_staff,
		staff_clef = new Array(nstaff),	// st -> { clef, autoclef }
		sy = cur_sy

	// create the staff table
	staff_tb = new Array(nstaff)
	for (st = 0; st <= nstaff; st++) {
		staff_clef[st] = {
			autoclef: true
		}
		staff_tb[st] = {
			output: []
		}
	}

	// set the starting clefs of the staves
	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		if (sy.voices[v].range < 0)
			continue
		st = sy.voices[v].st
		if (!sy.voices[v].second) {		// main voices
			if (p_voice.stafflines != undefined)
				sy.staves[st].stafflines = p_voice.stafflines
			if (p_voice.staffscale)
				sy.staves[st].staffscale = p_voice.staffscale
			if (sy.voices[v].sep)
				sy.staves[st].sep = sy.voices[v].sep
			if (sy.voices[v].maxsep)
				sy.staves[st].maxsep = sy.voices[v].maxsep;
		}
		if (!sy.voices[v].second
		 && !p_voice.clef.clef_auto)
			staff_clef[st].autoclef = false
	}
	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		if (sy.voices[v].range < 0
		 || sy.voices[v].second)		// main voices
			continue
		st = sy.voices[v].st;
		s = p_voice.clef
		if (staff_clef[st].autoclef) {
			s.clef_type = set_auto_clef(st,
						tsfirst,
						s.clef_type);
			s.clef_line = s.clef_type == 't' ? 2 : 4
		}
		staff_clef[st].clef = staff_tb[st].clef = s
	}

	for (s = tsfirst; s; s = s.ts_next) {
		for (g = s.extra ; g; g = g.next) {
			if (g.type == FORMAT && g.fmt_type == "repeat") {
				set_repeat(g, s)
				break
			}
		}

		// handle %%staves
		if (s.new_sy) {
			sy = sy.next
			for (st = 0; st <= nstaff; st++)
				staff_clef[st].autoclef = true
			for (v = 0; v < voice_tb.length; v++) {
				if (sy.voices[v].range < 0)
					continue
				p_voice = voice_tb[v];
				st = sy.voices[v].st
				if (!sy.voices[v].second) {
					if (p_voice.stafflines != undefined)
						sy.staves[st].stafflines = p_voice.stafflines
					if (p_voice.staffscale)
						sy.staves[st].staffscale = p_voice.staffscale
					if (sy.voices[v].sep)
						sy.staves[st].sep = sy.voices[v].sep
					if (sy.voices[v].maxsep)
						sy.staves[st].maxsep = sy.voices[v].maxsep
				}
				s2 = p_voice.clef
				if (!s2.clef_auto)
					staff_clef[st].autoclef = false
			}
			for (v = 0; v < voice_tb.length; v++) {
				if (sy.voices[v].range < 0
				 || sy.voices[v].second)	// main voices
					continue
				p_voice = voice_tb[v];
				st = sy.voices[v].st;
				s2 = p_voice.clef
				if (s2.clef_auto) {
//fixme: the staff may have other voices with explicit clefs...
//					if (!staff_clef[st].autoclef)
//						???
					new_type = set_auto_clef(st, s,
						staff_clef[st].clef ?
							staff_clef[st].clef.clef_type :
							'a');
					new_line = new_type == 't' ? 2 : 4
				} else {
					new_type = s2.clef_type;
					new_line = s2.clef_line
				}
				if (!staff_clef[st].clef) {	// new staff
					if (s2.clef_auto) {
						if (s2.type != 'a')
							p_voice.clef =
								clone(p_voice.clef);
						p_voice.clef.clef_type = new_type;
						p_voice.clef.clef_line = new_line
					}
					staff_tb[st].clef =
						staff_clef[st].clef = p_voice.clef
					continue
				}
								// old staff
				if (new_type == staff_clef[st].clef.clef_type
				 && new_line == staff_clef[st].clef.clef_line)
					continue
				g = s
				while (g.v != v)
					g = g.ts_next;
				if (g.type != CLEF) {
					g = insert_clef(g, new_type, new_line)
					if (s2.clef_auto)
						g.clef_auto = true
				}
				staff_clef[st].clef = p_voice.clef = g
			}
		}
		if (s.type != CLEF)
			continue
		p_voice = voice_tb[s.v];
		p_voice.clef = s
		if (s.second) {
/*fixme:%%staves:can this happen?*/
//			if (!s.prev)
//				break
			unlksym(s)
			continue
		}
		st = s.st
// may have been inserted on %%staves
//		if (s.clef_auto) {
//			unlksym(s)
//			continue
//		}

		if (staff_clef[st].clef) {
			if (s.clef_type == staff_clef[st].clef.clef_type
			 && s.clef_line == staff_clef[st].clef.clef_line
			 && !s.new_sy) {
//				unlksym(s)
				continue
			}
		} else {

			// the voice moved to a new staff with a forced clef
			staff_tb[st].clef = s
		}
		staff_clef[st].clef = s
	}

	/* set a pitch to the symbols of voices with no note */
	sy = cur_sy
	for (v = 0; v < voice_tb.length; v++) {
		if (sy.voices[v].range < 0)
			continue
		s2 = voice_tb[v].sym
		if (!s2 || s2.notes[0].pit != 127)
			continue
		st = sy.voices[v].st
		switch (staff_tb[st].clef.clef_type) {
		default:
			pitch = 22		/* 'B' */
			break
		case "c":
			pitch = 16		/* 'C' */
			break
		case "b":
			pitch = 10		/* 'D,' */
			break
		}
		for (s = s2; s; s = s.next)
			s.notes[0].pit = pitch
	}
}

/* set the pitch of the notes according to the clefs
 * and set the vertical offset of the symbols */
/* this function is called at start of tune generation and
 * then, once per music line up to the old sequence */

const delta_tb = {
	t: 0 - 2 * 2,
	c: 6 - 3 * 2,
	b: 12 - 4 * 2,
	p: 0 - 3 * 2
}

/* upper and lower space needed by rests */
const rest_sp = [
	[18, 18],
	[12, 18],
	[12, 12],
	[8, 12],
	[6, 8],
	[10, 10],			/* crotchet */
	[6, 4],
	[10, 0],
	[10, 4],
	[10, 10]
]

function set_pitch(last_s) {
	var	s, s2, g, st, delta, m, pitch, dur, note,
		staff_delta = new Array(nstaff),
		sy = cur_sy

	// set the starting clefs of the staves
	for (st = 0; st <= nstaff; st++) {
		s = staff_tb[st].clef;
		staff_delta[st] = delta_tb[s.clef_type] +
					s.clef_line * 2
		if (s.clef_oct_transp)
			staff_delta[st] -= s.clef_octave
	}

	dur = BASE_LEN
	for (s = tsfirst; s != last_s; s = s.ts_next) {
		st = s.st
		switch (s.type) {
		case CLEF:
			staff_delta[st] = delta_tb[s.clef_type] +
						s.clef_line * 2
			if (s.clef_oct_transp)
				staff_delta[st] -= s.clef_octave;
			set_yval(s)
			break
		case GRACE:
			for (g = s.extra; g; g = g.next) {
				if (g.type != NOTE)
					continue
				delta = staff_delta[g.st]
				if (delta != 0
				 && !voice_tb[s.v].key.k_drum) {
					for (m = 0; m <= g.nhd; m++) {
						note = g.notes[m];
						note.pit += delta
					}
				}
				g.ymn = 3 * (g.notes[0].pit - 18) - 2;
				g.ymx = 3 * (g.notes[g.nhd].pit - 18) + 2
			}
			set_yval(s)
			break
		case KEY:
			s.k_y_clef = staff_delta[st] /* keep the y delta */
			/* fall thru */
		default:
			set_yval(s)
			break
		case MREST:
			if (s.invisible)
				break
			s.y = 12;
			s.ymx = 24 + 15;
			s.ymn = -2
			break
		case REST:
			if (voice_tb.length == 1) {
				s.y = 12;		/* rest single voice */
//				s.ymx = 12 + 8;
//				s.ymn = 12 - 8
				s.ymx = 24;
				s.ymn = 0
				break
			}
			// fall thru
		case NOTE:
			delta = staff_delta[st]
			if (delta != 0
			 && !voice_tb[s.v].key.k_drum) {
				for (m = s.nhd; m >= 0; m--)
					s.notes[m].pit += delta
			}
			if (s.type == NOTE) {
				s.ymx = 3 * (s.notes[s.nhd].pit - 18) + 4;
				s.ymn = 3 * (s.notes[0].pit - 18) - 4;
				s.yav = (s.ymx + s.ymn) / 2
			} else {
				s.y = Math.floor((s.notes[0].pit - 18) / 2) * 6;
				s.ymx = s.y + rest_sp[5 - s.nflags][0];
				s.ymn = s.y - rest_sp[5 - s.nflags][1]
			}
			if (s.dur < dur)
				dur = s.dur
			break
		}
	}
	smallest_duration = dur
}

/* -- set the stem direction when multi-voices -- */
/* this function is called only once per tune */
function set_stem_dir() {
	var	t, u, i, st, rvoice, v,
		v_s,			// voice -> staff 1 & 2
		st_v, vobj,		// staff -> (v, ymx, ymn)*
		v_st_tb,		// array of v_st
		st_v_tb = [],		// array of st_v
		s = tsfirst,
		sy = cur_sy,
		nst = sy.nstaff

	while (s) {
		for (st = 0; st <= nst; st++)
			st_v_tb[st] = []
		v_st_tb = []

		/* get the max/min offsets in the delta time */
/*fixme: the stem height is not calculated yet*/
		for (u = s; u; u = u.ts_next) {
			if (u.type == BAR)
				break;
			if (u.new_sy) {
				if (u != s)
					break
				sy = sy.next;
				for (st = nst; st <= sy.nstaff; st++)
					st_v_tb[st] = []
				nst = sy.nstaff;
			}
			if ((u.type != NOTE && u.type != REST)
			 || u.invisible)
				continue
			st = u.st;
//test
//if (st == undefined) dump_obj(u)
/*fixme:test*/
if (st > nst) {
	var msg = "*** fatal set_stem_dir(): bad staff number " + st +
			" max " + nst;
	error(2, null, msg);
	throw new Error(msg)
}
			v = u.v;
			v_st = v_st_tb[v]
			if (!v_st) {
				v_st = {
					st1: -1,
					st2: -1
				}
				v_st_tb[v] = v_st
			}
			if (v_st.st1 < 0) {
				v_st.st1 = st
			} else if (v_st.st1 != st) {
				if (st > v_st.st1) {
					if (st > v_st.st2)
						v_st.st2 = st
				} else {
					if (v_st.st1 > v_st.st2)
						v_st.st2 = v_st.st1;
					v_st.st1 = st
				}
			}
			st_v = st_v_tb[st];
			rvoice = sy.voices[v].range;
			for (i = st_v.length; --i >= 0; ) {
				vobj = st_v[i]
				if (vobj.v == rvoice)
					break
			}
			if (i < 0) {
				vobj = {
					v: rvoice,
					ymx: 0,
					ymn: 24
				}
				for (i = 0; i < st_v.length; i++) {
					if (rvoice < st_v[i].v) {
						st_v.splice(i, 0, vobj)
						break
					}
				}
				if (i == st_v.length)
					st_v.push(vobj)
			}

			if (u.type != NOTE)
				continue
			if (u.ymx > vobj.ymx)
				vobj.ymx = u.ymx
			if (u.ymn < vobj.ymn)
				vobj.ymn = u.ymn

			if (u.xstem) {
				if (u.ts_prev.st != st - 1
				 || u.ts_prev.type != NOTE) {
					error(1, s, "Bad +xstem+")
					delete u.xstem
/*fixme:nflags KO*/
				} else {
					u.ts_prev.multi = 1;
					u.multi = 1;
					u.stemless = true
				}
			}
		}

		for ( ; s != u; s = s.ts_next) {
			if (s.multi)
				continue
			if (s.type != NOTE
			 && s.type != REST
			 && s.type != GRACE)
				continue
			st = s.st;
			v = s.v;
			v_st = v_st_tb[v];
			st_v = st_v_tb[st]
			if (v_st && v_st.st2 >= 0) {
				if (st == v_st.st1)
					s.multi = -1
				else if (st == v_st.st2)
					s.multi = 1
				continue
			}
			if (st_v.length <= 1) { /* voice alone on the staff */
//				if (s.multi)
//					continue
/*fixme:could be done in set_var()*/
				if (s.floating) {
					if (st == voice_tb[v].st)
						s.multi = -1
					else
						s.multi = 1
				}
				continue
			}
			rvoice = sy.voices[v].range
			for (i = st_v.length; --i >= 0; ) {
				if (st_v[i].v == rvoice)
					break
			}
			if (i < 0)
				continue		/* voice ignored */
			if (i == st_v.length - 1) {
				s.multi = -1	/* last voice */
			} else {
				s.multi = 1	/* first voice(s) */

				/* if 3 voices, and vertical space enough,
				 * have stems down for the middle voice */
				if (i != 0 && i + 2 == st_v.length) {
					if (st_v[i].ymn - cfmt.stemheight
							> st_v[i + 1].ymx)
						s.multi = -1;

					/* special case for unison */
					t = s.ts_next
//fixme: pb with ../lacerda/evol-7.5.5.abc
					if (s.ts_prev
					 && s.ts_prev.time == s.time
					 && s.ts_prev.st == s.st
					 && s.notes[s.nhd].pit == s.ts_prev.notes[0].pit
					 && s.beam_st
					 && s.beam_end
					 && (!t
					  || t.st != s.st
					  || t.time != s.time))
						s.multi = -1
				}
			}
		}
		while (s && s.type == BAR) {
			if (s.new_sy) {
				sy = sy.next;
				nst = sy.nstaff
			}
			s = s.ts_next
		}
	}
}

/* -- adjust the offset of the rests when many voices -- */
/* this function is called only once per tune */
function set_rest_offset() {
	var	s, s2, v, end_time, not_alone, v_s, y, ymax, ymin,
		shift, dots, dx,
		v_s_tb = [],
		sy = cur_sy

	for (s = tsfirst; s; s = s.ts_next) {
		if (s.invisible)
			continue
		if (s.new_sy)
			sy = sy.next
		switch (s.type) {
		default:
			continue
		case NOTE:
		case REST:
			break
		}
		v_s = v_s_tb[s.v]
		if (!v_s) {
			v_s = {}
			v_s_tb[s.v] = v_s
		}
		v_s.s = s;
		v_s.st = s.st;
		v_s.end_time = s.time + s.dur
		if (s.type != REST)
			continue

		/* check if clash with previous symbols */
		ymin = -127;
		ymax = 127;
		not_alone = dots = false
		for (v = 0; v <= v_s_tb.length; v++) {
			v_s = v_s_tb[v]
			if (!v_s || !v_s.s
			 || v_s.st != s.st
			 || v == s.v)
				continue
			if (v_s.end_time <= s.time)
				continue
			not_alone = true;
			s2 = v_s.s
			if (sy.voices[v].range < sy.voices[s.v].range) {
				if (s2.ymn < ymax) {
					if (s2.time == s.time) {
						ymax = s2.ymn
						if (s2.dots)
							dots = true
					} else {
						ymax = (s2.ymx + s2.ymn) / 2
					}
				}
			} else {
				if (s2.ymx > ymin) {
					if (s2.time == s.time) {
						ymin = s2.ymx
						if (s2.dots)
							dots = true
					} else {
						ymin = (s2.ymx + s2.ymn) / 2
					}
				}
			}
		}

		/* check if clash with next symbols */
		end_time = s.time + s.dur
		for (s2 = s.ts_next; s2; s2 = s2.ts_next) {
			if (s2.time >= end_time)
				break
			if (s2.st != s.st
			 || (s2.type != NOTE && s2.type != REST)
			 || s2.invisible)
				continue
			not_alone = true
			if (sy.voices[s2.v].range < sy.voices[s.v].range) {
				if (s2.ymn < ymax) {
					if (s2.time == s.time) {
						ymax = s2.ymn
						if (s2.dots)
							dots = true
					} else {
						ymax = (s2.ymx + s2.ymn) / 2
					}
				}
			} else {
				if (s2.ymx > ymin) {
					if (s2.time == s.time) {
						ymin = s2.ymx
						if (s2.dots)
							dots = true
					} else {
						ymin = (s2.ymx + s2.ymn) / 2
					}
				}
			}
		}
		shift = ymax - s.ymx
		if (shift < 0) {
			shift = Math.ceil(-shift / 6) * 6
			if (s.ymn - shift >= ymin) {
				s.y -= shift;
				s.ymx -= shift;
				s.ymn -= shift
				continue
			}
			dx = dots ? 15 : 10;
			s.notes[0].shhd = dx;
			s.xmx = dx
			continue
		}
		shift = ymin - s.ymn
		if (shift > 0) {
			shift = Math.ceil(shift / 6) * 6
			if (s.ymx + shift <= ymax) {
				s.y += shift;
				s.ymx += shift;
				s.ymn += shift
				continue
			}
			dx = dots ? 15 : 10;
			s.notes[0].shhd = dx;
			s.xmx = dx
			continue
		}
		if (!not_alone) {
			s.y = 12;
			s.ymx = 24;
			s.ymn = 0
		}
	}
}

/* -- create a starting symbol -- */
function new_sym(type, p_voice,
			last_s) {	/* symbol at same time */
	s = {
		type: type,
		ctx: last_s.ctx,
//		istart: last_s.istart,
//		iend: last_s.iend,
		v: p_voice.v,
		st: p_voice.st,
		time: last_s.time,
		next: p_voice.last_sym.next
	}
	if (s.next)
		s.next.prev = s;
	p_voice.last_sym.next = s;
	s.prev = p_voice.last_sym;
	p_voice.last_sym = s;

	s.ts_next = last_s;
	s.ts_prev = last_s.ts_prev;
	s.ts_prev.ts_next = s
	if (s.ts_prev.type != type)
		s.seqst = true;
	last_s.ts_prev = s
	if (last_s.type == type && s.v != last_s.v) {
		delete last_s.seqst;
		last_s.shrink = 0
	}
	return s
}

/* -- init the symbols at start of a music line -- */
/* this routine is called when starting a tune generation,
 * and later for each new music line */
function init_music_line() {
	var	p_voice, s, last_s, i, v, st,
		nv = voice_tb.length

	/* initialize the voices */
	for (v = 0; v < nv; v++) {
		p_voice = voice_tb[v]
		if (cur_sy.voices[v].range < 0)
			continue
		p_voice.second = cur_sy.voices[v].second;

		/* move the voice to a non empty staff */
		st = cur_sy.voices[v].st
		while (st < nstaff && cur_sy.staves[st].empty)
			st++;
		p_voice.st = st;
	}

	/* output the inter-staff blocks if any */
	last_s = tsfirst;
	for (s = last_s.extra; s; s = s.next) {
		if (s.type != BLOCK)
			continue
		switch (s.subtype) {
		case "center":
			write_text(s.text, 'c')
			break
		case "sep":
			vskip(s.sk1);
			output.push('<path class="stroke"\n\td="M');
			out_sxsy(s.x, ' ', 0);
			output.push('h' + s.l.toFixed(2) + '"/>\n');
			vskip(s.sk2);
			blk_out()
			break
		case "ml":
			svg_flush();
			user.img_out(s.text)
			break
		case "text":
			write_text(s.text, s.opt)
			break
		case "title":
			write_title(s.text, true)
			break
		case "vskip":
			vskip(s.sk);
			blk_out()
			break
		}
	}

	/* add a clef at start of the main voices */
	while (last_s.type == CLEF) {		/* move the starting clefs */
		v = last_s.v;
		p_voice = voice_tb[v]
		if (cur_sy.voices[v].range >= 0
		 && !cur_sy.voices[v].second) {
			delete last_s.clef_small;	/* normal clef */
			p_voice.last_sym = p_voice.sym = last_s
		}
		last_s = last_s.ts_next
	}
	for (v = 0; v < nv; v++) {
		p_voice = voice_tb[v]
		if (p_voice.sym && p_voice.sym.type == CLEF)
			continue
		if (cur_sy.voices[v].range < 0
		 || (cur_sy.voices[v].second
		  && !p_voice.bar_start))	// needed for correct linkage
			continue
		st = cur_sy.voices[v].st
		if (!staff_tb[st]
		 || !staff_tb[st].clef)
			continue
		s = clone(staff_tb[st].clef);
		s.v = v;
		s.st = st;
		s.time = last_s.time;
		s.prev = null;
		s.next = p_voice.sym
		if (s.next)
			s.next.prev = s;
		p_voice.sym = s;
		p_voice.last_sym = s;
		s.ts_next = last_s;
		s.ts_prev = last_s.ts_prev
		if (!s.ts_prev) {
			tsfirst = s;
			s.seqst = true
		} else {
			s.ts_prev.ts_next = s;
			delete s.seqst
		}
		last_s.ts_prev = s
		if (last_s.type == CLEF)
			delete last_s.seqst
		delete s.clef_small;
//		if (cur_sy.voices[v].second)
//			s.second = true
		s.second = cur_sy.voices[v].second
// (fixme: needed for sample5 Fugue)
		if (cur_sy.staves[st].empty)
			s.invisible = true
//		set_yval(s)
	}

	/* add keysig */
	for (v = 0; v < nv; v++) {
		if (cur_sy.voices[v].range < 0
		 || cur_sy.voices[v].second
		 || cur_sy.staves[cur_sy.voices[v].st].empty)
			continue
		p_voice = voice_tb[v]
		if (last_s.v == v && last_s.type == KEY) {
			p_voice.last_sym = last_s;
			last_s = last_s.ts_next
			continue
		}
		if (p_voice.key.k_sf || p_voice.key.k_a_acc) {
			s = new_sym(KEY, p_voice, last_s);
			s.k_sf = p_voice.key.k_sf;
			s.k_old_sf = p_voice.key.k_old_sf;
			s.k_a_acc = p_voice.key.k_a_acc;
			s.istart = p_voice.key.istart;
			s.iend = p_voice.key.iend
			if (p_voice.key.k_bagpipe) {
				s.k_bagpipe = p_voice.key.k_bagpipe
				if (s.k_bagpipe == 'p')
					s.k_old_sf = 3	/* "A" -> "D" => G natural */
			}
//			set_yval(s)
		}
	}

	/* add time signature (meter) if needed */
	if (insert_meter & 1) {
		for (v = 0; v < nv; v++) {
			p_voice = voice_tb[v]
			if (cur_sy.voices[v].range < 0
			 || cur_sy.voices[v].second
			 || cur_sy.staves[cur_sy.voices[v].st].empty
			 || p_voice.meter.a_meter.length == 0)
				continue
			if (last_s.v == v && last_s.type == METER) {
				p_voice.last_sym = last_s;
				last_s = last_s.ts_next
				continue
			}
			s = new_sym(METER, p_voice, last_s);
			s.istart = p_voice.meter.istart;
			s.iend = p_voice.meter.iend;
			s.wmeasure = p_voice.meter.wmeasure;
			s.a_meter = p_voice.meter.a_meter;
//			set_yval(s)
		}
	}

	/* add bar if needed */
	for (v = 0; v < nv; v++) {
		p_voice = voice_tb[v]
		if (!p_voice.bar_start
		 || cur_sy.voices[v].range < 0
//		 || cur_sy.voices[v].second
		 || cur_sy.staves[cur_sy.voices[v].st].empty)
			continue
		i = 2
		if (!p_voice.bar_start.text	/* if repeat continuation */
		 && p_voice.bar_start.bar_type == "[") {
			for (s = p_voice.last_sym;
			     s;
			     s = s.next) {	/* search the end of repeat */
				if (s.rbstop) {
					i = -1
					break
				}
				if (s.type != BAR)
					continue
				if (s.bar_type.length > 1	/* if complex bar */
				 || s.bar_type == "]"
				 || s.text)			// repeat bar
					break
				if (--i < 0)
					break
			}
			if (!s)
				i = -1
			if (i >= 0 && p_voice.last_sym.time == s.time)
				i = -1			/* no note */
		}
		if (i >= 0) {
			s = new_sym(BAR, p_voice, last_s);
			s.istart = p_voice.bar_start.istart;
			s.iend = p_voice.bar_start.iend;
			s.bar_type = p_voice.bar_start.bar_type
			if (p_voice.bar_start.invisible)
				s.invisible = true
			if (p_voice.bar_start.norepbra)
				s.norepbra = true
			s.text = p_voice.bar_start.text;
			s.a_gch = p_voice.bar_start.a_gch
//			set_yval(s)
		}
		delete p_voice.bar_start
	}

	/* if initialization of a new music line, compute the spacing,
	 * including the first (old) sequence */
	set_pitch(last_s);
	s = last_s
	if (s) {
		for ( ; s; s = s.ts_next)
			if (s.seqst)
				break
	}
	if (s) {
		for (s = s.ts_next; s; s = s.ts_next)
			if (s.seqst)
				break
	}
	set_allsymwidth(s)	/* set the width of the added symbols */
}

/* -- initialize the generator -- */
/* this function is called only once per tune  */

const delpit = [0, -7, -14, 0]

function set_global() {
	var s, p_voice, st, v, nv, lastnote

	/* get the max number of staves */
	var sy = cur_sy;
	st = sy.nstaff
	while (1) {
		sy = sy.next
		if (!sy)
			break
		if (sy.nstaff > st)
			st = sy.nstaff
	}
	nstaff = st;
//	staff_tb = new Array(nstaff)

	/* set a pitch for all symbols and the start/stop of words (beams) */
	nv = voice_tb.length
	for (v = 0; v < nv; v++) {
		p_voice = voice_tb[v]
		var	pitch, start_flag,
			sym = p_voice.sym
		for (s = sym; s; s = s.next) {
			if (s.type == NOTE) {
				pitch = s.notes[0].pit
				break
			}
		}
		if (!s)
			pitch = 127;			/* no note */
		start_flag = true
		for (s = sym; s; s = s.next) {
			switch (s.type) {
			case MREST:
				start_flag = true
				break
			case BAR:
				if (!s.beam_on)
					start_flag = true
				if (!s.next && s.prev
				 && s.prev.type == NOTE
				 && s.prev.dur >= BASE_LEN * 2)
					s.prev.head = "square"
				break
			case NOTE:
			case REST:
				if (s.trem2)
					break
				var nflags = s.nflags

				if (s.ntrem)
					nflags += s.ntrem
				if (s.type == REST && s.beam_end) {
					s.beam_end = false;
					start_flag = true
				}
				if (start_flag
				 || nflags <= 0) {
					if (lastnote) {
						lastnote.beam_end = true;
						lastnote = null
					}
					if (nflags <= 0) {
						s.beam_st = true;
						s.beam_end = true
					} else if (s.type == NOTE) {
						s.beam_st = true;
						start_flag = false
					}
				}
				if (s.beam_end)
					start_flag = true
				if (s.type == NOTE)
					lastnote = s
				break
			}
			if (s.type == NOTE) {
				if (s.nhd != 0)
					sort_pitch(s);
				pitch = s.notes[0].pit
				if (s.prev
				 && s.prev.type != NOTE) {
					s.prev.notes[0].pit = (s.prev.notes[0].pit
							    + pitch) / 2
				}
			} else {
				if (!s.notes) {
					s.notes = []
					s.notes[0] = {}
					s.nhd = 0
				}
				s.notes[0].pit = pitch
			}
		}
		if (lastnote)
			lastnote.beam_end = true
	}

	/* set the staff of the floating voices */
	set_float();

	// set the clefs and adjust the pitches of all symbol
	set_clefs();
	set_pitch(null)
}

/* -- return the left indentation of the staves -- */
function set_indent() {
	var	st, v, w, p_voice, p, i, font,
		maxw = 0

	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		if (cur_sy.voices[v].range < 0)
			continue
		st = cur_sy.voices[v].st
		if (cur_sy.staves[st].empty)
			continue
		p = p_voice.new_name ? p_voice.nm : p_voice.snm
		if (!p)
			continue
		if (!font) {
			font = get_font("voice");
			gene.curfont = gene.deffont = font
		}
		var i = 0, j
		while (1) {
			j = p.indexOf("\\n", i)
			if (j < 0)
				w = strw(p.slice(i))
			else
				w = strw(p.slice(i, j))
			if (w > maxw)
				maxw = w
			if (j < 0)
				break
			i = j + 1
		}
	}

	if (maxw != 0) {
		w = 0
//fixme:nstaff: cur_sy may not have all staves
		for (st = 0; st <= cur_sy.nstaff; st++) {
			if (cur_sy.staves[st].flags
					& (OPEN_BRACE2 | OPEN_BRACKET2)) {
				w = 20
				break
			}
			if ((cur_sy.staves[st].flags
					& (OPEN_BRACE | OPEN_BRACKET))
			 && w == 0)
				w = 10
		}
		maxw += 4 * cwid(' ') * font.swfac + w
	}
	if (insert_meter & 2)			/* if indent */
		maxw += cfmt.indent
	return maxw
}

/* -- decide on beams and on stem directions -- */
/* this routine is called only once per tune */
function set_beams(sym) {
	var	s, t, g, beam, s_opp, dy,
		laststem = -1,
		lasty = 0

	for (s = sym; s; s = s.next) {
		if (s.type != NOTE) {
			if (s.type != GRACE)
				continue
			g = s.extra
			while (g.type != NOTE)
				g = g.next
			if (g.stem == 2) {	/* opposite gstem direction */
				s_opp = s
				continue
			}
			if (!s.stem
			 && (s.stem = s.multi) == 0)
				s.stem = 1
			for (; g; g = g.next) {
				g.stem = s.stem;
				g.multi = s.multi
			}
			continue
		}

		if (!s.stem			/* if not explicitly set */
		 && (s.stem = s.multi) == 0) { /* and alone on the staff */

			/* notes in a beam have the same stem direction */
			if (beam) {
				s.stem = laststem
			} else if (s.beam_st && !s.beam_end) {
				var	avg = s.yav,	/* start of beam */
					n = 12

				for (t = s.next; t; t = t.next) {
					if (t.type == NOTE) {
						if (t.multi) {
							avg = n - t.multi
							break
						}
						avg += t.yav;
						n += 12
					}
					if (t.beam_end)
						break
				}
				if (avg < n)
					laststem = 1
				else if (avg > n || cfmt.bstemdown)
					laststem = -1;
				beam = true;
				s.stem = laststem
			} else {
				s.stem = s.yav >= 12 ? -1 : 1
				if (s.yav == 12		/* note on middle line */
				 && !cfmt.bstemdown) {
					if (!s.prev || s.prev.type == BAR) {
						for (t = s.next; t; t = t.next) {
							if (t.type == NOTE
							 || t.type == BAR)
								break
						}
						if (t && t.type == NOTE
						 && t.yav < 12)
							s.stem = 1
					} else {
						dy = s.yav - lasty
						if (dy > -7 && dy < 7)
							s.stem = laststem
					}
				}
			}
		} else {			/* stem set by set_stem_dir */
			if (s.beam_st && !s.beam_end)
				beam = true
		}
		if (s.beam_end)
			beam = false;
		laststem = s.stem;
		lasty = s.yav

		if (s_opp) {			/* opposite gstem direction */
			for (g = s_opp.extra; g; g = g.next)
				g.stem = -laststem;
			s_opp.stem = -laststem;
			s_opp = null
		}
	}
}

// check if there may be one head for unison when voice overlap
function same_head(s1, s2) {
	var i1, i2, l1, l2, head, i11, i12, i21, i22, sh1, sh2

	if (s1.shiftunison && s1.shiftunison >= 3)
		return false
	if ((l1 = s1.dur) >= BASE_LEN)
		return false
	if ((l2 = s2.dur) >= BASE_LEN)
		return false
	if (s1.stemless && s2.stemless)
		return false
	if (s1.dots != s2.dots) {
		if ((s1.shiftunison && (s1.shiftunison & 1))
		 || s1.dots * s2.dots != 0)
			return false
	}
	if (s1.stem * s2.stem > 0)
		return false

	/* check if a common unison */
	i1 = i2 = 0
	if (s1.notes[0].pit > s2.notes[0].pit) {
//fixme:dots
		if (s1.stem < 0)
			return false
		while (s2.notes[i2].pit != s1.notes[0].pit) {
			if (++i2 > s2.nhd)
				return false
		}
	} else if (s1.notes[0].pit < s2.notes[0].pit) {
//fixme:dots
		if (s2.stem < 0)
			return false
		while (s2.notes[0].pit != s1.notes[i1].pit) {
			if (++i1 > s1.nhd)
				return false
		}
	}
	if (s2.notes[i2].acc != s1.notes[i1].acc)
		return false;
	i11 = i1;
	i21 = i2;
	sh1 = s1.notes[i1].shhd;
	sh2 = s2.notes[i2].shhd
	do {
//fixme:dots
		i1++;
		i2++
		if (i1 > s1.nhd) {
//fixme:dots
//			if (s1.notes[0].pit < s2.notes[0].pit)
//				return false
			break
		}
		if (i2 > s2.nhd) {
//fixme:dots
//			if (s1.notes[0].pit > s2.notes[0].pit)
//				return false
			break
		}
		if (s2.notes[i2].acc != s1.notes[i1].acc)
			return false
		if (sh1 < s1.notes[i1].shhd)
			sh1 = s1.notes[i1].shhd
		if (sh2 < s2.notes[i2].shhd)
			sh2 = s2.notes[i2].shhd
	} while (s2.notes[i2].pit == s1.notes[i1].pit)
//fixme:dots
	if (i1 <= s1.nhd) {
		if (i2 <= s2.nhd)
			return false
		if (s2.stem > 0)
			return false
	} else if (i2 <= s2.nhd) {
		if (s1.stem > 0)
			return false
//	} else {
	}
	i12 = i1;
	i22 = i2;

	head = 0
	if (l1 != l2) {
		if (l1 < l2) {
			l1 = l2;
			l2 = s1.dur
		}
		if (l1 < BASE_LEN / 2) {
			if (s2.dots > 0)
				head = 2
			else if (s1.dots > 0)
				head = 1
		} else if (l2 < BASE_LEN / 4) {	/* (l1 >= BASE_LEN / 2) */
//			if ((s1.shiftunison && s1.shiftunison == 2)
//			 || s1.dots != s2.dots)
			if (s1.shiftunison && (s1.shiftunison & 2))
				return false
			head = s2.dur >= BASE_LEN / 2 ? 2 : 1
		} else {
			return false
		}
	}
	if (head == 0)
		head = voice_tb[s1.v].scale < voice_tb[s2.v].scale ? 2 : 1
	if (head == 1) {
		s2.nohdi1 = i21;	/* keep heads of 1st voice */
		s2.nohdi2 = i22	
		for (i2 = i21; i2 < i22; i2++)
			delete s2.notes[i2].acc
		for (i2 = 0; i2 <= s2.nhd; i2++)
			s2.notes[i2].shhd += sh1
	} else {
		s1.nohdi1 = i11;	/* keep heads of 2nd voice */
		s1.nohdi2 = i12
		for (i1 = i11; i1 < i12; i1++)
			delete s1.notes[i1].acc
		for (i1 = 0; i1 <= s1.nhd; i1++)
			s1.notes[i1].shhd += sh2
	}
	return true
}

/* width of notes for voice overlap - index = head */
const w_note = {
	full: 3.5,
	empty: 3.7,
	oval: 5,
	square: 7
}

/* handle unison with different accidentals */
function unison_acc(s1, s2, i1, i2) {
	var m, d

	if (!s2.notes[i2].acc) {
		d = w_note[s2.head] * 2 + s2.xmx + s1.notes[i1].shac + 2
		if (s1.notes[i1].micro)
			d += 2
		if (s2.dots)
			d += 6
		for (m = 0; m <= s1.nhd; m++) {
			s1.notes[m].shhd += d;
			s1.notes[m].shac -= d
		}
		s1.xmx += d
	} else {
		d = w_note[s1.head] * 2 + s1.xmx + s2.notes[i2].shac + 2
		if (s2.notes[i2].micro)
			d += 2
		if (s1.dots)
			d += 6
		for (m = 0; m <= s2.nhd; m++) {
			s2.notes[m].shhd += d;
			s2.notes[m].shac -= d
		}
		s2.xmx += d
	}
}

const MAXPIT = 48 * 2
/* set the left space of a note/chord */
function set_left(s, left) {
	var	m, i, j, w, shift,
		w_base = w_note[s.head]

	for (i = 0; i < MAXPIT; i++)
		left[i] = -100;

	/* stem */
	w = w_base
	if (s.stem > 0) {
		w = -w;
		i = s.notes[0].pit * 2;
		j = (Math.ceil((s.ymx - 2) / 3) + 18) * 2
	} else {
		i = (Math.ceil((s.ymn + 2) / 3) + 18) * 2;
		j = s.notes[s.nhd].pit * 2
	}
	if (i < 0)
		i = 0
	for (; i < MAXPIT && i <= j; i++)
		left[i] = w

	/* notes */
	shift = s.notes[s.stem > 0 ? 0 : s.nhd].shhd;	/* previous shift */
	for (m = 0; m <= s.nhd; m++) {
		w = -s.notes[m].shhd + w_base + shift;
		i = s.notes[m].pit * 2
		if (i < 0)
			i = 0
		else if (i >= MAXPIT - 1)
			i = MAXPIT - 2
		if (w > left[i])
			left[i] = w
		if (s.head != "square")
			w -= 1
		if (w > left[i - 1])
			left[i - 1] = w
		if (w > left[i + 1])
			left[i + 1] = w
	}
}

/* set the right space of a note/chord */
function set_right(s, right) {
	var	m, i, j, k, flags, w, shift,
		w_base = w_note[s.head]

	for (i = 0; i < MAXPIT; i++)
		right[i] = -100;

	/* stem and flags */
	flags = s.nflags > 0 && s.beam_st && s.beam_end;
	w = w_base
	if (s.stem < 0) {
		w = -w;
		i = (Math.ceil((s.ymn + 2) / 3) + 18) * 2;
		j = s.notes[s.nhd].pit * 2;
		k = i + 4
	} else {
		i = s.notes[0].pit * 2;
		j = (Math.ceil((s.ymx - 2) / 3) + 18) * 2
	}
	if (i < 0)
		i = 0
	for ( ; i < MAXPIT && i < j; i++)
		right[i] = w
	if (flags) {
		if (s.stem > 0) {
			if (s.xmx == 0)
				i = s.notes[s.nhd].pit * 2
			else
				i = s.notes[0].pit * 2;
			i += 4
			if (i < 0)
				i = 0
			for (; i < MAXPIT && i <= j - 4; i++)
				right[i] = 11
		} else {
			i = k
			if (i < 0)
				i = 0
			for (; i < MAXPIT && i <= s.notes[0].pit * 2 - 4; i++)
				right[i] = 3.5
		}
	}

	/* notes */
	shift = s.notes[s.stem > 0 ? 0 : s.nhd].shhd	/* previous shift */
	for (m = 0; m <= s.nhd; m++) {
		w = s.notes[m].shhd + w_base - shift;
		i = s.notes[m].pit * 2
		if (i < 0)
			i = 0
		else if (i >= MAXPIT - 1)
			i = MAXPIT - 2
		if (w > right[i])
			right[i] = w
		if (s.head != "square")
			w -= 1
		if (w > right[i - 1])
			right[i - 1] = w
		if (w > right[i + 1])
			right[i + 1] = w
	}
}

/* -- shift the notes horizontally when voices overlap -- */
/* this routine is called only once per tune */
function set_overlap() {
	var	s, s1, s2, i, i1, i2, m, sd, t, dp,
		d, d2, dr, dr2, dx,
		left1 = [], right1 = [], left2 = [], right2 = [],
		pl, pr

	// invert the voices
	function v_invert() {
		s1 = s2;
		s2 = s;
		d = d2;
		pl = left1;
		pr = right1;
		dr2 = dr
	}

	for (s = tsfirst; s; s = s.ts_next) {
		if (s.type != NOTE
		 || s.invisible)
			continue

		/* treat the stem on two staves with different directions */
		if (s.xstem
		 && s.ts_prev.stem < 0) {
			s2 = s.ts_prev
			for (m = 0; m <= s2.nhd; m++) {
				s2.notes[m].shhd += 3.5 * 2;	// stem_xoff
				s2.notes[m].shac -= 3.5 * 2
			}
			s2.xmx += 3.5 * 2
		}

		/* search the next note at the same time on the same staff */
		s2 = s
		for (;;) {
			s2 = s2.ts_next
			if (!s2)
				break
			if (s2.time != s.time) {
				s2 = null
				break
			}
			if (s2.type == NOTE
			 && !s2.invisible
			 && s2.st == s.st)
				break
		}
		if (!s2)
			continue
		s1 = s

		/* set the dot vertical offset */
		if (cur_sy.voices[s1.v].range < cur_sy.voices[s2.v].range)
			s2.dot_low = true
		else
			s1.dot_low = true;

		/* no shift if no overlap */
		if (s1.ymn > s2.ymx
		 || s1.ymx < s2.ymn)
			continue

		if (same_head(s1, s2))
			continue

		/* compute the minimum space for 's1 s2' and 's2 s1' */
		set_right(s1, right1);
		set_left(s2, left2);
		d = -10
		for (i = 0; i < MAXPIT; i++) {
			if (left2[i] + right1[i] > d)
				d = left2[i] + right1[i]
		}
		if (d < -3) {			// no clash if no dots clash
			if (!s1.dots || !s2.dots
			 || !s2.dot_low
			 || s1.stem > 0 || s2.stem < 0
			 || s1.notes[s1.nhd].pit + 2 != s2.notes[0].pit
			 || (s2.notes[0].pit & 1))
				continue
		}

		set_right(s2, right2);
		set_left(s1, left1);
		d2 = dr = dr2 = -100
		for (i = 0; i < MAXPIT; i++) {
			if (left1[i] + right2[i] > d2)
				d2 = left1[i] + right2[i]
			if (right2[i] > dr2)
				dr2 = right2[i]
			if (right1[i] > dr)
				dr = right1[i]
		}

		/* check for unison with different accidentals
		 * and clash of dots */
		t = 0;
		i1 = s1.nhd;
		i2 = s2.nhd
		for (;;) {
			dp = s1.notes[i1].pit - s2.notes[i2].pit;
			switch (dp) {
			case 0:
				if (s1.notes[i1].acc != s2.notes[i2].acc) {
					t = -1
					break
				}
				if (s2.notes[i2].acc)
					s2.notes[i2].acc = 0
				if (s1.dots && s2.dots
				 && (s1.notes[i1].pit & 1))
					t = 1
				break
			case -1:
//fixme:dots++
//				if (s1.dots && s2.dots)
//					t = 1
//++--
				if (s1.dots && s2.dots) {
					if (s1.notes[i1].pit & 1) {
						s1.dot_low = false
						s2.dot_low = false
					} else {
						s1.dot_low = true
						s2.dot_low = true
					}
				}
//fixme:dots--
				break
			case -2:
				if (s1.dots && s2.dots
				 && !(s1.notes[i1].pit & 1)) {
//fixme:dots++
//					t = 1
//++--
//??
//					s1.dot_low = true
//					s2.dot_low = true
					s1.dot_low = false
					s2.dot_low = false
//fixme:dots--
					break
				}
				break
			}
			if (t < 0)
				break
			if (dp >= 0) {
				if (--i1 < 0)
					break
			}
			if (dp <= 0) {
				if (--i2 < 0)
					break
			}
		}
		
		if (t < 0) {	/* unison and different accidentals */
			unison_acc(s1, s2, i1, i2)
			continue
		}

		sd = 0;
		if (s1.dots) {
			if (s2.dots) {
				if (!t)			/* if no dot clash */
					sd = 1		/* align the dots */
//fixme:dots
			}
		} else if (s2.dots) {
			if (d2 + dr < d + dr2)
				sd = 1		/* align the dots */
//fixme:dots
		}
		pl = left2;
		pr = right2
		if (d2 + dr < d + dr2)
			v_invert()
		d += 3
		if (d < 0)
			d = 0;			// (not return!)

		/* handle the previous shift */
		m = s1.stem >= 0 ? 0 : s1.nhd;
		d += s1.notes[m].shhd;
		m = s2.stem >= 0 ? 0 : s2.nhd;
		d -= s2.notes[m].shhd

		/*
		 * room for the dots
		 * - if the dots of v1 don't shift, adjust the shift of v2
		 * - otherwise, align the dots and shift them if clash
		 */
		if (s1.dots) {
			dx = 7.7 + s1.xmx +		// x 1st dot
				3.5 * s1.dots - 3.5 +	// x last dot
				3;			// some space
			if (!sd) {
				d2 = -100;
				for (i1 = 0; i1 <= s1.nhd; i1++) {
					i = s1.notes[i1].pit
					if (!(i & 1)) {
						if (!s1.dot_low)
							i++
						else
							i--
					}
					i *= 2
					if (i < 1)
						i = 1
					else if (i >= MAXPIT - 1)
						i = MAXPIT - 2
					if (pl[i] > d2)
						d2 = pl[i]
					if (pl[i - 1] + 1 > d2)
						d2 = pl[i - 1] + 1
					if (pl[i + 1] + 1 > d2)
						d2 = pl[i + 1] + 1
				}
				if (dx + d2 + 2 > d)
					d = dx + d2 + 2
			} else {
				if (dx < d + dr2 + s2.xmx) {
					d2 = 0
					for (i1 = 0; i1 <= s1.nhd; i1++) {
						i = s1.notes[i1].pit
						if (!(i & 1)) {
							if (!s1.dot_low)
								i++
							else
								i--
						}
						i *= 2
						if (i < 1)
							i = 1
						else if (i >= MAXPIT - 1)
							i = MAXPIT - 2
						if (pr[i] > d2)
							d2 = pr[i]
						if (pr[i - 1] + 1 > d2)
							d2 = pr[i - 1] = 1
						if (pr[i + 1] + 1 > d2)
							d2 = pr[i + 1] + 1
					}
					if (d2 > 4.5
					 && 7.7 + s1.xmx + 2 < d + d2 + s2.xmx)
						s2.xmx = d2 + 3 - 7.7
				}
			}
		}

		for (m = s2.nhd; m >= 0; m--) {
			s2.notes[m].shhd += d
//			if (s2.notes[m].acc
//			 && s2.notes[m].pit < s1.notes[0].pit - 4)
//				s2.notes[m].shac -= d
		}
		s2.xmx += d
		if (sd)
			s1.xmx = s2.xmx		// align the dots
	}
}

/* -- set the stem height -- */
/* this routine is called only once per tune */
function set_stems() {
	var s, s2, g, slen, scale,ymn, ymx, nflags, ymin, ymax

	for (s = tsfirst; s; s = s.ts_next) {
		if (s.type != NOTE) {
			if (s.type != GRACE)
				continue
			ymin = ymax = 12
			for (g = s.extra; g; g = g.next) {
				if (g.type != NOTE)
					continue
				slen = GSTEM
				if (g.nflags > 1)
					slen += 1.2 * (g.nflags - 1);
				ymn = 3 * (g.notes[0].pit - 18);
				ymx = 3 * (g.notes[g.nhd].pit - 18)
				if (s.stem >= 0) {
					g.y = ymn;
					g.ys = ymx + slen;
					ymx = Math.round(g.ys)
				} else {
					g.y = ymx;
					g.ys = ymn - slen;
					ymn = Math.round(g.ys)
				}
				ymx += 2;
				ymn -= 2
				if (ymn < ymin)
					ymin = ymn
				else if (ymx > ymax)
					ymax = ymx;
				g.ymx = ymx;
				g.ymn = ymn
			}
			s.ymx = ymax;
			s.ymn = ymin
			continue
		}

		/* shift notes in chords (need stem direction to do this) */
		set_head_shift(s);

		/* if start or end of beam, adjust the number of flags
		 * with the other end */
		nflags = s.nflags
		if (s.beam_st && !s.beam_end) {
			if (s.feathered_beam)
				nflags = ++s.nflags
			for (s2 = s.next; /*s2*/; s2 = s2.next) {
				if (s2.type == NOTE) {
					if (s.feathered_beam)
						s2.nflags++
					if (s2.beam_end)
						break
				}
			}
/*			if (s2) */
			    if (s2.nflags > nflags)
				nflags = s2.nflags
		} else if (!s.beam_st && s.beam_end) {
//fixme: keep the start of beam ?
			for (s2 = s.prev; /*s2*/; s2 = s2.prev) {
				if (s2.beam_st)
					break
			}
/*			if (s2) */
			    if (s2.nflags > nflags)
				nflags = s2.nflags
		}

		/* set height of stem end */
		slen = cfmt.stemheight
		switch (nflags) {
		case 2: slen += 2; break
		case 3:	slen += 5; break
		case 4:	slen += 10; break
		case 5:	slen += 16; break
		}
		if ((scale = voice_tb[s.v].scale) != 1)
			slen *= (scale + 1) * 0.5;
		ymn = 3 * (s.notes[0].pit - 18)
		if (s.nhd > 0) {
			slen -= 2;
			ymx = 3 * (s.notes[s.nhd].pit - 18)
		} else {
			ymx = ymn
		}
		if (s.ntrem)
			slen += 2 * s.ntrem		/* tremolo */
		if (s.stemless) {
			if (s.stem >= 0) {
				s.y = ymn;
				s.ys = ymx
			} else {
				s.ys = ymn;
				s.y = ymx
			}
			if (nflags == -4)		/* if longa */
				ymn -= 6;
			s.ymx = ymx + 4;
			s.ymn = ymn - 4
		} else if (s.stem >= 0) {
			if (nflags >= 2)
				slen -= 1
			if (s.notes[s.nhd].pit > 26
			 && (nflags <= 0
			  || !s.beam_st
			  || !s.beam_end)) {
				slen -= 2
				if (s.notes[s.nhd].pit > 28)
					slen -= 2
			}
			s.y = ymn
			if (s.notes[0].ti1 != 0)
				ymn -= 3;
			s.ymn = ymn - 4;
			s.ys = ymx + slen
			if (s.ys < 12)
				s.ys = 12;
			s.ymx = s.ys + 2.5
		} else {			/* stem down */
			if (s.notes[0].pit < 18
			 && (nflags <= 0
			  || !s.beam_st || !s.beam_end)) {
				slen -= 2
				if (s.notes[0].pit < 16)
					slen -= 2
			}
			s.ys = ymn - slen
			if (s.ys > 12)
				s.ys = 12;
			s.ymn = s.ys - 2.5;
			s.y = ymx
/*fixme:the tie may be lower*/
			if (s.notes[s.nhd].ti1 != 0)
				ymx += 3;
			s.ymx = ymx + 4
		}
	}
}

/* -- split up unsuitable bars at end of staff -- */
function check_bar(s) {
	var	bar_type, i, b1, b2,
		p_voice = voice_tb[s.v]

	/* search the last bar */
	while (s.type == CLEF || s.type == KEY || s.type == METER) {
		if (s.type == METER
		 && s.time > p_voice.sym.time)	/* if not empty voice */
			insert_meter |= 1	/* meter in the next line */
		s = s.prev
		if (!s)
			return
	}
	if (s.type != BAR)
		return

	if (s.text) {					// if repeat bar
		p_voice.bar_start = clone(s);
		p_voice.bar_start.bar_type = "["
		delete s.text
		delete s.a_gch
//		return
	}
	bar_type = s.bar_type
	if (bar_type == ":")
		return
	if (bar_type[bar_type.length - 1] != ':')	// if not left repeat bar
		return

	if (!p_voice.bar_start)
		p_voice.bar_start = clone(s)
	if (bar_type[0] != ':') {			/* 'xx:' (not ':xx:') */
		p_voice.bar_start.bar_type = bar_type
		if (s.prev && s.prev.type == BAR)
			unlksym(s)
		else
			s.bar_type = "|"
		return
	}
	if (bar_type == "::") {
		p_voice.bar_start.bar_type = "|:";
		s.bar_type = ":|"
		return
	}

	// '::xx::' -> '::|' and '|::'
//fixme: do the same in abcm2ps
	i = 0
	while (bar_type[i] == ':')
		i++
	if (i < bar_type.length) {
		s.bar_type = bar_type.slice(0, i) + '|';
		i = bar_type.length - 1
		while (bar_type[i] == ':')
			i--;
		p_voice.bar_start.bar_type = '|' + bar_type.slice(i + 1)
	} else {
		i = Math.floor(bar_type.length / 2);		// '::::' !
		s.bar_type = bar_type.slice(0, i) + '|';
		p_voice.bar_start.bar_type = '|' + bar_type.slice(i)
	}
}

/* -- move the symbols of an empty staff to the next one -- */
function sym_staff_move(st, s, sy) {
	while (1) {
		if (s.st == st
		 && s.type != CLEF) {
			s.st++;
			s.invisible = true
		}
		s = s.ts_next
		if (s == tsnext
		 || s.new_sy)
			break
	}
}

/* -- define the start and end of a piece of tune -- */
/* tsnext becomes the beginning of the next line */
function set_piece() {
	var	s, p_voice, st, v, nst, nv,
		empty = [],
		sy = cur_sy

	function reset_staff(st) {
		var	p_staff = staff_tb[st],
			sy_staff = sy.staves[st]

		if (!p_staff)
			p_staff = staff_tb[st] = {}
		p_staff.y = 0;		/* staff system not computed */
//		p_staff.clef = sy_staff.clef;
		p_staff.stafflines = sy_staff.stafflines;
		p_staff.staffscale = sy_staff.staffscale;
		empty[st] = true
	}

	/* adjust the empty flag */
	function set_empty(sy) {
		var	st, i, empty_fl,
			n = sy.staves.length

		/* if a system brace has empty and non empty staves, keep all staves */
		for (st = 0; st < n; st++) {
			if (!(sy.staves[st].flags & (OPEN_BRACE | OPEN_BRACE2)))
				continue
			empty_fl = 0;
			i = st
			while (st < n) {
				empty_fl |= sy.staves[st].empty ? 1 : 2
				if (sy.staves[st].flags & (CLOSE_BRACE | CLOSE_BRACE2))
					break
				st++
			}
			if (empty_fl == 3) {	/* if both empty and not empty staves */
/*fixme: add measure bars on empty main voices*/
				while (i <= st)
					sy.staves[i++].empty = false
			}
		}
	}

	// set the top and bottom of the staves
	function set_top_bot() {
		var st, p_staff, i, l, hole

		for (st = 0; st <= nstaff; st++) {
			p_staff = staff_tb[st]
			if (empty[st]) {
				p_staff.botbar = p_staff.topbar = 0
				continue
			}
			l = p_staff.stafflines.length;
			p_staff.topbar = 6 * (l - 1)

			for (i = 0; i < l - 1; i++)
				if (p_staff.stafflines[i] != '.')
					break
			p_staff.botline = p_staff.botbar = i * 6
			if (i >= l - 2) {		// 0, 1 or 2 lines
				p_staff.botbar -= 6;
				p_staff.topbar += 6
			}
		}
	}

	/* reset the staves */
	nstaff = nst = sy.nstaff
	for (st = 0; st <= nst; st++)
		reset_staff(st)

	/* search the next end of line,
	 * set the repeat measures, (remove some dble bars?)
	 * and mark the empty staves
	 */
	for (s = tsfirst; s; s = s.ts_next) {
		if (s.nl)
			break
		if (s.new_sy) {
			for (st = 0; st <= nstaff; st++) {
				sy.staves[st].empty = empty[st];
				empty[st] = true
			}
			set_empty(sy)	
			for ( ; st <= nst; st++)
				sy.staves[st].empty = true;
			sy = sy.next;
			nst = sy.nstaff
			if (nst > nstaff)
				nstaff = nst
			for (; st <= nst; st++)
				reset_staff(st)
		}
		if (s.st > nstaff) {		// if clef warning for new staff
			unlksym(s)
			continue
		}
		if (!empty[s.st])
			continue
		switch (s.type) {
		case GRACE:
			empty[s.st] = false
			break
		case NOTE:
		case REST:
		case SPACE:
		case MREST:
			if (cfmt.staffnonote > 1) {
				empty[s.st] = false
			} else if (!s.invisible) {
				if (cfmt.staffnonote != 0
				 || s.type == NOTE)
					empty[s.st] = false
			}
			break
		}
	}
	tsnext = s

	/* set the last empty staves and
	 * define the offsets of the measure bars */
	for (st = 0; st <= nstaff; st++)
		sy.staves[st].empty = empty[st];
	set_empty(sy);
	set_top_bot()

	/* move the symbols of the empty staves to the next staff */
	sy = cur_sy
	for (st = 0; st < nstaff; st++) {
		if (sy.staves[st].empty)
			sym_staff_move(st, tsfirst, sy)
	}
	if (sy.next) {
		for (s = tsfirst; s; s = s.ts_next) {
			if (s.nl)
				break
			if (s.new_sy) {
				sy = sy.next
				for (st = 0; st < sy.nstaff; st++) {
					if (sy.staves[st].empty)
						sym_staff_move(st, s, sy)
				}
				if (!sy.next)
					break
			}
		}
	}

	/* let the last empty staff have a full height */
	if (empty[nstaff])
		staff_tb[nstaff].topbar = 0;

	/* initialize the music line */
	init_music_line()
	if (!empty[nstaff])
		insert_meter &= ~1	// no more meter

	/* if last music line, nothing more to do */
	if (!tsnext)
		return

	s = tsnext
	s.nl = false;
	s = s.ts_prev;
	s.ts_next = null;

	/* set the end of the voices */
	nv = voice_tb.length
	for (v = 0; v < nv; v++) {
		if (voice_tb[v].sym
		 && voice_tb[v].sym.time <= tsnext.time) {
			for (s = tsnext.ts_prev; s; s = s.ts_prev) {
				if (s.v == v) {
					voice_tb[v].s_next = s.next;
					s.next = null;
					check_bar(s)
					break
				}
			}
			if (s)
				continue
		}
		voice_tb[v].s_next = voice_tb[v].sym
		voice_tb[v].sym = null
	}
}

/* -- position the symbols along the staff -- */
function set_sym_glue(width) {
	var space, beta0, alfa, beta

	/* calculate the whole space of the symbols */
	var	some_grace,
		s = tsfirst,
		xmin = 0,
		x = 0,
		xmax = 0
	while (1) {
		if (s.type == GRACE)
			some_grace = true
		if (s.seqst) {
			space = s.space;
			xmin += s.shrink
			if (space < s.shrink)
				space = s.shrink;
			x += space
//			if (cfmt.stretchstaff)
//				space *= 1.8;
//			xmax += space
		}
		if (!s.ts_next)
			break
		s = s.ts_next
	}

	xmax = x
	if (cfmt.stretchstaff)
		xmax *= 1.8;
	/* set max shrink and stretch */
//	if (!cfmt.continueall)
		beta0 = 1		/* max expansion before complaining */
//	else
//		beta0 = 0.1		/* max expansion for flag -c */

	/* memorize the glue for the last music line */
	if (tsnext) {
		if (x >= width) {
			beta_last = 0
		} else {
			beta_last = (width - x) / (xmax - x)	/* stretch */
			if (beta_last > beta0) {
				if (cfmt.stretchstaff) {
					if (cfmt.linewarn) {
						error(0, s, "Line underfull (" +
							(beta0 * xmax + (1 - beta0) * x).toFixed(2) +
							"pt of " +
							width.toFixed(2) +
							"pt)")
					}
				} else {
					width = x;
					beta_last = 0
				}
			}
		}
	} else {			/* if last music line */
		if (x < width) {
			beta = (width - x) / (xmax - x)	/* stretch */
			if (beta >= beta_last) {
				beta = beta_last * xmax + (1 - beta_last) * x

				/* shrink underfull last line same as previous */
				if (beta < width * (1. - cfmt.stretchlast))
					width = beta
			}
		}
	}

	var spafac = width / x;			/* space expansion factor */

	/* define the x offsets of all starting symbols */
	x = xmax = 0;
	s = tsfirst
	while (1) {
		if (s.seqst) {
			space = s.shrink
			if (s.space != 0) {
				if (space < s.space * spafac)
					space = s.space * spafac;
				xmax += s.space * spafac * 1.8
			}
			x += space;
			xmax += space;
			s.x = x;
			s.xmax = xmax
		}
		if (!s.ts_next)
			break
		s = s.ts_next
	}

	/* if the last symbol is not a bar, add some extra space */
	switch (s.type) {
	case BAR:
		break
	case FORMAT:
		break
	case CUSTOS:
		x += s.wr;
		xmin += s.wr;
		xmax += s.wr
		break
	default:
		var min = s.wr
		while (!s.seqst) {
			s = s.ts_prev
			if (s.wr > min)
				min = s.wr
		}
		xmin += min + 3
		if (tsnext && tsnext.space * 0.8 > s.wr + 4) {
			x += tsnext.space * 0.8 * spafac;
			xmax += tsnext.space * 0.8 * spafac * 1.8
		} else {
			x += min + 4;
			xmax += min + 4
		}
		break
	}

	/* calculate the exact glue */
	if (x >= width) {
		beta = 0
		if (x == xmin) {
			alfa = 1			// no extra space
		} else {
			alfa = (x - width) / (x - xmin)		/* shrink */
			if (alfa > 1) {
				error(0, s, "Line too much shrunk " +
					xmin.toFixed(2) + " " +
					x.toFixed(2) + " " +
					width.toFixed(2))
// uncomment for staff greater than music line
//				alfa = 1
			}
		}
		realwidth = xmin * alfa + x * (1 - alfa)
	} else {
		alfa = 0
		if (xmax > x)
			beta = (width - x) / (xmax - x)		/* stretch */
		else
			beta = 1				/* (no note) */
		if (beta > beta0) {
			if (!cfmt.stretchstaff)
				beta = 0
		}
		realwidth = xmax * beta + x * (1 - beta)
	}

	/* set the final x offsets */
	s = tsfirst
	if (alfa != 0) {
		if (alfa < 1) {
			x = xmin = 0
			for (; s; s = s.ts_next) {
				if (s.seqst) {
					xmin += s.shrink * alfa;
					x = xmin + s.x * (1 - alfa)
				}
				s.x = x
			}
		} else {
			alfa = realwidth / x;
			x = 0
			for (; s; s = s.ts_next) {
				if (s.seqst)
					x = s.x * alfa;
				s.x = x
			}
		}
	} else {
		x = 0
		for (; s; s = s.ts_next) {
			if (s.seqst)
				x = s.xmax * beta + s.x * (1 - beta);
			s.x = x
		}
	}

	/* set the x offsets of the grace notes */
	if (some_grace) {
		for (s = tsfirst; s; s = s.ts_next) {
			if (s.type != GRACE)
				continue
			x = s.x - s.wl + Number(cfmt.gracespace[0]);
			for (var g = s.extra; g; g = g.next)
				if (g.type == NOTE)
					g.x += x
		}
	}
}

// restore the linkage o the voices after generation of a music line
//function voice_restore() {
//	var	p_voice, s, v,
//		nv = voice_tb.length;
//
//	for (v = 0; v < nv; v++) {
//		p_voice = voice_tb[v];
//		s = p_voice.s_prev;
//		if (s)
//			p_voice.sym.prev = s;
//	}
//}

/* -- initialize a new music line -- */
function new_music_line() {
	var	p_voice, s, v,
		nv = voice_tb.length

	// set the first symbol of each voice
	for (v = 0; v < nv; v++) {
		p_voice = voice_tb[v];
		s = p_voice.s_next;		// (set in set_piece)
		p_voice.sym = s
//		p_voice.s_prev = s.prev
		if (s)
			s.prev = null
	}
}

/* -- initialize the start of generation / new music line -- */
function gen_init() {
	for (var s = tsfirst ; s; s = s.ts_next) {
//--fixme
//		if (s.extra)
//			output_ps(s, ABC_S_HEAD)
		if (s.new_sy) {
			s.new_sy = false;
			cur_sy = cur_sy.next
		}
		switch (s.type) {
		case CLEF:
		case KEY:
		case METER:
			continue
		case FORMAT:
//fixme
//			if (s.extra)
//				output_ps(s, 127)
			if (!s.extra) {
				unlksym(s)
				if (!tsfirst)
					return
			}
			break		/* may be Q: */
		}
		return
	}
	tsfirst = null			/* no more notes */
}

/* -- generate the music -- */
function output_music() {
	var output_sav, v, lwidth, indent, line_height
//		tsprev

	// give the parser result to the application
	if (user.get_abcmodel)
		user.get_abcmodel(tsfirst, voice_tb, anno_type, info)

	if (!user.img_out)
		return

	gen_init()
	if (!tsfirst)
		return
	set_global()
	if (voice_tb.length > 1) {	/* if many voices */
//		if (cfmt.combinevoices >= 0)
			combine_voices();
		set_stem_dir()		/* set the stems direction in 'multi' */
	}

	for (v = 0; v < voice_tb.length; v++)
		set_beams(voice_tb[v].sym);	/* decide on beams */

	set_stems()			/* set the stem lengths */
	if (voice_tb.length > 1) {	/* if many voices */
		set_rest_offset();	/* set the vertical offset of rests */
		set_overlap()		/* shift the notes on voice overlap */
	}
	set_acc_shft();			// set the horizontal offset of accidentals 

	set_allsymwidth(null);		/* set the width of all symbols */

	lwidth = (cfmt.pagewidth - cfmt.leftmargin - cfmt.rightmargin)
			/ cfmt.scale
	if (lwidth < 50) {
		error(1, null, "Bad page width " + lwidth);
		lwidth = 10 * CM
	}
	indent = set_indent();
	cut_tune(lwidth, indent);
	beta_last = 0;
	while (1) {			/* loop per music line */
		set_piece();
		indent = set_indent();
		set_sym_glue(lwidth - indent)
		if (indent != 0)
			posx += indent;
		output_sav = output;
		output = undefined;
		draw_sym_near();	// delayed output
		output = output_sav;
		line_height = set_staff();
		delayed_update();
		draw_systems(indent);
		draw_all_sym();
		draw_all_deco();
		set_sscale(-1);			/* restore the scale */
		vskip(line_height)
		if (indent != 0) {
			posx -= indent;
			insert_meter &= ~2	// no more indentation
		}

//		// restore the linkages
//		if (tsprev) {
//			tsfirst.ts_prev = tsprev;
//			voice_restore()
//		}
		tsfirst = tsnext
		if (!tsnext)
			break
//		tsprev = tsnext.ts_prev;
//		tsprev.ts_next = tsnext;

		// next line
		gen_init()
		if (!tsfirst)
			break
		blk_out();
		tsfirst.ts_prev = null;
		new_music_line()
	}
}

/* -- reset the generator -- */
function reset_gen() {
	insert_meter = cfmt.writefields.indexOf('M') >= 0 ?
				3 :	/* insert meter and indent */
				2	/* indent only */
}
// abc2svg - parse.js - ABC parse
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

var	gchord,		// array of parsed guitar chords
	a_dcn,		// array of parsed decoration names
	multicol,	// multi column object
	maps,		// maps object - hashcode = map name
			//	-> object - hashcode = note
			//	[0] array of heads
			//	[1] print
			//	[2] color
	not_ascii = "Not an ASCII character"

// -- %% pseudo-comment

// clef definition (%%clef, K: and V:)
function new_clef(clef_def) {
	var	s = {
			type: CLEF,
			ctx: parse.ctx,
			istart: parse.istart,
			iend: parse.iend,
			clef_line: 2,
			clef_type: "t"
		},
		i = 1

	switch (clef_def[0]) {
	case '"':
		i = clef_def.indexOf('"');
		s.clef_name = clef_def.slice(1, i);
		i++
		break
	case 'a':
		if (clef_def[1] == 'u') {	// auto
			s.clef_type = "a";
			s.clef_auto = true;
			i = 4
			break
		}
		i = 4				// alto
	case 'C':
		s.clef_type = "c";
		s.clef_line = 3
		break
	case 'b':				// bass
		i = 4
	case 'F':
		s.clef_type = "b";
		s.clef_line = 4
		break
	case 'n':				// none
		i = 4
		s.invisible = true
		break
	case 't':
		if (clef_def[1] == 'e') {	// tenor
			s.clef_type = "c";
			s.clef_line = 4
			break
		}
		i = 6
	case 'G':
//		s.clef_type = "t"		// treble
		break
	case 'p':
		i = 4
	case 'P':				// perc
		s.clef_type = "p"
		s.clef_line = 3
		break
	default:
		parse.line.error("unknown clef '" + clef_def + "'")
		delete s
		return undefined
	}
	if (clef_def[i] >= '1' && clef_def[i] <= '9') {
		s.clef_line = Number(clef_def[i]);
		i++
	}
	if (clef_def[i + 1] != '8')
		return s
	switch (clef_def[i]) {			// octave
	case '^':
		s.clef_oct_transp = true
	case '+':
		s.clef_octave = 7
		break
	case '_':
		s.clef_oct_transp = true
	case '-':
		s.clef_octave = -7
		break
	default:
		return s
	}
	return s
}

// get a %%transpose value
var pit_st = [0, 2, 4, 5, 7, 9, 11]
function get_transpose(param) {
	var val, tmp, note, pit = []

	if (param[0] == '0')
		return 0
	if ("123456789-".indexOf(param[0]) >= 0) {	// by semi-tone
		val = parseInt(param) * 3
		if (isNaN(val) || val < -108 || val > 108) {
			parse.line.error("Bad %%transpose value")
			return
		}
		switch (param[param.length - 1]) {
		default:
			return val
		case '#':
			val++
			break
		case 'b':
			val += 2
			break
		}
		if (val > 0)
			return val
		return val - 3
	}

	// by music interval
	tmp = new scanBuf();
	tmp.buffer = param;
	tmp.index = 0;
	tmp.ctx = parse.ctx;
	for (i = 0; i < 2; i++) {
		note = parse_acc_pit(tmp)
		if (!note) {
			parse.line.error("Bad %%transpose value")
			return
		}
		note.pit += 126 - 2;		// for value > 0 and 'C' % 7 == 0
		val = Math.floor(note.pit / 7) * 12 + pit_st[note.pit % 7]
		if (note.acc && note.acc != 3)		// if ! natural
			val += note.acc;
		pit[i] = val
	}
	val = (pit[1] - pit[0]) * 3
	switch (note.acc) {
	default:
		return val
	case 2:
	case 1:
		val++
		break
	case -1:
	case -2:
		val += 2
		break
	}
	if (val > 0)
		return val
	return val - 3
}

// set the linebreak character
function set_linebreak(param) {
	var i, item

	for (i = 0; i < 128; i++) {
		if (char_tb[i] == "\n") {
			char_tb[i] = nil	// remove old definition
			break
		}
	}
	param = param.split(/\s+/)
	for (i = 0; i < param.length; i++) {
		item = param[i]
		switch (item) {
		case '!':
		case '$':
		case '*':
		case ';':
		case '?':
		case '@':
			break
		case "<none>":
			continue
			break
		case "<EOL>":
			item = '\n'
			break
		default:
			parse.line.error("Bad value '" + item +
				"' in %%linebreak - ignored")
			continue
		}
		char_tb[item.charCodeAt(0)] = '\n'
	}
}

// set a new user character (U: or %%user)
function set_user(param) {
	var	j, k, val,
		c = param[0],
		c2 = '!',
		i = param.indexOf('!')

	if (i < 0) {
		i = param.indexOf('"')
		if (i < 0) {
			parse.line.error('Lack of starting ! or " in U:/%%user')
			return
		}
		c2 = '"'
	}
	j = param.indexOf(c2, i + 1)
	if (j < 0) {
		parse.line.error('Lack of ending ' + c2 + ' in U:/%%user')
		return
	}
	if (c == '\\') {
		c = param[1]
		if (c == 't')
			c = '\t'
	}
	k = c.charCodeAt(0)
	if (k >= 128) {
		parse.line.error(not_ascii)
		return
	}
	switch (char_tb[k][0]) {
	case '0':			// nil
	case 'd':
	case 'i':
	case ' ':
		break
	case '"':
	case '!':
		if (char_tb[k].length > 1)
			break
		// fall thru
	default:
		parse.line.error("Bad user character '" + c + "'")
		return
	}
	val = param.slice(i, j + 1)
	switch (val) {
	case "!beambreak!":
		val = " "
		break
	case "!ignore!":
		val = "i"
		break
	case "!nil!":
	case "!none!":
		val = "d"
		break
	}
	char_tb[k] = val
}

// get a stafflines value
function get_st_lines(param) {
	var n, val

	if (param[0] == '|' || param[0] == '.')
//fixme: should check if only '|' and '.', and no '.' at the end except when only '.'s
		return param
	n = parseInt(param)
	switch (n) {
	case 0: return '...'
	case 1: return '..|'
	case 2: return '.||'
	case 3: return '|||.'
	}
	if (isNaN(n) || n < 0 || n > 16)
		return undefined
	val = '|'
	while (--n > 0)
		val += '|'
	return val
}

// create a text block
function new_block(subtype) {
	if (parse.state == 2)
		goto_tune()
	var s = {
		type: BLOCK,
		subtype: subtype
	}
	curvoice = voice_tb[0]
//fixme: should search the control voice
	if (curvoice.last_sym)
		curvoice.last_sym.eoln = true;
	sym_link(s)
	return s
}

/* -- process a pseudo-comment (%% or I:) -- */
function do_pscom(text) {
	var	h1, val, s, cmd, param, n, k,
		lock = false

	function set_v_param(k, v) {
		if (curvoice) {
			curvoice[k] = v
		} else {
			if (!parse.voice_param)
				parse.voice_param = {}
			parse.voice_param[k] = v
		}
	}

	if (text.match(/ lock$/)) {
		lock = true;
		text = text.slice(0, -5).trim()
	}
	cmd = text.match(/(\w|-)+/)
	if (!cmd)
		return
	cmd = cmd[0];
	param = text.replace(cmd, '').trim()
	switch (cmd) {
	case "break":
//fixme: to do
		return
	case "center":
		if (parse.state >= 2) {
			s = new_block("center");
			s.text = cnv_escape(param)
			return
		}
		write_text(cnv_escape(param), 'c')
		return
	case "clef":
		if (parse.state >= 2) {
			if (parse.state == 2)
				goto_tune();
			s = new_clef(param)
			if (s)
				get_clef(s)
		}
		return
	case "clip":
//fixme: to do
		return
	case "deco":
		deco_add(param)
		return
	case "linebreak":
		set_linebreak(param)
		return
	case "map":
		get_map(param)
		return
	case "maxsysstaffsep":
//--fixme: may be global
		if (parse.state == 3) {
			par_sy.voices[curvoice.v].maxsep = get_unit(param)
			return
		}
		break
	case "multicol":
		generate();
		switch (param) {
		case "start":
			blk_out();
			multicol = {
				posy: posy,
				maxy: posy,
				lmarg: cfmt.leftmargin,
				rmarg: cfmt.rightmargin,
				state: parse.state
			}
			break
		case "new":
			if (!multicol) {
				parse.line.error("%%multicol new without start")
				break
			}
			if (posy > multicol.maxy)
				multicol.maxy = posy;
			cfmt.leftmargin = multicol.lmarg;
			posx = cfmt.leftmargin / cfmt.scale;
			cfmt.rightmargin = multicol.rmarg;
			posy = multicol.posy
			break
		case "end":
			if (!multicol) {
				parse.line.error("%%multicol end without start")
				break
			}
			cfmt.leftmargin = multicol.lmarg;
			posx = cfmt.leftmargin / cfmt.scale;
			cfmt.rightmargin = multicol.rmarg
			if (posy < multicol.maxy)
				posy = multicol.maxy;
			multicol = undefined;
			blk_out()
			break
		default:
			parse.line.error("Unknown keyword '" + param + "' in %%multicol")
			break
		}
		return
	case "repbra":
		if (parse.state >= 2) {
			if (parse.state == 2)
				goto_tune();
			curvoice.norepbra = !get_bool(param)
		}
		return
	case "repeat":
		if (parse.state != 3) {
			if (parse.state != 2)
				return
			goto_tune()
		}
		if (!curvoice.last_sym) {
				parse.line.error("%%repeat cannot start a tune")
				return
			}
			if (!param.length) {
				n = 1;
				k = 1
			} else {
				var b = param.split(/\s+/);

				n = parseInt(b[0]);
				k = parseInt(b[1])
				if (isNaN(n) || n < 1
				 || (curvoice.last_sym.type == BAR
				  && n > 2)) {

					parse.line.error("Incorrect 1st value in %%repeat")
					return
				}
				if (isNaN(k)) {
					k = 1
				} else {
					if (k < 1) {
//					 || (curvoice.last_sym.type == BAR
//					  && n == 2
//					  && k > 1)) {
						parse.line.error("Incorrect 2nd value in repeat")
						return
					}
				}
			}
			s = {
				type: FORMAT,
				fmt_type: "repeat",
				repeat_k: k
			}
			if (curvoice.last_sym.type == BAR)
				s.repeat_n = n
			else
				s.repeat_n = -n;
			sym_link(s)
		return
	case "sep":
//		if (parse.state >= 2)
//			gen_ly();
		lwidth = cfmt.pagewidth - cfmt.leftmargin - cfmt.rightmargin
		var h2, len;
		h1 = h2 = len = 0
		if (param) {
			var values = param.split(/\s+/);
			h1 = get_unit(values[0])
			if (values[1]) {
				h2 = get_unit(values[1])
				if (values[2])
					len = get_unit(values[2])
			}
		}
		if (h1 < 1)
			h1 = 14
		if (h2 < 1)
			h2 = h1
		if (len < 1)
			len = 90;
		if (parse.state >= 2) {
			s = new_block("sep");
			s.x = (lwidth - len) / 2 / cfmt.scale;
			s.l = len / cfmt.scale;
			s.sk1 = h1;
			s.sk2 = h2
			return
		}
		vskip(h1);
		output.push('<path class="stroke"\n\td="M');
		out_sxsy((lwidth - len) / 2 / cfmt.scale, ' ', 0);
		output.push('h' + (len / cfmt.scale).toFixed(2) + '"/>\n');
		vskip(h2);
		blk_out()
		return
	case "setbarnb":
		val = parseInt(param)
		if (isNaN(val)) {
			parse.line.error("Bad %%setbarnb value")
			return
		}
		if (parse.state >= 2)
			glovar.new_nbar = val
		else
			cfmt.measurefirst = val
		return
	case "staff":
		if (parse.state != 3) {
			if (parse.state != 2)
				return
			goto_tune()
		}
		val = parseInt(param)
		if (isNaN(val)) {
			parse.line.error("Bad %%staff value '" + param + "'")
			return
		}
		var st
		if (param[0] == '+' || param[0] == '-')
			st = curvoice.cst + val
		else
			st = val - 1
		if (st < 0 || st > nstaff) {
			parse.line.error("Bad %%staff number " + st +
					' cur ' + curvoice.cst + ' max ' + nstaff)
			return
		}
		delete curvoice.floating;
		curvoice.cst = st
		return
	case "staffbreak":
		if (parse.state != 3) {
			if (parse.state != 2)
				return
			goto_tune()
		}
		s = {
			type: STBRK
		}
		if (param[0] >= '0' && param[0] <= '9') {
			s.xmx = get_unit(param)
			if (param[param.length - 1] == 'f')
				s.stbrk_forced = true
		} else {
			s.xmx = 14
			if (param[0] == 'f')
				s.stbrk_forced = true
		}
		sym_link(s)
		return
	case "stafflines":
		val = get_st_lines(param)
		if (!val) {
			parse.line.error("Bad %%stafflines value")
			return
		}
		if (!curvoice) {
//		if (parse.state != 3) {
//			if (parse.state != 2) {
				glovar.stafflines = val
				return
//			}
//			goto_tune()
		}
		curvoice.stafflines = val
		return
	case "staffscale":
		val = parseFloat(param)
		if (isNaN(val) || val < 0.3 || val > 2) {
			parse.line.error("Bad %%staffscale value")
			return
		}
		if (!curvoice) {
//		if (parse.state != 3) {
//			if (parse.state != 2) {
				glovar.staffscale = val
				return
//			}
//			goto_tune()
		}
		curvoice.staffscale = val
		return
	case "staves":
	case "score":
		if (parse.state == 0)
			return
		get_staves(cmd, param)
		return
	case "sysstaffsep":
//--fixme: may be global
		if (parse.state == 3) {
			par_sy.voices[curvoice.v].sep = get_unit(param)
			return
		}
		break
	case "text":
		if (parse.state >= 2) {
			s = new_block("text");
			s.text = cnv_escape(param);
			s.opt = cfmt.textoption
			return
		}
		write_text(cnv_escape(param), cfmt.textoption)
		return
//	case "tablature":
//fixme: to do
//		return
	case "transpose":
		if (parse.state == 2)
			goto_tune()
		val = get_transpose(param)
		if (!curvoice) {
			if (parse.state == 0)
				cfmt.transpose = val	// file header
			else
				cfmt.transpose += val	// tune header
			return
		}

//		if (curvoice.clef.clef_type == "p")	// percussion
//			return
		if (curvoice.ckey.k_bagpipe || curvoice.ckey.k_drum)
			return

		// transpose inside tune, update the starting key or insert new one
		curvoice.transpose = val + cfmt.transpose;
		s = curvoice.sym
		if (!s) {				// no symbol yet
			curvoice.key = clone(curvoice.okey);
			key_transpose(curvoice.key, curvoice.transpose);
			curvoice.ckey = clone(curvoice.key)
			if (curvoice.key.k_none)
				curvoice.key.k_sf = 0
			return
		}
		for (;;) {
			if (s.type == KEY)
				break
			if (s.time == curvoice.time) {
				s = s.prev
				if (s)
					continue
			}
			s = sym_add(curvoice);
			s.type = KEY;
//			s.k_old_sf = curvoice.ckey.k_sf;
			s.k_old_sf = curvoice.key.k_sf
//			s.k_mode = curvoice.ckey.k_mode
			break
		}
		s.k_sf = curvoice.okey.k_sf
//		if (curvoice.okey.k_bagpipe)
//			s.k_bagpipe = curvoice.okey.k_bagpipe
		if (curvoice.okey.k_none)
			s.k_none = curvoice.okey.k_none
//fixme: no transpose of accidental list...
		if (curvoice.okey.k_a_acc)
			s.k_a_acc = curvoice.okey.k_a_acc;
		key_transpose(s, curvoice.transpose);
		curvoice.ckey = clone(s)
		if (curvoice.key.k_none)
			s.k_sf = 0
		return
	case "tune":
//fixme: to do
		return
	case "user":
		set_user(param)
		return
	case "voicecolor":
		if (parse.state < 2)
			return
		if (parse.state == 2)
			goto_tune();
		s = {
			type: FORMAT,
			fmt_type: "voicecolor",
		}
		if (param != "#000000" && param != "black")
			s.color = param;
		sym_link(s)
		return
	case "voicecombine":
		val = parseInt(param)
		if (isNaN(val) || val < -1 || val > 2) {
			parse.line.error("Bad value in %%voicecombine")
			return
		}
		set_v_param("combine", val)
		return
	case "voicemap":
		set_v_param("map", param)
		return
	case "voicescale":
		val = parseFloat(param)
		if (isNaN(val) || val < 0.6 || val > 1.5) {
			parse.line.error("Bad %%voicescale value")
			return
		}
		set_v_param("scale", val)
		return
	case "vskip":
		val = get_unit(param)
		if (val < 0) {
			parse.line.error("%%vskip cannot be negative")
			return
		}
		if (parse.state >= 2) {
			s = new_block("vskip");
			s.sk = val
			return
		}
		vskip(val);
		blk_out()
		return
	case "newpage":
	case "leftmargin":
	case "rightmargin":
	case "scale":
		if (parse.state == 2)
			goto_tune()
		if (parse.state == 3) {			// tune body
			generate();
			blk_out()
		}
		if (cmd == "newpage") {
			block.newpage = true
			return
		}
		set_format(cmd, param, lock);
		posx = cfmt.leftmargin / cfmt.scale
		return
	}
	set_format(cmd, param, lock)
}

// treat the %%beginxxx / %%endxxx sequences
function do_begin_end(type,
			opt,
			text) {
	var i, j, action, s

	switch (type) {
	default:
	case "ps":
		if (wpsobj) {
			wpsobj.parse(text);
			output.push(svgbuf)
		}
		break
	case "js":
		eval(text)
		break
	case "ml":
		if (parse.state >= 2) {
			s = new_block("ml");
			s.text = text
		} else {
			svg_flush();
			user.img_out(text)
		}
		break
	case "svg":
		j = 0
		while (1) {
			i = text.indexOf('<style type="text/css">\n', j)
			if (i >= 0) {
				j = text.indexOf('</style>', i)
				if (j < 0) {
					parse.line.error("No </style> in %%beginsvg sequence")
					break
				}
				style += text.slice(i + 23, j)
				continue
			}
			i = text.indexOf('<defs>', j)
			if (i >= 0) {
				j = text.indexOf('</defs>', i)
				if (j < 0) {
					parse.line.error("No </defs> in %%beginsvg sequence")
					break
				}
				defs_add(text.slice(i + 6, j))
				continue
			}
			break
		}
		break
	case "text":
		action = get_textopt(opt);
		if (parse.state >= 2) {
			s = new_block("text");
			s.text = text;
			s.opt = get_textopt(opt)
			break
		}
		write_text(text, action)
		break
	}
}

function next_word(param, i) {
	while (param[i] && param[i] != ' ')
		i++
	while (param[i] == ' ')
		i++
	return i
}

// K: / V: common arguments
// return the clef if any
function parse_kv_args(a) {
	var	s, item,
		voice_param = curvoice

	// if no current voice, this is the first K:
	// the voice parameters will be set in goto_tune()
	if (!voice_param)
		voice_param = parse.voice_param = {}

	while (1) {
		item = a.shift()
		if (!item)
			break
		switch (item) {
		case "clef=":
			s = new_clef(a.shift())
			break
		case "octave=":
//fixme: no if inside tune
//			if (voice_param.octave) {
//				parse.line.error("Double 'octave='")
//				break
//			}
			voice_param.octave = Number(a.shift())
			break
		case "map=":
			voice_param.map = a.shift()
			break
		case "cue=":
//			if (voice_param.scale) {
//				parse.line.error("Double 'scale='/'cue='")
//				break
//			}
			voice_param.scale = a.shift() == 'on' ? 0.7 : 1
			break
		case "stafflines=":
			item = get_st_lines(a.shift())
			if (!item) {
				parse.line.error("Bad stafflines= value")
				break
			}
			voice_param.stafflines = item
			break
//		case "staffscale=":
//			voice_param.staffscale = Number(a.shift())
//			break
//		case "middle":
//			a.shift()
//			break			// middle= ignored
		default:
			switch (item.slice(0, 4)) {
			case "treb":
			case "bass":
			case "alto":
			case "teno":
			case "perc":
				s = new_clef(item)
				break
			default:
				if ("GFC".indexOf(item[0]) >= 0)
					s = new_clef(item)
				else if (item[item.length - 1] == '=')
					a.shift()
				break
			}
			break
		}
	}
	return s
}

// K: key signature
// return the key and the optional clef
function new_key(param) {
	var	i, clef, key_end, c, tmp,
//		mode,
		s = {
			type: KEY,
			ctx: parse.ctx,
			istart: parse.istart,
			iend: parse.iend,
			k_delta: 0
		}
//--fixme ne pas oublier de mettre a jour k_delta...

	if (!param.length)
		return [s, null]

	// tonic
//	mode = 0;
	i = 1
	switch (param[0]) {
	case 'A': s.k_sf = 3; break
	case 'B': s.k_sf = 5; break
	case 'C': s.k_sf = 0; break
	case 'D': s.k_sf = 2; break
	case 'E': s.k_sf = 4; break
	case 'F': s.k_sf = -1; break
	case 'G': s.k_sf = 1; break
	case 'H':				// bagpipe
		switch (param[1]) {
		case 'P':
			s.k_bagpipe = "P";
			i++
			break
		case 'p':
			s.k_bagpipe = "p";
			s.k_sf = 2;
			i++
			break
		default:
			parse.line.error("Unknown bagpipe-like key")
			break
		}
		key_end = true
		break
	case 'P':
		s.k_drum = true;
		key_end = true
		break
	case 'n':				// none
		if (param.slice(0, 4) == "none") {
			s.k_sf = 0;
			s.k_none = true;
			i = 4
		}
		// fall thru
	default:
		key_end = true
		break
	}

	if (!key_end) {
		switch (param[i]) {
		case '#': s.k_sf += 7; i++; break
		case 'b': s.k_sf -= 7; i++; break
		}
		param = param.slice(i).trim()
		switch (param.slice(0, 3).toLowerCase()) {
		case "aeo":
		case "m":
		case "min": s.k_sf -= 3;
//			mode = 5;
			break
		case "dor": s.k_sf -= 2;
//			mode = 1;
			break
		case "ion":
		case "maj": break
		case "loc": s.k_sf -= 5;
//			mode = 6;
			break
		case "lyd": s.k_sf += 1;
//			mode = 3;
			break
		case "mix": s.k_sf -= 1;
//			mode = 4;
			break
		case "phr": s.k_sf -= 4;
//			mode = 2;
			break
		default:
			if (param[0] == 'm'
			 && (param[1] == ' ' || param[1] == '\t'
			  || param[1] == '\n')) {
				s.k_sf -= 3;
//				mode = 5
				break
			}
			key_end = true
			break
		}
		if (!key_end)
			param = param.replace(/\w+\s*/, '')

		// [exp] accidentals
		if (param.slice(0, 4) == "exp ") {
			param = param.replace(/\w+\s*/, '')
			if (!param)
				parse.line.error("no accidental after 'exp'")
			s.k_exp = true
		}
		c = param[0]
		if (c == '^' || c == '_' || c == '=') {
			s.k_a_acc = []
			tmp = new scanBuf();
			tmp.buffer = param;
			tmp.index = 0;
			tmp.ctx = parse.ctx
			do {
				var note = parse_acc_pit(tmp)
				if (!note)
					return [s, null]
				var acc = {
					pit: note.pit,
					acc: note.acc
				}
				s.k_a_acc.push(acc);
				c = tmp.char()
				while (c == ' ')
					c = tmp.next_char()
			} while (c == '^' || c == '_' || c == '=');
			param = param.slice(tmp.index)
		} else if (s.k_exp && param.slice(0, 4) == "none") {
//			s.k_a_acc = [];
			s.k_sf = 0;
			param = param.replace(/\w+\s*/, '')
		}
	}

//	s.k_delta = (cgd2cde[(s.k_sf + 7) % 7] + 14 + mode) % 7
	s.k_delta = (cgd2cde[(s.k_sf + 7) % 7] + 14) % 7

	if (!param)
		return [s, null]	// key only
	return [s, parse_kv_args(info_split(param, 0))]
}

// note mapping
// %%map map_name note [print [note_head]] [param]*
function get_map(text) {
	if (!text)
		return

	var	i, note, notes, map, tmp, ns,
		a = info_split(text, 2)

	if (a.length < 3) {
		parse.line.error("Not enough parameters")
		return
	}
	ns = a[1]
	if (ns.slice(0, 7) == "octave,"
	 || ns.slice(0, 4) == "key,") {		// remove the octave part
		ns = ns.replace(/[,']+$/m, '').toLowerCase(); //'
		if (ns[0] == 'k')
			ns = ns.replace(/[_=^]+/, '')
	} else if (ns[0] == '*' || ns.slice(0, 3) == "all") {
		ns = 'all'
	} else {				// exact pitch, rebuild the note
		tmp = new scanBuf();
		tmp.buffer = a[1];
		tmp.index = 0;
		tmp.ctx = parse.ctx;
		note = parse_acc_pit(tmp)
		if (!note) {
			parse.line.error("Bad note in %%map")
			return
		}
		ns = 'abcdefg'[(note.pit + 77) % 7]
		if (note.acc)
			ns = ['__', '_', '', '^', '^^', '='][note.acc + 2] + ns
		for (i = note.pit; i >= 28; i -= 7)
			ns += "'"
		for (i = note.pit; i < 21; i += 7)
			ns += ","
	}

	if (!maps)
		maps = {}
	notes = maps[a[0]]
	if (!notes)
		maps[a[0]] = notes = {}
	map = notes[ns]
	if (!map)
		notes[ns] = map = []

	/* try the optional 'print' and 'heads' parameters */
	if (!a[2])
		return
	i = 2
	if (a[2].indexOf('=') < 0) {
		if (a[2][0] != '*') {
			tmp = new scanBuf();		// print
			tmp.buffer = a[2];
			tmp.index = 0;
			tmp.ctx = parse.ctx;
			map[1] = parse_acc_pit(tmp)
		}
		if (!a[3])
			return
		i++
		if (a[3].indexOf('=') < 0) {
			map[0] = a[3].split(',');
			i++
		}
	}

	for (; i < a.length; i++) {
		switch (a[i]) {
		case "heads=":
			map[0] = a[++i].split(',')
			break
		case "print=":
			tmp = new scanBuf();
			tmp.buffer = a[++i];
			tmp.index = 0;
			tmp.ctx = parse.ctx;
			map[1] = parse_acc_pit(tmp)
			break
//		case "transpose=":
//			switch (a[++i][0]) {
//			case "n":
//				map[2] = false
//				break
//			case "y":
//				map[2] = true
//				break
//			}
//			break
		case "color=":
			map[2] = a[++i]
			break
		}
	}
}

// M: meter
function new_meter(text) {
	var	s = {
			type: METER,
			ctx: parse.ctx,
			istart: parse.istart,
			iend: parse.iend,
			a_meter: []
		},
		meter = {},
		val, v,
		m1 = 0, m2,
		i = 0, j,
		wmeasure,
		p = text,
		in_parenth

	if (p.indexOf("none") == 0) {
		i = 4;				/* no meter */
		wmeasure = 1;	// simplify measure numbering and MREST conversion
	} else {
		wmeasure = 0
		while (i < text.length) {
			if (p[i] == '=')
				break
			switch (p[i]) {
			case 'C':
				meter.top = p[i++]
				if (p[i] == '|')
					meter.top += p[i++];
				m1 = 4;
				m2 = 4;
				break
			case 'c':
			case 'o':
				if (p[i] == 'c')
					m1 = 4
				else
					m1 = 3;
				m2 = 4;
				meter.top = p[i++]
				if (p[i] == '.')
					meter.top += p[i++]
				break
			case '(':
				if (p[i + 1] == '(') {	/* "M:5/4 ((2+3)/4)" */
					in_parenth = true;
					meter.top = p[i++];
					s.a_meter.push(meter);
					meter = {}
				}
				j = i + 1
				while (j < text.length) {
					if (p[j] == ')' || p[j] == '/')
						break
					j++
				}
				if (p[j] == ')' && p[j + 1] == '/') {	/* "M:5/4 (2+3)/4" */
					i++		/* remove the parenthesis */
					continue
				}			/* "M:5 (2+3)" */
				/* fall thru */
			case ')':
				in_parenth = p[i] == '(';
				meter.top = p[i++];
				s.a_meter.push(meter);
				meter = {}
				continue
			default:
				if (p[i] <= '0' || p[i] > '9') {
					parse.line.error("Bad char '" + p[i] + "' in M:")
					return
				}
				m2 = 2;			/* default when no bottom value */
				meter.top = p[i++]
				for (;;) {
					while (p[i] >= '0' && p[i] <= '9')
						meter.top += p[i++]
					if (p[i] == ')') {
						if (p[i + 1] != '/')
							break
						i++
					}
					if (p[i] == '/') {
						i++;
						if (p[i] <= '0' || p[i] > '9') {
							parse.line.error("Bad char '" + p[i] + "' in M:")
							return
						}
						meter.bot = p[i++]
						while (p[i] >= '0' && p[i] <= '9')
							meter.bot += p[i++]
						break
					}
					if (p[i] != ' ' && p[i] != '+')
						break
					if (i >= text.length
					 || p[i + 1] == '(')	/* "M:5 (2/4+3/4)" */
						break
					meter.top += p[i++]
				}
				m1 = parseInt(meter.top)
				break
			}
			if (!in_parenth) {
				if (meter.bot)
					m2 = parseInt(meter.bot);
				wmeasure += m1 * BASE_LEN / m2
			}
			s.a_meter.push(meter);
			meter = {}
			while (p[i] == ' ')
				i++
			if (p[i] == '+') {
				meter.top = p[i++];
				s.a_meter.push(meter);
				meter = {}
			}
		}
	}
	if (p[i] == '=') {
		val = p.substring(++i)
		if (!val.match(/^(\d|\/)+$/)) {
			parse.line.error("Bad duration '" + val + "' in M:")
			return
		}
		wmeasure = BASE_LEN * eval(val)
	}
	s.wmeasure = wmeasure

	if (parse.state != 3) {
		info.M = text;
		glovar.meter = s
		if (parse.state >= 1) {

			/* in the header, change the unit note length */
			if (!glovar.ulen) {
				if (!wmeasure
				 || wmeasure >= BASE_LEN * 3 / 4)
					glovar.ulen = BASE_LEN / 8
				else
					glovar.ulen = BASE_LEN / 16
			}
			for (v = 0; v < voice_tb.length; v++) {
				voice_tb[v].meter = s;
				voice_tb[v].wmeasure = wmeasure
			}
		}
	} else {
		curvoice.wmeasure = wmeasure
		if (is_voice_sig()) {
			curvoice.meter = s;
			reset_gen()
		} else {
			sym_link(s)
		}
	}
}

/* Q: tempo */
function new_tempo(text) {
	if (cfmt.writefields.indexOf('Q') < 0)
		return

	var	i = 0, j, c, nd, tmp,
		s = {
			type: TEMPO,
			ctx: parse.ctx,
			istart: parse.istrt,
			iend: parse.iend
		}

	/* string before */
	if (text[0] == '"') {
		i = text.indexOf('"', 1)
		if (i < 0) {
			parse.line.error("Unterminated string in Q:")
			return
		}
		s.tempo_str1 = text.slice(1, i);
		i++
		while (text[i] == ' ')
			i++
	}

	/* beat */
	tmp = new scanBuf();
	tmp.buffer = text;
	tmp.index = i
	while (1) {
		c = tmp.char()
		if (c == undefined || c <= '0' || c > '9')
			break
		nd = parse_dur(tmp)
		if (!s.tempo_notes)
			s.tempo_notes = []
		s.tempo_notes.push(BASE_LEN * nd[0] / nd[1])
		while (1) {
			c = tmp.char()
			if (c != ' ')
				break
			tmp.advance()
		}
	}

	/* tempo value ('Q:beat=value') */
	if (c == '=') {
		c = tmp.next_char()
		while (c == ' ')
			c = tmp.next_char();
		s.tempo_value = ""
		while (c && c != '"') {
			s.tempo_value += c;
			c = tmp.next_char()
		}
		s.tempo_value = s.tempo_value.replace(/\s+$/,'')	// trimRight
	}

	/* string after */
	if (c == '"') {
		tmp.advance();
		i = text.indexOf('"', tmp.index + 1)
		if (i < 0) {
			parse.line.error("Unterminated string in Q:")
			return
		}
		s.tempo_str2 = text.slice(tmp.index, i)
	}

	if (parse.state != 3) {
		if (parse.state == 1) {			// tune header
			info.Q = text;
			glovar.tempo = s;
			return
		}
		goto_tune()				// tune header after K:
	}
	if (curvoice.v != par_sy.top_voice)
		return				/* tempo only for first voice */
//--fixme				/* keep last Q: */
	sym_link(s)
}

// treat the information fields which may embedded
// return the info field type if possible continuation
function do_info(info_type, text) {
	switch (info_type) {

	// info fields in any state
	case 'I':
		do_pscom(text)
		break
	case 'L':
		if (text.match(/^\d*\/\d*$/)) {
			text = BASE_LEN * eval(text)
		} else if (text == "auto") {
			text = -1
		} else {
			parse.line.error("Bad L: value")
			break
		}
		if (parse.state == 2)
			goto_tune()
		if (parse.state != 3)
			glovar.ulen = Number(text)
		else
			curvoice.ulen = Number(text)
		break
	case 'M':
		new_meter(text)
		break
	case 'U':
		set_user(text)
		break

	// fields in tune header or tune body
	case 'P':
		if (parse.state == 0)
			break
		if (parse.state == 1) {
			info.P = text
			break
		}
		if (parse.state == 2)
			goto_tune()
		if (cfmt.writefields.indexOf('P') < 0)
			break
		var s = {
			type: PART,
			ctx: parse.ctx,
			istart: parse.istart,
			iend: parse.iend,
			text: text
		}

		/*
		 * If not in the main voice, then,
		 * if the voices are synchronized and no P: yet in the main voice,
		 * the misplaced P: goes into the main voice.
		 */ 
		var p_voice = voice_tb[par_sy.top_voice]
		if (curvoice.v != p_voice.v) {
			if (curvoice.time != p_voice.time)
				break
			if (p_voice.last_sym && p_voice.last_sym.type == PART)
				break		// already a P:
			var curvoice_sav = curvoice;
			curvoice = p_voice;
			sym_link(s);
			curvoice = curvoice_sav
		} else {
			sym_link(s)
		}
		break
	case 'Q':
		if (parse.state == 0)
			break
		new_tempo(text)
		break
	case 'V':
		if (parse.state == 0)
			break
		if (parse.state == 2)
			goto_tune();
		get_voice(text)
		if (!curvoice.last_sym
		 && parse.voice_opts)
			voice_filter()
		break

	// key signature and end of tune header
	case 'K':
		get_key_clef(new_key(text))
		break

	// note mapping
	case 'k':
		parse.line.error("k: is obsolete - use %%map instead")
		get_map(text)
		break

	// info in any state
	case 'N':
	case 'R':
		if (!info[info_type])
			info[info_type] = text
		else
			info[info_type] += '\n' + text
		break
	default:
		parse.line.error("'" + info_type + ":' line ignored")
		break
	}
}

// music line parsing functions

/* -- adjust the duration and time of symbols in a measure when L:auto -- */
function adjust_dur(s) {
	var s2, time, auto_time, i, res;

	/* search the start of the measure */
	s2 = curvoice.last_sym
	if (!s2)
		return;

	/* the bar time is correct if there are multi-rests */
	if (s2.type == MREST
	 || s2.type == BAR)			/* in second voice */
		return
	while (s2.type != BAR && s2.prev)
		s2 = s2.prev;
	time = s2.time;
	auto_time = curvoice.time - time

	/* remove the invisible rest at start of tune */
	if (time == 0) {
		while (s2 && !s2.dur)
			s2 = s2.next
		if (s2 && s2.type == REST
		 && s2.invisible) {
			time += s2.dur * curvoice.wmeasure / auto_time
			if (s2.prev)
				s2.prev.next = s2.next
			else
				curvoice.sym = s2.next
			if (s2.next)
				s2.next.prev = s2.prev;
			s2 = s2.next
		}
	}
	if (curvoice.wmeasure == auto_time)
		return				/* already good duration */

	for ( ; s2; s2 = s2.next) {
		s2.time = time
		if (!s2.dur || s2.grace)
			continue
		s2.dur = s2.dur * curvoice.wmeasure / auto_time;
		s2.dur_orig = s2.dur_orig * curvoice.wmeasure / auto_time;
		time += s2.dur
		if (s2.type != NOTE && s2.type != REST)
			continue
		for (i = 0; i <= s2.nhd; i++)
			s2.notes[i].dur = s2.notes[i].dur
					 * curvoice.wmeasure / auto_time;
		res = identify_note(s2, s2.dur_orig);
		s2.head = res[0];
		s2.dots = res[1];
		s2.nflags = res[2]
		if (s2.nflags <= -2)
			s2.stemless = true
		else
			delete s2.stemless
	}
	curvoice.time = s.time = time
}

/* -- parse a bar -- */
function new_bar() {
	var	line = parse.line,
		s = {
			type: BAR,
			ctx: parse.ctx,
//temporary
//			istart: parse.istart,
//			iend: parse.iend,
			multi: 0		// needed for decorations
		},
		s2, c, bar_type;
//temporary
	s.istart = parse.bol + line.index

	if (vover && vover.bar)			// end of voice overlay
		get_vover('|')
	if (glovar.new_nbar) {			// %%setbarnb
		s.bar_num = glovar.new_nbar
		delete glovar.new_nbar
	}
	bar_type = line.char()
	while (1) {
		c = line.next_char()
		switch (c) {
		case '|':
		case '[':
		case ']':
		case ':':
			bar_type += c
			continue
		}
		break
	}

	/* if the last element is '[', it may start
	 * a chord, an embedded header or an other bar */
	if (line.buffer[line.index - 1] == '[' && bar_type.length > 1
	 && c != ' ') {
		bar_type = bar_type.slice(0, -1);
		line.index--;
		c = '['
	}
//temporary
	s.iend = parse.bol + line.index

/*	curvoice.last_note = NULL; */

	// set the guitar chord and the decorations
	if (gchord) {
		gch_build(s);
		gchord = null
	}
	if (a_dcn) {
		deco_cnv(a_dcn, s);
		a_dcn = null
	}

	// check if repeat bar
	if (c > '0' && c <= '9') {
		s.text = c
		while (1) {
			c = line.next_char()
			if ("0123456789,.-".indexOf(c) < 0)
				break
			s.text += c
		}
	} else if (c == '"' && bar_type == "[") {
//line.buffer[line.index - 1] == '[') {
		s.text = ""
		while (1) {
			c = line.next_char()
			if (!c) {
				line.error("No end of repeat string")
				return
			}
			if (c == '"') {
				line.advance()
				break
			}
			if (c == '\\')
				c = line.next_char();
			s.text += c
		}
		s.text = cnv_escape(s.text)
	}

	if (s.text
	 && curvoice.norepbra
	 && !curvoice.second)
		s.norepbra = true
	if (curvoice.ulen < 0)
		adjust_dur(s)

	s2 = curvoice.last_sym
	if (s2 && s2.type == BAR) {

		/* remove the invisible repeat bars when no shift is needed */
		if (bar_type == "["
//		 && (curvoice.v == par_sy.top_voice
		 && !s2.text && !s2.a_gch
		 && (curvoice.st == 0
		  || (par_sy.staves[curvoice.st - 1].flags & STOP_BAR)
		  || s.norepbra)) {
			if (s.text)
				s2.text = s.text
			if (s.a_gch)
				s2.a_gch = s.a_gch
			if (s.norepbra)
				s2.norepbra = s.norepbra
//--fixme: pb when on next line and empty staff above
			return
		}

		/* merge back-to-back repeat bars */
		if (bar_type == "|:"
		 && !s.text
		 && s2.bar_type == ":|") {
			s2.bar_type = "::"
			return
		}
	}

	/* set some flags */
	switch (bar_type) {
	case "[":
	case "[]":
	case "[|]":
		s.invisible = true
		break
	case ":|:":
	case ":||:":
		bar_type = "::"
		break
	}
	s.bar_type = bar_type;
	if (!curvoice.lyric_restart)
		curvoice.lyric_restart = s

	/* the bar must appear before a key signature */
//	s2 = curvoice.last_sym
	if (s2 && s2.type == KEY) {
		curvoice.last_sym = s2.prev
		if (!curvoice.last_sym)
			curvoice.sym = null;
		sym_link(s)
		s.next = s2;
		s2.prev = s;
		curvoice.last_sym = s2
	} else {
		sym_link(s)
	}
	s.st = curvoice.st			/* original staff */

	/* if repeat bar and shift, add a repeat bar */
	if (s.text
	 && !curvoice.norepbra
	 && curvoice.st > 0
	 && !(par_sy.staves[curvoice.st - 1].flags & STOP_BAR)) {
// ko: always shift!
//	if (s.text) {
		s2 = {
			type: BAR,
			ctx: s.ctx,
			istart: s.istart,
			iend: s.iend,
			bar_type: "[",
			multi: 0,
			invisible: true,
			text: s.text
		}
		sym_link(s2);
		s2.st = curvoice.st
		delete s.text
	}
}

/* -- parse %%staves / %%score -- */
function parse_staves(param) {
	var	v, p_flags,
		a_flags = [],
		err = false,
		flags = 0,
		brace = 0,
		bracket = 0,
		parenth = 0,
		flags_st = 0,
		p = param,
		i = 0

	/* parse the voices */
	while (i < p.length) {
		switch (p[i]) {
		case ' ':
		case '\t':
			break
		case '[':
			if (parenth || brace + bracket >= 2) {
				parse.line.error("Misplaced '[' in %%staves");
				err = true
				break
			}
			if (brace + bracket == 0)
				flags |= OPEN_BRACKET
			else
				flags |= OPEN_BRACKET2;
			bracket++;
			flags_st <<= 8;
			flags_st |= OPEN_BRACKET
			break
		case '{':
			if (parenth || brace || bracket >= 2) {
				parse.line.error("Misplaced '{' in %%staves");
				err = true
				break
			}
			if (bracket == 0)
				flags |= OPEN_BRACE
			else
				flags |= OPEN_BRACE2;
			brace++;
			flags_st <<= 8;
			flags_st |= OPEN_BRACE
			break
		case '(':
			if (parenth) {
				parse.line.error("Misplaced '(' in %%staves");
				err = true
				break
			}
			flags |= OPEN_PARENTH;
			parenth++;
			flags_st <<= 8;
			flags_st |= OPEN_PARENTH
			break
		case '*':
			if (brace && !parenth && !(flags & (OPEN_BRACE | OPEN_BRACE2)))
				flags |= FL_VOICE
			break
		case '+':
			flags |= MASTER_VOICE
			break
		default:
			if (!p[i].match(/\w/)) {
				parse.line.error("Bad voice ID in %%staves");
				err = true
				break
			}

			/* get / create the voice in the voice table */
			var voice_id = ""
			while (i < p.length) {
				if (" \t()[]{}|*".indexOf(p[i]) >= 0)
					break
				voice_id += p[i++]
			}
			p_flags = {
				v: new_voice(voice_id).v
			}
			for ( ; i < p.length; i++) {
				switch (p[i]) {
				case ' ':
				case '\t':
					continue
				case ']':
					if (!(flags_st & OPEN_BRACKET)) {
						parse.line.error("Misplaced ']' in %%staves");
						err = true
						break
					}
					bracket--
					if (brace + bracket == 0)
						flags |= CLOSE_BRACKET
					else
						flags |= CLOSE_BRACKET2;
					flags_st >>= 8
					continue
				case '}':
					if (!(flags_st & OPEN_BRACE)) {
						parse.line.error("Misplaced '}' in %%staves");
						err = true
						break
					}
					brace--
					if (bracket == 0)
						flags |= CLOSE_BRACE
					else
						flags |= CLOSE_BRACE2;
					flags &= ~FL_VOICE;
					flags_st >>= 8
					continue
				case ')':
					if (!(flags_st & OPEN_PARENTH)) {
						parse.line.error("Misplaced ')' in %%staves");
						err = true
						break
					}
					parenth--;
					flags |= CLOSE_PARENTH;
					flags_st >>= 8
					continue
				case '|':
					flags |= STOP_BAR
					continue
				}
				break
			}
			p_flags.flags = flags;
			a_flags.push(p_flags);
			flags = 0
//			if (i >= p.length)
//				break
			continue
		}
		i++
	}
	if (flags_st != 0) {
		parse.line.error("'}', ')' or ']' missing in %%staves");
		err = true
	}
	if (err)
		a_flags = null
	return a_flags
}

// split an info string
function info_split(text,
		    start) {		// handle 'key=' after 'start' items
	var	a = [],
		item = "",
		i, j,
		n = text.length;
	for (i = 0 ; i < n; i++) {
		switch (text[i]) {
		case '=':
			if (!item) {
				item = '='
				break
			}
			item += '='
			if (a.length < start)
				break
			a.push(item);
			item = ""
			break
		case ' ':
		case '\t':
			if (!item)
				break
			a.push(item);
			item = ""
			break
		case '"':
			if (item) {
				a.push(item);
				item = ""
			}
			j = ++i
			while (i < n) {
				if (text[i] == '"')
					break
				if (text[i] == '\\')
					i++;
				i++
			}
			if (text[i] != '"') {
				parse.line.error("Unterminated string")
				break
			}
			a.push(text.slice(j, i))
			break
		case '\\':
			item += text[i++]
			// fall thru
		default:
			item += text[i]
			break
		}
	}
	if (item)
		a.push(item)
	return a
}

/* -- parse the voice parameters (V:) -- */
/* return the clef if defined here */
function parse_voice(param) {
	var	v,
		a = info_split(param, 1),
		item = a.shift();

	// get/create the voice from its ID and switch to it
	curvoice = new_voice(item)
	if (curvoice.time == undefined) {	// new voice
		curvoice.time = 0
		if (parse.state == 3		// tune body
		 && staves_found < 0) {
			v = curvoice.v;
			curvoice.st = curvoice.cst = ++nstaff;
			par_sy.nstaff = nstaff;
			par_sy.voices[v].st = nstaff;
			par_sy.voices[v].range = v;
			par_sy.staves[nstaff] = {
				stafflines: "|||||",
				staffscale: 1
			}
		}
	}
	
	for (var i = 0; i < a.length; i++) {
		switch (a[i]) {
		case "name=":
		case "nm=":
			curvoice.nm = a[++i];
			curvoice.new_name = true
			break
		case "subname=":
		case "sname=":
		case "snm=":
			curvoice.snm = a[++i]
			break
//		case "merge":
//			break
		case "stem=":
			set_pos("stem", a[++i])
			break
		default:
			if (a[i][a[i].length - 1] == '=')
				i++
			break
		}
	}
	return parse_kv_args(a)
}

/* -- get head type, dots, flags of note/rest for a duration -- */
function identify_note(s, dur) {
	var head, dots, flags
	if (dur % 12 != 0)
		parse.line.error("Invalid note duration " + dur);
	dur /= 12			/* see BASE_LEN for values */
//	dur = Math.round(dur / 12)
	if (dur == 0)
		parse.line.error("Note too short")
	for (flags = 5; dur != 0; dur >>= 1, flags--) {
		if (dur & 1)
			break
	}
	dur >>= 1
	switch (dur) {
	case 0: dots = 0; break
	case 1: dots = 1; break
	case 3: dots = 2; break
	case 7: dots = 3; break
	default:
		dots = 3
		break
	}
	flags -= dots
//--fixme: is 'head' useful?
	if (flags >= 0) {
		head = "full"
	} else switch (flags) {
	default:
		parse.line.error("Note too long");
		flags = -4
		/* fall thru */
	case -4:
		head = "square"
		break
	case -3:
		head = cfmt.squarebreve ? "square" : "oval"
		break
	case -2:
		head = "oval"
		break
	case -1:
		head = "empty"
		break
	}
	return [head, dots, flags]
}

// parse a duration and return [numerator, denominator]
// 'line' is not always 'parse.line'
function parse_dur(line) {
	var num, den;

	c = line.char()
	if (c > '0' && c <= '9') {
		num = line.get_int();
		c = line.char()
	} else {
		num = 1
	}
	if (c == '/') {
		den = 2;
		c = line.next_char()
		if (c == '/') {
			do {
				den *= 2;
				c = line.next_char()
			} while (c == '/')
		} else if (c > '0' && c <= '9') {
			den = line.get_int()
		}
	} else {
		den = 1
	}
	return [num, den]
}

// parse the note accidental and pitch
function parse_acc_pit(line) {
	var	acc, micro_n, micro_d, pit,
		c = line.char()

	// optional accidental
	switch (c) {
	case '^':
		c = line.next_char()
		if (c == '^') {
			acc = 2;
			c = line.next_char()
		} else {
			acc = 1
		}
		break
	case '=':
		acc = 3;
		c = line.next_char()
		break
	case '_':
		c = line.next_char()
		if (c == '_') {
			acc = -2;
			c = line.next_char()
		} else {
			acc = -1
		}
		break
	}

	/* look for microtone value */
	if (acc && (c >= '1' && c <= '9')
	 || c == '/') {				// compatibility
		nd = parse_dur(line);
		micro_n = nd[0];
		micro_d = nd[1]
		if (micro_d == 1)
			micro_d = curvoice.microscale
		else
			micro_d *= 2;	// 1/2 tone fraction -> tone fraction
		c = line.char()
	}

	/* get the pitch */
	pit = "CDEFGABcdefgab".indexOf(c) + 16;
	c = line.next_char()
	if (pit < 16) {
		line.error("'" + line.buffer[line.index - 1] + "' is not a note")
		return undefined
	}

	// octave
	while (c == "'") {
		pit += 7;
		c = line.next_char()
	}
	while (c == ',') {
		pit -= 7;
		c = line.next_char()
	}
	note = {
		pit: pit,
		apit: pit,
		shhd: 0,
		shac: 0,
		ti1: 0
	}
	if (acc) {
		note.acc = acc
		if (micro_n) {
			note.micro_n = micro_n;
			note.micro_d = micro_d
		}
	}
	return note
}

/* set the mapping of a note */
function set_map(note) {
	var	bn, an, nn, i,
		map = maps[curvoice.map]	// never null

	bn = 'abcdefg'[(note.pit + 77) % 7]
	if (note.acc)
		an = ['__', '_', '', '^', '^^', '='][note.acc + 2]
	else
		an = ''
//fixme: treat microtone
	nn = an + bn
	for (i = note.pit; i >= 28; i -= 7)
		nn += "'"
	for (i = note.pit; i < 21; i += 7)
		nn += ","

	// direct mapping
	if (map[nn]) {
		note.map = map[nn]
		if (note.map[1]) {
			note.apit = note.pit = note.map[1].pit;	// print
			note.acc = note.map[1].acc
		}
	} else {

		// octave
		nn = 'octave,' + an + bn
		if (!map[nn]) {

			// 'key,'
			nn = 'key,' + an + 'abcdefg'[(note.pit + 77
							- curvoice.ckey.k_delta) % 7]
			if (!map[nn]) {

				// 'all,'
				nn = 'all'
				if (!map[nn])
					return
			}
		}
		note.map = map[nn]
	}
}

/* -- parse note or rest with pitch and length -- */
// 'line' is not always 'parse.line'
function parse_basic_note(line, ulen) {
	var	nd, c,
		note = parse_acc_pit(line)

	if (!note)
		return null

	// duration
	if (line.char() == '0') {		// compatibility
		parse.stemless = true;
		line.advance()
	}
	nd = parse_dur(line);
	note.dur = ulen * nd[0] / nd[1]
	return note
}

function parse_vpos() {
	var	c,
		line = parse.line,
		ti1 = 0

	if (line.buffer[line.index - 1] == '.' && !a_dcn)
		ti1 = SL_DOTTED
	c = line.next_char()
	if (c == "'") {
		ti1 += SL_ABOVE;
		line.index++
	} else if (c == ",") {
		ti1 += SL_BELOW;
		line.index++
	} else {
		ti1 += SL_AUTO
	}
	return ti1
}

/* sort the notes of the chord by pitch (lowest first) */
function sort_pitch(s) {
	function pitch_compare(n1, n2) {
		return n1.pit - n2.pit
	}

	s.notes = s.notes.sort(pitch_compare)
}
function new_note(grace, tuplet_fact) {
	var	note, s, in_chord, c, dcn,
		i, n, s2, nd, res, num, dur,
		sl1 = 0,
		line = parse.line,
		a_dcn_sav = a_dcn;	// save parsed decoration names

	a_dcn = undefined;
	parse.stemless = false;
	s = {
		type: NOTE,
		ctx: parse.ctx,
//temporary
//		istart: parse.istart,
		stem: 0,
		multi: 0,
		nhd: 0,
		xmx: 0
	}
//temporary
	s.istart = parse.bol + line.index

	if (grace) {
		s.grace = true
	} else {
		if (gchord) {
			gch_build(s);
			gchord = undefined
		}
	}
	c = line.char()
	switch (c) {
	case 'X':
		s.invisible = true
	case 'Z':
		s.type = MREST;
		c = line.next_char()
		if (c > '0' && c <= '9')
			s.nmes = line.get_int()
		else
			s.nmes = 1;
		s.dur = curvoice.wmeasure * s.nmes

		// ignore if in second voice
		if (curvoice.second) {
			curvoice.time += s.dur
//			return s
			return null
		}
		break
	case 'y':
		s.type = SPACE;
		s.invisible = true;
		c = line.next_char()
		if (c >= '0' && c <= '9')
			s.width = line.get_int()
		else
			s.width = 10
		break
	case 'x':
		s.invisible = true
	case 'z':
		s.type = REST;
		line.advance()
		nd = parse_dur(line);
		s.dur = s.dur_orig = ((curvoice.ulen < 0) ? BASE_LEN / 4 :
					curvoice.ulen) * nd[0] / nd[1];
		s.notes = [{
			pit: 18,
			dur: s.dur
		}]
		break
	case '[':			// chord
		in_chord = true;
		c = line.next_char()
		// fall thru
	default:			// accidental, chord, note
		if (curvoice.microscale)
			s.microscale = curvoice.microscale;
		s.notes = []

		// loop on the chord
		while (1) {

			// when in chord, get the slurs and decorations
			if (in_chord) {
				while (1) {
					if (!c)
						break
					i = c.charCodeAt(0);
					if (i >= 128) {
						line.error(not_ascii)
						return null
					}
					type = char_tb[i]
					switch (type[0]) {
					case '(':
						sl1 <<= 4;
						sl1 += parse_vpos();
						c = line.char()
						continue
					case '!':
						if (!a_dcn)
							a_dcn = []
						if (type.length > 1) {
							a_dcn.push(type.slice(1, -1))
						} else {
							dcn = ""
							while (1) {
								c = line.next_char()
								if (c == '!')
									break
								dcn += c
							}
							a_dcn.push(dcn)
						}
						c = line.next_char()
						continue
					}
					break
				}
			}
			note = parse_basic_note(line,
					(s.grace || curvoice.ulen < 0) ?
						BASE_LEN / 4 : curvoice.ulen)
			if (!note)
				return null

			// transpose
			if (curvoice.octave)
				note.apit = note.pit += curvoice.octave * 7;
			if (sl1) {
				note.sl1 = sl1
				if (s.sl1)
					s.sl1++
				else
					s.sl1 = 1;
				sl1 = 0
			}
			if (a_dcn) {
				note.a_dcn = a_dcn;
				a_dcn = null
			}
			s.notes.push(note)
			if (!in_chord)
				break

			// in chord: get the ending slurs and the ties
			c = line.char()
			while (1) {
				switch (c) {
				case ')':
					if (note.sl2)
						note.sl2++
					else
						note.sl2 = 1
					if (s.sl2)
						s.sl2++
					else
						s.sl2 = 1;
					c = line.next_char()
					continue
				case '-':
					note.ti1 = parse_vpos();
					s.ti1 = true;
					c = line.char()
					continue
				case '.':
					c = line.next_char()
					if (c != '-') {
						line.error("Misplaced dot")
						break
					}
					continue
				}
				break
			}
			if (c == ']') {
				line.advance()

				// adjust the chord duration
				nd = parse_dur(line);
				s.nhd = s.notes.length - 1
				for (i = 0; i <= s.nhd ; i++) {
					note = s.notes[i];
					note.dur = note.dur * nd[0] / nd[1]
				}
				break
			}
		}

		// the duration of the chord is the duration of the 1st note
		s.dur = s.dur_orig = s.notes[0].dur

	}
	if (s.grace && s.type != NOTE) {
		line.error("Not a note in grace note sequence")
		return null
	}

	if (s.notes) {				// if note or rest
		if (s.type == NOTE && curvoice.transpose)
			note_transpose(s)

		if (!s.grace) {
			switch (curvoice.pos.ste) {
			case SL_ABOVE: s.stem = 1; break
			case SL_BELOW: s.stem = -1; break
			}

			s.combine = curvoice.combine

			// adjust the symbol duration
			if (tuplet_fact)
				s.dur *= tuplet_fact;
			num = curvoice.brk_rhythm
			if (num) {
				s2 = curvoice.last_note
				if (num > 0) {
					n = num * 2 - 1;
					s.dur = s.dur * n / num;
					s.dur_orig = s.dur_orig * n / num
					for (i = 0; i <= s.nhd; i++)
						s.notes[i].dur =
							s.notes[i].dur * n / num;
					s2.dur /= num;
					s2.dur_orig /= num
					for (i = 0; i <= s2.nhd; i++)
						s2.notes[i].dur /= num
				} else {
					num = -num;
					n = num * 2 - 1;
					s.dur /= num;
					s.dur_orig /= num
					for (i = 0; i <= s.nhd; i++)
						s.notes[i].dur /= num;
					s2.dur = s2.dur * n / num;
					s2.dur_orig = s2.dur_orig * n / num
					for (i = 0; i <= s2.nhd; i++)
						s2.notes[i].dur =
							s2.notes[i].dur * n / num
				}
				curvoice.time = s2.time + s2.dur;
				res = identify_note(s2, s2.dur_orig);
				s2.head = res[0];
				s2.dots = res[1];
				s2.nflags = res[2];
				curvoice.brk_rhythm = 0
				if (s2.nflags <= -2)
					s2.stemless = true
				else
					delete s2.stemless
			}
		} else {		/* grace note - adjust its duration */
			var div = curvoice.key.k_bagpipe ? 8 : 4
			for (i = 0; i <= s.nhd; i++)
				s.notes[i].dur /= div;
			s.dur /= div;
			s.dur_orig /= div
			switch (curvoice.pos.gst) {
			case SL_ABOVE: s.stem = 1; break
			case SL_BELOW: s.stem = -1; break
			case SL_HIDDEN:	s.stem = 2; break	/* opposite */
			}
		}

		// set the symbol parameters
		if (s.type == NOTE) {
			res = identify_note(s, s.dur_orig);
			s.head = res[0];
			s.dots = res[1];
			s.nflags = res[2]
			if (s.xstem)
				s.nflags = 0
			if (s.nflags <= -2)
				s.stemless = true
			if (curvoice.map
			 && maps[curvoice.map]) {
				for (i = 0; i <= s.nhd; i++)
					set_map(s.notes[i])
			}
//			if (s.nhd != 0)
//				sort_pitch(s)
		} else {					// rest

			/* change the figure of whole measure rests */
//--fixme: does not work in sample.abc because broken rhythm on measure bar
			dur = s.dur_orig
			if (dur == curvoice.wmeasure) {
				if (dur < BASE_LEN * 2)
					dur = BASE_LEN
				else if (dur < BASE_LEN * 4)
					dur = BASE_LEN * 2
				else
					dur = BASE_LEN * 4
			}
			res = identify_note(s, dur);
			s.head = res[0];
			s.dots = res[1];
			s.nflags = res[2]
		}
		curvoice.last_note = s
	}
	sym_link(s)

	if (cfmt.shiftunison)
		s.shiftunison = cfmt.shiftunison
	if (!curvoice.lyric_restart)
		curvoice.lyric_restart = s

//	if (curvoice.clef.clef_type == 'p')
//		s.perc = true

	if (a_dcn_sav)
		deco_cnv(a_dcn_sav, s, s.prev)
	if (parse.stemless)
		s.stemless = true
//temporary
//	s.iend = parse.iend
	s.iend = parse.bol + line.index
	return s
}

// characters in the music line (ASCII only)
var nil = "0"
var char_tb = [
	nil, nil, nil, nil,		/* 00 - .. */
	nil, nil, nil, nil,
	nil, " ", "\n", nil,		/* . \t \n . */
	nil, nil, nil, nil,
	nil, nil, nil, nil,
	nil, nil, nil, nil,
	nil, nil, nil, nil,
	nil, nil, nil, nil,		/* .. - 1f */
	" ", "!", '"', nil,		/* (sp) ! " # */
	"\n", nil, "&", nil,		/* $ % & ' */
	"(", ")", nil, nil,		/* ( ) * + */
	nil, "-", "!dot!", nil,		/* , - . / */
	nil, nil, nil, nil, 		/* 0 1 2 3 */
	nil, nil, nil, nil, 		/* 4 5 6 7 */
	nil, nil, "|", nil,		/* 8 9 : ; */
	"<", "n", "<", nil,		/* < = > ? */
	nil, "n", "n", "n",		/* @ A B C */
	"n", "n", "n", "n", 		/* D E F G */
	"!fermata!", "d", "d", "d",	/* H I J K */
	"!emphasis!", "!lowermordent!",
		"d", "!coda!",		/* L M N O */
	"!uppermordent!", "d",
		"d", "!segno!",		/* P Q R S */
	"!trill!", "d", "d", "d",	/* T U V W */
	"n", "d", "n", "[",		/* X Y Z [ */
	"\\","|", "n", "n",		/* \ ] ^ _ */
	"i", "n", "n", "n",	 	/* ` a b c */
	"n", "n", "n", "n",	 	/* d e f g */
	"d", "d", "d", "d",		/* h i j k */
	"d", "d", "d", "d",		/* l m n o */
	"d", "d", "d", "d",		/* p q r s */
	"d", "!upbow!",
		"!downbow!", "d",	/* t u v w */
	"n", "n", "n", "{",		/* x y z { */
	"|", "}", "!roll!", nil,	/* | } ~ (del) */
]

function parse_music_line() {
	var	slur_start = 0,
		s, grace, sappo, dcn, i, c, idx, type,
		last_note_sav, a_dcn_sav,
		s_tuplet, s_tuplet_up,
		tuplet_fact = 1, tuplet_fact_up
//temporary
 var line = parse.line;
 line.buffer = parse.file.slice(parse.bol, parse.eol);
 line.index = 0;

	while (1) {
		c = line.char()
		if (!c || c == '%')
			break

		// special case for '.' (dot)
		if (c == '.') {
			switch (line.buffer[line.index + 1]) {
			case '(':
			case '-':
			case '|':
				c = line.next_char()
				break
			}
		}

		idx = c.charCodeAt(0);
		if (idx >= 128) {
			line.error(not_ascii);
			line.advance()
			continue;
		}
		type = char_tb[idx]
		switch (type[0]) {
		case ' ':			// beam break
			if (curvoice.last_note)
				curvoice.last_note.beam_end = true
			break
		case '\n':			// line break
			if (cfmt.barsperstaff)
				break
			if (par_sy.voices[curvoice.v].range == 0
			 && curvoice.last_sym)
				curvoice.last_sym.eoln = true
			break
		case '&':			// voice overlay
			c = line.next_char()
			if (c == ')') {
				get_vover(')')
				break
			}
			get_vover('&')
			continue
		case '(':			// slur start - tuplet - vover
			c = line.next_char()
			if (c > '0' && c <= '9') {	// tuplet
				var	pplet = line.get_int(),
					qplet = [0, 1, 3, 2, 3, 0, 2, 0, 3, 0][pplet],
					rplet = pplet,
					c = line.char()
				if (c == ':') {
					c = line.next_char()
					if (c > '0' && c <= '9') {
						qplet = line.get_int();
						c = line.char()
					}
					if (c == ':') {
						c = line.next_char()
						if (c > '0' && c <= '9') {
							rplet = line.get_int();
							c = line.char()
						} else {
							line.error("Invalid 'r' in tuplet")
							continue
						}
					}
				} else {
					if (qplet == 0)
						qplet = (curvoice.wmeasure
								% 9) == 0 ?
									3 : 2
				}
				s = {
					type: TUPLET,
					tuplet_p: pplet,
					tuplet_q: qplet,
					tuplet_r: rplet,
					tuplet_n: rplet,
					tuplet_f: clone(cfmt.tuplets)
				}
				sym_link(s);
				s_tuplet_up = s_tuplet;
				tuplet_fact_up = tuplet_fact;
				s_tuplet = s;
				tuplet_fact *= qplet / pplet
				continue
			}
			if (c == '&') {		// voice overlay start
				get_vover('(')
				break
			}
			slur_start <<= 4;
			line.index--;
			slur_start += parse_vpos()
			continue
		case ')':			// slur end
			if (curvoice.ignore)
				break
			s = curvoice.last_sym
			if (s) {
				switch (s.type) {
				case NOTE:
				case REST:
				case SPACE:
					break
				default:
					s = null
					break
				}
			}
			if (!s) {
				line.error("Bad character ')'")
				break
			}
			if (s.slur_end)
				s.slur_end++
			else
				s.slur_end = 1
			break
		case '!':			// start of decoration
			if (!a_dcn)
				a_dcn = []
			if (type.length > 1) {	// decoration letter
				a_dcn.push(type.slice(1, -1))
				break
			}
			dcn = "";
			i = line.index		// in case no deco end
			while (1) {
				c = line.next_char()
				if (!c)
					break
				if (c == '!')
					break
				dcn += c
			}
			if (!c) {
				line.index = i;
				line.error("No end of decoration")
				break
			}
			a_dcn.push(dcn)
			break
		case '"':
			parse_gchord(type)
			break
		case '-':
			var tie_pos = 0
			if (!curvoice.last_note
			 || curvoice.last_note.type != NOTE) {
				line.error("No note before '-'")
				break
			}
			tie_pos = parse_vpos();
			s = curvoice.last_note
			for (i = 0; i <= s.nhd; i++) {
				if (s.notes[i].ti1 == 0)
					s.notes[i].ti1 = tie_pos
				else if (s.nhd == 0)
					line.error("Too many ties")
			}
			s.ti1 = true
			continue
		case '[':
			var c_next = line.buffer[line.index + 1]
			if ('|[]: "'.indexOf(c_next) >= 0
			 || (c_next >= '1' && c_next <= '9')) {
				if (grace) {
					line.error("Cannot have a bar in grace notes")
					break
				}
				new_bar()
				continue
			}
			if (line.buffer[line.index + 2] == ':') {
//temporary
				parse.istart = parse.bol + line.index;
				line.index++;
				i = line.buffer.indexOf(']', line.index);
				if (i < 0) {
					line.error("Lack of ']'")
					break
				}
				var text = line.buffer.slice(line.index + 2, i).trim()
				line.index = i + 1;
//temporary
				parse.iend = parse.bol + line.index
				var err = do_info(c_next, text)
				if (err)
					line.error(err);
				continue
			}
			// fall thru (chord)
		case 'n':				// note/rest
			s = new_note(grace, tuplet_fact)
			if (!s)
				continue;
			if (s.type == NOTE) {
				s.slur_start = slur_start;
				slur_start = 0
				if (sappo) {
					s.sappo = true;
					sappo = false
				}
			}
			if (grace) {
				if (s_tuplet)
					s.in_tuplet = true
			} else if (s_tuplet && s.notes) {
				s.in_tuplet = true;
				s_tuplet.tuplet_n--
				if (s_tuplet_up)
					s_tuplet_up.tuplet_n--
				if (s_tuplet.tuplet_n == 0) {
					s_tuplet = s_tuplet_up;
					tuplet_fact = tuplet_fact_up
					if (s_tuplet) {
						s_tuplet_up = null;
						tuplet_fact_up = 1
						if (s_tuplet.tuplet_n == 0) {
							s_tuplet = null;
							tuplet_fact = 1;
							curvoice.time = Math.round(curvoice.time);
							s.dur = curvoice.time - s.time
						}
					} else {
						curvoice.time = Math.round(curvoice.time);
						s.dur = curvoice.time - s.time
					}
				}
			}
			continue
		case '<':				/* '<' and '>' */
			if (!curvoice.last_note) {
				line.error("No note before '" + c + "'")
				break
			}
			var n = c == '<' ? 1 : -1
			while (c == '<' || c == '>') {
				n *= 2;
				c = line.next_char()
			}
			curvoice.brk_rhythm = n
			continue
		case 'd':				// possible decoration
			line.error("Bad character '" + c + "'")
			break
		case 'i':				// ignore
			break
		case '{':
//fixme: create GRACE and link in 'extra'
			if (grace) {
				line.error("'{' in grace note")
				break
			}
			last_note_sav = curvoice.last_note;
			curvoice.last_note = null;
			a_dcn_sav = a_dcn;
			a_dcn = undefined;
			grace = true;
			c = line.next_char()
			if (c == '/') {
				sappo = true
				break
			}
			continue
		case '|':
			c = line.buffer[line.index - 1];
			new_bar()
			if (c == '.')
				curvoice.last_sym.bar_dotted = true
			continue
		case '}':
			s = curvoice.last_note
			if (!grace || !s) {
				line.error("Bad character '}'")
				break
			}
			s.gr_end = true;
			grace = false
			if ((!s.prev
			  || !s.prev.grace)		// if one grace note
			 && !curvoice.key.k_bagpipe) {
				for (i = 0; i <= s.nhd; i++)
					s.notes[i].dur *= 2;
				s.dur *= 2;
				s.dur_orig *= 2;
				var res = identify_note(s, s.dur_orig);
				s.head = res[0];
				s.dots = res[1];
				s.nflags = res[2]
			}
			curvoice.last_note = last_note_sav;
			a_dcn = a_dcn_sav
			break
		case "\\":
			if (line.index == line.buffer.length - 1)
				return
			for (i = line.index + 1; ; i++) {
				c = line.buffer[i]
				if (!c || c == '%')
					return
				if (c != ' ' && c != '\t')
					break
			}
			// fall thru
		default:
			line.error("Bad character '" + c + "'")
			break
		}
		line.advance()
	}

	if (cfmt.breakoneoln && curvoice.last_note)
		curvoice.last_note.beam_end = true
	if (cfmt.barsperstaff)
		return
	if (char_tb['\n'.charCodeAt(0)] == '\n'
	 && par_sy.voices[curvoice.v].range == 0
	 && curvoice.last_sym)
		curvoice.last_sym.eoln = true
//--fixme: cfmt.alignbars
}
// abc2svg - subs.js - text output
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

/* width of characters according to the encoding */
/* these are the widths for Times-Roman, extracted from the 'a2ps' package */
/*fixme-hack: set 500 to control characters for utf-8*/
var cw_tb = [
	.500,.500,.500,.500,.500,.500,.500,.500,	// 00
	.500,.500,.500,.500,.500,.500,.500,.500,
	.500,.500,.500,.500,.500,.500,.500,.500,	// 10
	.500,.500,.500,.500,.500,.500,.500,.500,
	.250,.333,.408,.500,.500,.833,.778,.333,	// 20
	.333,.333,.500,.564,.250,.564,.250,.278,
	.500,.500,.500,.500,.500,.500,.500,.500,	// 30
	.500,.500,.278,.278,.564,.564,.564,.444,
	.921,.722,.667,.667,.722,.611,.556,.722,	// 40
	.722,.333,.389,.722,.611,.889,.722,.722,
	.556,.722,.667,.556,.611,.722,.722,.944,	// 50
	.722,.722,.611,.333,.278,.333,.469,.500,
	.333,.444,.500,.444,.500,.444,.333,.500,	// 60
	.500,.278,.278,.500,.278,.778,.500,.500,
	.500,.500,.333,.389,.278,.500,.500,.722,	// 70
	.500,.500,.444,.480,.200,.480,.541,.500
]

/* -- return the character width -- */
function cwid(c) {
	var i = c.charCodeAt(0)		// utf-16

	if (i >= 0x80)
		i = 0x61		// 'a'
	return cw_tb[i]
}

// estimate the width of a string
function strw(str) {
	var	swfac = gene.curfont.swfac,
		w = 0,
		i, j, c,
		n = str.length

	for (i = 0; i < n; i++) {
		c = str[i]
		switch (c) {
		case '$':
			c = str[i + 1]
			if (c == '0') {
				gene.curfont = gene.deffont
			} else if (c >= '1' && c <= '9') {
				gene.curfont = get_font("u" + c)
			} else {
				w += cwid('$') * swfac
				break
			}
			i++
			swfac = gene.curfont.swfac
			continue
		case '&':
			j = str.indexOf(';', i)
			if (j > 0 && j - i < 10) {
				i = j;
				c = 'a'		// XML character reference
			}
			break
		}
		w += cwid(c) * swfac
	}
	return w
}

// set the default and current font
function set_font(xxx) {
	gene.curfont = gene.deffont = get_font(xxx)
}

// output a string handling the font changes
function out_str(str) {
	var i, c, new_font

	for (i = 0; i < str.length; i++) {
		c = str[i]
		switch (c) {
		case '<':
			c = "&lt;"
			break
		case '>':
			c = "&gt;"
			break
		case "'":
			c = "&apos;"
			break
		case '"':
			c = "&quot;"
			break
		case '&':
			if (str[i + 1] == '#')
				break
			if (str[i + 2] == 't'
			 && str[i + 3] == ';'
			 && (str[i + 1] == 'l' || str[i + 1] == 'g'))
				break
			if (str[i + 1] == 'a'
			 && str[i + 2] == 'p'
			 && str[i + 3] == 'o'
			 && str[i + 4] == 's'
			 && str[i + 5] == ';')
				break
			if (str[i + 1] == 'q'
			 && str[i + 2] == 'u'
			 && str[i + 3] == 'o'
			 && str[i + 4] == 't'
			 && str[i + 5] == ';')
				break
			if (str[i + 1] == 'a'
			 && str[i + 2] == 'm'
			 && str[i + 3] == 'p'
			 && str[i + 4] == ';')
				break
			c = "&amp;"
			break
		case '$':
			c = str[++i]
			if (c == '0') {
				if (gene.curfont == gene.deffont)
					break
				gene.curfont = gene.deffont;
				c = "</tspan>"
			} else if (c >= '1' && c <= '9') {
				new_font = get_font("u" + c)
				if (!new_font)
					break
				if (new_font == gene.curfont)
					break
				if (gene.curfont != gene.deffont)
					output.push("</tspan>");
				gene.curfont = new_font;
				c = '<tspan\n\tclass="f' +
					new_font.fid + cfmt.fullsvg + '">'
			} else {
				output.push('$');
			}
			break
		}
		output.push(c)
	}
	if (gene.curfont != gene.deffont) {
		output.push("</tspan>");
		gene.curfont = gene.deffont
	}
}

// output a string, handling the font changes
// the action is:
//	'c' align center
//	'r' align right
//	'\t' handle the tabulations - dx is the space between the fields
//	'j' justify - dx is the line width
//	otherwise align left
function xy_str(x, y, str,
		 action,
		 dx) {
	output.push('<text class="f' + gene.curfont.fid + cfmt.fullsvg + '" x="');
	out_sxsy(x, '" y="', y)
	if (action == 'c')
		output.push('" text-anchor="middle">')
	else if (action == 'j')
		output.push('" textLength="' + dx.toFixed(2) + '">')
	else if (action == 'r')
		output.push('" text-anchor="end">');
	else
		output.push('">');
	out_str(str);
	output.push("</text>\n")
}

/* -- move trailing "The" to front, set to uppercase letters or add xref -- */
function trim_title(title, is_subtitle) {
	var i

	if (cfmt.titletrim) {
		i = title.lastIndexOf(", ")
		if (i < 0 || title[i + 2] < 'A' || title[i + 2] > 'Z' ||
		    i < title.length - 7 ||	/* word no more than 5 characters */
		    title.indexOf(' ', i + 3) >= 0)
			i = 0
	}
	if (!is_subtitle
	 && cfmt.writefields.indexOf('X') >= 0)
		title = info.X + '.  ' + title
	if (i)
		title = title.slice(i + 2).trim() + ' ' + title.slice(0, i)
	if (cfmt.titlecaps)
		return title.toUpperCase()
	return title
}

// header generation functions
function write_title(title, is_subtitle) {
	var font, sz

	if (!title)
		return
	title = trim_title(title, is_subtitle)
	if (is_subtitle) {
		set_font("subtitle");
		sz = gene.curfont.size;
		vskip(cfmt.subtitlespace + sz)
	} else {
		set_font("title");
		sz = gene.curfont.size;
		vskip(cfmt.titlespace + sz)
	}
	if (cfmt.titleleft)
		xy_str(0, sz * 0.2, title)
	else
		xy_str((cfmt.pagewidth - cfmt.leftmargin - cfmt.rightmargin)
				/ 2 / cfmt.scale,
				sz * 0.2, title, "c")
}

/* -- output a header format '111 (222)' -- */
function put_inf2r(x, y, str1, str2, action) {
	if (!str1) {
		str1 = str2;
		str2 = null
	}
	if (!str2)
		xy_str(x, y, str1, action)
	else
		xy_str(x, y, str1 + ' (' + str2 + ')', action)
}

/* -- write a text block (%%begintext / %%text / %%center) -- */
function write_text(text, action) {
	if (action == 's')
		return				// skip
	set_font("text")
	var	strlw = (cfmt.pagewidth - cfmt.leftmargin - cfmt.rightmargin) /
				cfmt.scale,
		lineskip = gene.curfont.size * cfmt.lineskipfac,
		parskip = gene.curfont.size * cfmt.parskipfac,
		i, j, x
	switch (action) {
	default:
//	case 'c':
//	case 'r':
		switch (action) {
		case 'c': x = strlw / 2; break
		case 'r': x = strlw; break
		default: x = 0; break
		}
		j = 0
		while (1) {
			i = text.indexOf('\n', j)
			if (i < 0) {
				vskip(lineskip);
				xy_str(x, 0, text.slice(j), action)
				break
			}
			if (i == j) {			// new paragraph
				vskip(parskip);
				blk_out()
				while (text[i + 1] == '\n') {
					vskip(lineskip);
					i++
				}
				if (i == text.length)
					break
			} else {
				vskip(lineskip);
				xy_str(x, 0, text.slice(j, i), action)
			}
			j = i + 1
		}
		vskip(parskip);
		blk_out()
		break
	case 'f':
	case 'j':
		var words
		j = 0
		while (1) {
			i = text.indexOf('\n\n', j)
			if (i < 0)
				words = text.slice(j)
			else
				words = text.slice(j, i);
			words = words.split(/\s+/)
			var w = 0, k = 0
			for (j = 0; j < words.length; j++) {
				w += strw(words[j] + ' ')
				if (w >= strlw) {
					vskip(lineskip);
					xy_str(0, 0,
						words.slice(k, j).join(' '),
						action, strlw);
					k = j;
					w = 0
				}
			}
			if (w != 0) {
				vskip(lineskip);
				xy_str(0, 0, words.slice(k).join(' '))
			}
			vskip(parskip);
			blk_out()
			if (i < 0)
				break
			while (text[i + 2] == '\n') {
				vskip(lineskip);
				i++
			}
			if (i == text.length)
				break
			j = i + 2
		}
		break
	}
}

/* -- output a line of words after tune -- */
function put_wline(p, x, right) {
	var i = 0, j, k
	while (p[i] == ' ')
		i++
	if (p[i] == '$' && p[i +  1] >= '0' && p[i + 1] <= '9')
		i += 2;
	k = 0;
	j = i
	if ((p[i] >= '0' && p[i] <= '9') || p[i + 1] == '.') {
		while (i < p.length) {
			i++
			if (p[i] == ' '
			 || p[i - 1] == ':'
			 || p[i - 1] == '.')
				break
		}
		k = i
		while (p[i] == ' ')
			i++
	}

	if (k != 0)
		xy_str(x, 0, p.slice(j, k), 'r')
	if (i < p.length)
		xy_str(x + 5, 0, p.slice(i), 'l')
	return i > p.length && k == 0
}

/* -- output the words after tune -- */
function put_words(words) {
	var p, i, j, n, nw, i2, i_end, have_text;
	blk_out();
	set_font("words")

	/* see if we may have 2 columns */
	var middle = 0.5 * (cfmt.pagewidth - cfmt.leftmargin - cfmt.rightmargin) /
				cfmt.scale
	var max2col = (middle - 45.) / (cwid('a') * gene.curfont.swfac)
	n = 0
	words = words.split('\n');
	nw = words.length
	for (i = 0; i < nw; i++) {
		p = words[i]
/*fixme:utf8*/
		if (p.length > max2col) {
			n = 0
			break
		}
		if (!p) {
			if (have_text) {
				n++;
				have_text = false
			}
		} else {
			have_text = true
		}
	}
	if (n > 0) {
		n++;
		n /= 2;
		i = n;
		have_text = false
		for (i_end = 0; i_end < nw; i_end++) {
			p = words[i_end];
			j = 0
			while (p[j] == ' ')
				j++
			if (j == p.length) {
				if (have_text && --i <= 0)
					break
				have_text = false
			} else {
				have_text = true
			}
		}
		i2 = i_end + 1
	} else {
		i2 = i_end = nw
	}

	/* output the text */
	vskip(cfmt.wordsspace)

	for (i = 0; i < i_end || i2 < nw; i++) {
		var desc = gene.curfont.size * 0.2
//fixme:should also permit page break on stanza start
		if (i < i_end && words[i].length == 0)
			blk_out();
		vskip(cfmt.lineskipfac * gene.curfont.size - desc)
		if (i < i_end)
			put_wline(words[i], 45., 0)
		if (i2 < nw) {
			if (put_wline(words[i2], 20. + middle, 1)) {
				if (--n == 0) {
					if (i < i_end) {
						n++
					} else if (i2 < words.length - 1) {

						/* center the last words */
/*fixme: should compute the width average.. */
						middle *= 0.6
					}
				}
			}
			i2++
		}
		vskip(desc)
	}
}

/* -- output history -- */
function put_history() {
	var	i, j, c, str, font, h, w,
		names = cfmt.infoname.split("\n"),
		n = names.length
	for (i = 0; i < n; i++) {
		c = names[i][0]
		if (cfmt.writefields.indexOf(c) < 0)
			continue
		str = info[c]
		if (!str)
			continue
		if (!font) {
			font = true;
			set_font("history");
			vskip(cfmt.textspace);
			h = gene.curfont.size * cfmt.lineskipfac
		}
		head = names[i].slice(2)
		if (head[0] = '"')
			head = head.slice(1, -1)
		vskip(h);
		xy_str(0, 0, head);
		w = strw(head);
		str = str.split('\n');
		xy_str(w, 0, str[0])
		for (j = 1; j < str.length; j++) {
			vskip(h);
			xy_str(w, 0, str[j])
		}
		vskip(h * 0.3);
		blk_out()
	}
}

/* -- write heading with format -- */
var info_font_init = {
	A: "info",
	C: "composer",
	O: "composer",
	P: "parts",
	Q: "tempo",
	R: "info",
	T: "title",
	X: "title"
}
function write_headform(lwidth) {
	var	c, font, font_name, align, x, y, sz,
		info_val = {},
		info_font = clone(info_font_init),
		info_sz = {
			A: cfmt.infospace,
			C: cfmt.composerspace,
			O: cfmt.composerspace,
			R: cfmt.infospace
		},
		info_nb = {}

	// compress the format
	var	fmt = "",
		p = cfmt.titleformat,
		j = 0, i = 0
	while (1) {
		while (p[i] == ' ')
			i++
		if (i >= p.length)
			break
		c = p[i++]
		if (c < 'A' || c > 'Z') {
			if (c == '+') {
				if (fmt.lenth == 0
				 || fmt[fmt.length - 1] == '+')
					continue
				fmt = fmt.slice(0, -1) + '+'
			} else if (c == ',') {
				if (fmt[fmt.length - 1] == '+')
					fmt = fmt.slice(0, -1) + 'l'
				fmt += '\n'
			}
			continue
		}
		if (!info_val[c]) {
			if (!info[c])
				continue
			info_val[c] = info[c].split('\n');
			info_nb[c] = 1
		} else {
			info_nb[c]++
		}
		fmt += c
		switch (p[i]) {
		case '-':
			fmt += 'l'
			i++
			break
		case '0':
			fmt += 'c'
			i++
			break
		case '1':
			fmt += 'r'
			i++
			break
		default:
			fmt += 'c'
			break
		}
	}
	if (fmt[fmt.length - 1] == '+')
		fmt = fmt.slice(0, -1) + 'l';
	fmt += '\n'

	// loop on the blocks
	var	ya = {
			l: cfmt.titlespace,
			c: cfmt.titlespace,
			r: cfmt.titlespace
		},
		xa = {
			l: 0,
			c: lwidth * 0.5,
			r: lwidth
		},
		yb = {},
		str;
	p = fmt;
	i = 0
	while (1) {

		// get the y offset of the top text
		yb.l = yb.c = yb.r = y = 0;
		j = i
		while (1) {
			c = p[j++]
			if (c == '\n')
				break
			align = p[j++]
			if (align == '+')
				align = p[j + 1]
			else if (yb[align] != 0)
				continue
			str = info_val[c]
			if (!str)
				continue
			font_name = info_font[c]
			if (!font_name)
				font_name = "history";
			font = get_font(font_name);
			sz = font.size * 1.1
			if (info_sz[c])
				sz += info_sz[c]
			if (y < sz)
				y = sz;
			yb[align] = sz
		}
		ya.l += y - yb.l;
		ya.c += y - yb.c;
		ya.r += y - yb.r
		while (1) {
			c = p[i++]
			if (c == '\n')
				break
			align = p[i++]
			if (info_val[c].length == 0)
				continue
			str = info_val[c].shift()
			if (align == '+') {
				info_nb[c]--;
				c = p[i++];
				align = p[i++]
				if (info_val[c].length > 0) {
					if (str)
						str += ' ' + info_val[c].shift()
					else
						str = ' ' + info_val[c].shift()
				}
			}
			font_name = info_font[c]
			if (!font_name)
				font_name = "history";
			font = get_font(font_name);
			sz = font.size * 1.1
			if (info_sz[c])
				sz += info_sz[c];
			set_font(font_name);
			x = xa[align];
			y = ya[align] + sz

			if (c == 'Q') {			/* special case for tempo */
				if (align != 'l') {
					var w = tempo_width(glovar.tempo)
					if (align == 'c')
						w *= 0.5
					x -= w
				}
				write_tempo(glovar.tempo, x, -y,
//						0,	// beat
						0.75);
				info.Q = null;		/* don't display in tune */
				glovar.tempo = null
			} else if (str) {
				xy_str(x, -y, str, align)
			}

			if (c == 'T') {
				font_name = info_font.T = "subtitle";
				info_sz.T = cfmt.subtitlespace
			}
			if (info_nb[c] <= 1) {
				if (c == 'T') {
					font = get_font(font_name);
					sz = font.size * 1.1
					if (info_sz[c])
						sz += info_sz[c];
					set_font(font_name)
				}
				while (info_val[c].length > 0) {
					y += sz;
					str = info_val[c].shift();
					xy_str(x, -y, str, align)
				}
			}
			info_nb[c]--;
			ya[align] = y
		}
		if (ya.c > ya.l)
			ya.l = ya.c
		if (ya.r > ya.l)
			ya.l = ya.r
		if (i >= fmt.length)
			break
		ya.c = ya.r = ya.l
	}
	vskip(ya.l)
}

/* -- output the tune heading -- */
function write_heading() {
	var	i, j, area, composer, origin, rhythm, down1, down2
		lwidth = (cfmt.pagewidth - cfmt.leftmargin - cfmt.rightmargin) /
				cfmt.scale
	if (cfmt.titleformat && cfmt.titleformat.length > 0) {
		write_headform(lwidth);
		vskip(cfmt.musicspace)
		return
	}

	/* titles */
	if (info.T &&
	    cfmt.writefields.indexOf('T') >= 0) {
		i = 0
		while (1) {
			j = info.T.indexOf("\n", i)
			if (j < 0) {
				write_title(info.T.substring(i), i != 0)
				break
			}
			write_title(info.T.slice(i, j), i != 0);
			i = j + 1
		}
	}

	/* rhythm, composer, origin */
	set_font("composer");
	down1 = cfmt.composerspace + gene.curfont.size
	if (parse.ckey.k_bagpipe
	 && !cfmt.infoline
	 && cfmt.writefields.indexOf('R') >= 0)
		rhythm = info.R
	if (rhythm) {
		xy_str(0, -cfmt.composerspace, rhythm);
		down1 = cfmt.composerspace
	}
	area = info.A
	if (cfmt.writefields.indexOf('C') >= 0)
		composer = info.C
	if (cfmt.writefields.indexOf('O') >= 0)
		origin = info.O
	if (composer || origin || cfmt.infoline) {
		var xcomp, align;
		vskip(cfmt.composerspace)
		if (cfmt.aligncomposer < 0) {
			xcomp = 0;
			align = ' '
		} else if (cfmt.aligncomposer == 0) {
			xcomp = lwidth * 0.5;
			align = 'c'
		} else {
			xcomp = lwidth;
			align = 'r'
		}
		down2 = down1
		if (composer || origin) {
			if (cfmt.aligncomposer >= 0
			 && down1 != down2)
				vskip(down1 - down2);
			i = 0
			while (1) {
				vskip(gene.curfont.size)
				if (composer)
					j = composer.indexOf("\n", i)
				else
					j = -1
				if (j < 0) {
					put_inf2r(xcomp, 0,
						composer ? composer.substring(i) : null,
						origin,
						align)
					break
				}
				xy_str(xcomp, 0,
					composer.slice(i, j), align);
				down1 += gene.curfont.size;
				i = j + 1
			}
			if (down2 > down1)
				vskip(down2 - down1)
		}

		rhythm = rhythm ? null : info.R
		if ((rhythm || area) && cfmt.infoline) {

			/* if only one of rhythm or area then do not use ()'s
			 * otherwise output 'rhythm (area)' */
			set_font("info");
			vskip(gene.curfont.size + cfmt.infospace);
			put_inf2r(lwidth, 0,
				rhythm, area, 'r');
			down1 += gene.curfont.size + cfmt.infospace
		}
		down2 = 0
	} else {
		down2 = cfmt.composerspace
	}

	/* parts */
	if (info.P
	 && cfmt.writefields.indexOf('P') >= 0) {
		set_font("parts");
		down1 = cfmt.partsspace + gene.curfont.size - down1
		if (down1 > 0)
			down2 += down1
		if (down2 > 0.01)
			vskip(down2);
		xy_str(0, 0, info.P);
		down2 = 0
	}
	vskip(down2 + cfmt.musicspace)
}

// abc2svg - svg.js - svg functions
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

var	output = [],		// output buffer
	style = '\n.fill {fill: currentColor}\
\n.stroke {stroke: currentColor; fill: none; stroke-width: .7}',
	font_style = '',
	posy = 0,		// y offset in the block
	posx = cfmt.leftmargin / cfmt.scale,	// indentation
	defined_glyph = {},
	defs = '',
	stv_g = {		/* staff/voice graphic parameters */
		scale: 1,
		dy: 0,
		st: -1,
		v: 0
//		color: undefined
	},
	block = {}		/* started & newpage */

var glyphs = {
  brace: '<path id="brace" class="fill" transform="scale(0.0235)"\n\
	d="M-20 -515v-2\n\
	c35 -16 53 -48 53 -91\n\
	c0 -34 -11 -84 -35 -150\n\
	c-13 -41 -18 -76 -18 -109\n\
	c0 -69 29 -121 87 -160\n\
	c-44 35 -63 77 -63 125\n\
	c0 26 8 56 21 91\n\
	c27 71 37 130 37 174\n\
	c0 62 -26 105 -77 121\n\
	c52 16 77 63 77 126\n\
	c0 46 -10 102 -37 172\n\
	c-13 35 -21 68 -21 94\n\
	c0 48 19 89 63 124\n\
	c-58 -39 -87 -91 -87 -160\n\
	c0 -33 5 -68 18 -109\n\
	c24 -66 35 -116 35 -150\n\
	c0 -44 -18 -80 -53 -96z"/>',
  utclef: '<path id="utclef" class="fill" transform="scale(0.045)"\n\
	d="m-50 44\n\
	c-72 -41 -72 -158 52 -188\n\
	150 -10 220 188 90 256\n\
	-114 52 -275 0 -293 -136\n\
	-15 -181 93 -229 220 -334\n\
	88 -87 79 -133 62 -210\n\
	-51 33 -94 105 -89 186\n\
	17 267 36 374 49 574\n\
	6 96 -19 134 -77 135\n\
	-80 1 -126 -93 -61 -133\n\
	85 -41 133 101 31 105\n\
	23 17 92 37 90 -92\n\
	-10 -223 -39 -342 -50 -617\n\
	0 -90 0 -162 96 -232\n\
	56 72 63 230 22 289\n\
	-74 106 -257 168 -255 316\n\
	9 153 148 185 252 133\n\
	86 -65 29 -192 -80 -176\n\
	-71 12 -105 67 -59 124"/>',
  tclef: '<use id="tclef" xlink:href="#utclef"/>',
  stclef: '<use id="stclef" transform="scale(0.8)"\n\
	xlink:href="#utclef"/>',
  ubclef: '<path id="ubclef" class="fill" transform="scale(0.045)"\n\
	d="m-200 312\n\
	c124 -35 222 -78 254 -236\n\
	43 -228 -167 -246 -192 -103\n\
	59 -80 157 22 92 78\n\
	-62 47 -115 -22 -106 -88\n\
	21 -141 270 -136 274 52\n\
	-1 175 -106 264 -322 297\n\
	m357 -250\n\
	c0 -36 51 -34 51 0\n\
	0 37 -51 36 -51 0\n\
	m-2 -129\n\
	c0 -36 51 -34 51 0\n\
	0 38 -51 37 -51 0"/>',
  bclef: '<use id="bclef" xlink:href="#ubclef"/>',
  sbclef: '<use id="sbclef" transform="scale(0.8)"\n\
	xlink:href="#ubclef"/>',
  ucclef: '<path id="ucclef" class="fill" transform="scale(0.045)"\n\
	d="m-51 3\n\
	v262\n\
	h-13\n\
	v-529\n\
	h13\n\
	v256\n\
	c25 -20 41 -36 63 -109\n\
	14 31 13 51 56 70\n\
	90 34 96 -266 -41 -185\n\
	52 19 27 80 -11 77\n\
	-90 -38 33 -176 139 -69\n\
	72 79 1 241 -134 186\n\
	l-16 39 16 38\n\
	c135 -55 206 107 134 186\n\
	-106 108 -229 -31 -139 -69\n\
	38 -3 63 58 11 77\n\
	137 81 131 -219 41 -185\n\
	-43 19 -45 30 -56 64\n\
	-22 -73 -38 -89 -63 -109\n\
	m-99 -267\n\
	h57\n\
	v529\n\
	h-57\n\
	v-529"/>',
  cclef: '<use id="cclef" xlink:href="#ucclef"/>',
  scclef: '<use id="scclef" transform="scale(0.8)"\n\
	xlink:href="#ucclef"/>',
  pclef: '<path id="pclef" class="stroke" style="stroke-width:1.4"\n\
	d="m-4 10h5.4v-20h-5.4v20"/>',
  hd: '<ellipse id="hd" rx="4.1" ry="2.9"\n\
	transform="rotate(-20)" class="fill"/>',
  Hd: '<path id="Hd" class="fill" d="m3 -1.6\n\
	c-1 -1.8 -7 1.4 -6 3.2\n\
	1 1.8 7 -1.4 6 -3.2\n\
	m0.5 -0.3\n\
	c2 3.8 -5 7.6 -7 3.8\n\
	-2 -3.8 5 -7.6 7 -3.8"/>',
  HD: '<path id="HD" class="fill" d="m-2.7 -1.4\n\
	c1.5 -2.8 6.9 0 5.3 2.7\n\
	-1.5 2.8 -6.9 0 -5.3 -2.7\n\
	m8.3 1.4\n\
	c0 -1.5 -2.2 -3 -5.6 -3\n\
	-3.4 0 -5.6 1.5 -5.6 3\n\
	0 1.5 2.2 3 5.6 3\n\
	3.4 0 5.6 -1.5 5.6 -3"/>',
  HDD: '<g id="HDD">\n\
	<use xlink:href="#HD"/>\n\
	<path d="m-6 -4v8m12 0v-8" class="stroke"/>\n\
</g>',
  breve: '<g id="breve" class="stroke">\n\
	<path d="m-6 -2.7h12m0 5.4h-12" style="stroke-width:2.5"/>\n\
	<path d="m-6 -5v10m12 0v-10"/>\n\
</g>',
  longa: '<g id="longa" class="stroke">\n\
	<path d="m-6 2.7h12m0 -5.4h-12" style="stroke-width:2.5"/>\n\
	<path d="m-6 5v-10m12 0v16"/>\n\
</g>',
  ghd: '<use id="ghd" transform="translate(4.5,0) scale(0.5)" xlink:href="#hd"/>',
  r00: '<rect id="r00" class="fill"\n\
	x="-1.6" y="-6" width="3" height="12"/>',
  r0: '<rect id="r0" class="fill"\n\
	x="-1.6" y="-6" width="3" height="6"/>',
  r1: '<rect id="r1" class="fill"\n\
	x="-3.5" y="-6" width="7" height="3"/>',
  r2: '<rect id="r2" class="fill"\n\
	x="-3.5" y="-3" width="7" height="3"/>',
  r4: '<path id="r4" class="fill" d="m-1 -8.5\n\
	l3.6 5.1 -2.1 5.2 2.2 4.3\n\
	c-2.6 -2.3 -5.1 0 -2.4 2.6\n\
	-4.8 -3 -1.5 -6.9 1.4 -4.1\n\
	l-3.1 -4.5 1.9 -5.1 -1.5 -3.5"/>',
  r8e: '<path id="r8e" class="fill" d="m 0 0\n\
	c-1.5 1.5 -2.4 2 -3.6 2\n\
	2.4 -2.8 -2.8 -4 -2.8 -1.2\n\
	0 2.7 4.3 2.4 5.9 0.6"/>',
  r8: '<g id="r8">\n\
	<path d="m3.3 -4l-3.4 9.6" class="stroke"/>\n\
	<use x="3.4" y="-4" xlink:href="#r8e"/>\n\
</g>',
  r16: '<g id="r16">\n\
	<path d="m3.3 -4l-4 15.6" class="stroke"/>\n\
	<use x="3.4" y="-4" xlink:href="#r8e"/>\n\
	<use x="1.9" y="2" xlink:href="#r8e"/>\n\
</g>',
  r32: '<g id="r32">\n\
	<path d="m4.8 -10l-5.5 21.6" class="stroke"/>\n\
	<use x="4.9" y="-10" xlink:href="#r8e"/>\n\
	<use x="3.4" y="-4" xlink:href="#r8e"/>\n\
	<use x="1.9" y="2" xlink:href="#r8e"/>\n\
</g>',
  r64: '<g id="r64">\n\
	<path d="m4.8 -10 l-7 27.6" class="stroke"/>\n\
	<use x="4.9" y="-10" xlink:href="#r8e"/>\n\
	<use x="3.4" y="-4" xlink:href="#r8e"/>\n\
	<use x="1.9" y="2" xlink:href="#r8e"/>\n\
	<use x="0.4" y="8" xlink:href="#r8e"/>\n\
</g>',
  r128: '<g id="r128">\n\
	<path d="m5.8 -16 l-8.5 33.6" class="stroke"/>\n\
	<use x="5.9" y="-16" xlink:href="#r8e"/>\n\
	<use x="4.4" y="-10" xlink:href="#r8e"/>\n\
	<use x="2.9" y="-4" xlink:href="#r8e"/>\n\
	<use x="1.4" y="2" xlink:href="#r8e"/>\n\
	<use x="0.1" y="8" xlink:href="#r8e"/>\n\
</g>',
  mrest: '<g id="mrest" class="stroke">\n\
	<path d="m-10 6v-12m20 0v12"/>\n\
	<path d="m-10 0h20" style="stroke-width:5"/>\n\
</g>',
  usharp: '<path id="usharp" class="fill" d="m136 -702\n\
	v890\n\
	h32\n\
	v-890\n\
	m128 840\n\
	h32\n\
	v-888\n\
	h-32\n\
	m-232 286\n\
	v116\n\
	l338 -96\n\
	v-116\n\
	m-338 442\n\
	v116\n\
	l338 -98\n\
	v-114"/>',
  uflat: '<path id="uflat" class="fill" d="m100 -746\n\
	h32\n\
	v734\n\
	l-32 4\n\
	m32 -332\n\
	c46 -72 152 -90 208 -20\n\
	100 110 -120 326 -208 348\n\
	m0 -28\n\
	c54 0 200 -206 130 -290\n\
	-50 -60 -130 -4 -130 34"/>',
  unat: '<path id="unat" class="fill" d="m96 -750\n\
	h-32\n\
	v716\n\
	l32 -8\n\
	l182 -54\n\
	v282\n\
	h32\n\
	v-706\n\
	l-34 10\n\
	l-180 50\n\
	v-290\n\
	m0 592\n\
	v-190\n\
	l182 -52\n\
	v188"/>',
  udblesharp: '<path id="udblesharp" class="fill" d="m240 -282\n\
	c40 -38 74 -68 158 -68\n\
	v-96\n\
	h-96\n\
	c0 84 -30 118 -68 156\n\
	-40 -38 -70 -72 -70 -156\n\
	h-96\n\
	v96\n\
	c86 0 120 30 158 68\n\
	-38 38 -72 68 -158 68\n\
	v96\n\
	h96\n\
	c0 -84 30 -118 70 -156\n\
	38 38 68 72 68 156\n\
	h96\n\
	v-96\n\
	c-84 0 -118 -30 -158 -68"/>',
  udbleflat: '<path id="udbleflat" class="fill" d="m20 -746\n\
	h24\n\
	v734\n\
	l-24 4\n\
	m24 -332\n\
	c34 -72 114 -90 156 -20\n\
	75 110 -98 326 -156 348\n\
	m0 -28\n\
	c40 0 150 -206 97 -290\n\
	-37 -60 -97 -4 -97 34\n\
	m226 -450\n\
	h24\n\
	v734\n\
	l-24 4\n\
	m24 -332\n\
	c34 -72 114 -90 156 -20\n\
	75 110 -98 326 -156 348\n\
	m0 -28\n\
	c40 0 150 -206 97 -290\n\
	-37 -60 -97 -4 -97 34"/>',
  acc1: '<use id="acc1" transform="translate(-4,5) scale(0.018)" xlink:href="#usharp"/>',
 "acc-1": '<use id="acc-1" transform="translate(-3.5,3.5) scale(0.018)" xlink:href="#uflat"/>',
  acc3: '<use id="acc3" transform="translate(-3,5) scale(0.018)" xlink:href="#unat"/>',
  acc2: '<use id="acc2" transform="translate(-4,5) scale(0.018)"\n\
	xlink:href="#udblesharp"/>',
 "acc-2": '<use id="acc-2" transform="translate(-4,3.5) scale(0.018)"\n\
	xlink:href="#udbleflat"/>',
  acc1_1_4: '<g id="acc1_1_4">\n\
	<path d="m0 7.8v-15.4" class="stroke"/>\n\
	<path class="fill" d="M-1.8 2.7l3.6 -1.1v2.2l-3.6 1.1v-2.2z\n\
		M-1.8 -3.7l3.6 -1.1v2.2l-3.6 1.1v-2.2"/>\n\
</g>',
  acc1_3_4: '<g id="acc1_3_4">\n\
	<path d="m-2.5 8.7v-15.4M0 7.8v-15.4M2.5 6.9v-15.4" class="stroke"/>\n\
	<path class="fill" d="m-3.7 3.1l7.4 -2.2v2.2l-7.4 2.2v-2.2z\n\
		M-3.7 -3.2l7.4 -2.2v2.2l-7.4 2.2v-2.2"/>\n\
</g>',
 "acc-1_1_4": '<g id="acc-1_1_4" transform="scale(-1,1)">\n\
	<use xlink:href="#acc-1"/>\n\
</g>',
 "acc-1_3_4": '<g id="acc-1_3_4">\n\
    <path class="fill" d="m0.6 -2.7\n\
	c-5.7 -3.1 -5.7 3.6 0 6.7c-3.9 -4 -4 -7.6 0 -5.8\n\
	M1 -2.7c5.7 -3.1 5.7 3.6 0 6.7c3.9 -4 4 -7.6 0 -5.8"/>\n\
    <path d="m1.6 3.5v-13M0 3.5v-13" class="stroke" style="stroke-width:.6"/>\n\
</g>',
  pshhd: '<use id="pshhd" xlink:href="#acc2"/>',
  pfthd: '<g id="pfthd">\n\
	<use xlink:href="#acc2"/>\n\
	<circle r="4" class="stroke"/>\n\
</g>',
  csig: '<path id="csig" class="fill" transform="scale(0.0235, 0.0235)"\n\
	d="M303 -161\n\
	c8 1 12 2 18 3\n\
	c3 -4 4 -9 4 -13\n\
	c0 -28 -52 -54 -91 -54\n\
	c-61 2 -115 58 -115 210\n\
	c0 76 7 151 39 193\n\
	c23 29 49 42 81 42\n\
	c26 0 55 -10 83 -34\n\
	s47 -64 70 -112\n\
	c0 3 18 6 17 9\n\
	c-33 103 -76 164 -198 166\n\
	c-50 0 -100 -20 -138 -57\n\
	c-39 -38 -60 -91 -63 -159\n\
	c0 -4 -1 -43 -1 -47\n\
	c0 -168 88 -231 219 -232\n\
	c52 0 97 27 117 50\n\
	s34 49 34 75\n\
	c0 47 -25 94 -64 94\n\
	c-45 0 -73 -39 -73 -74\n\
	c2 -26 23 -60 60 -60h1z"/>',
  ctsig: '<g id="ctsig">\n\
	<use xlink:href="#csig"/>\n\
	<path d="m5 8v-16" class="stroke"/>\n\
</g>',
  pmsig: '<path id="pmsig" class="stroke" style="stroke-width:0.8"\n\
	d="m0 -7a5 5 0 0 1 0 -10a5 5 0 0 1 0 10"/>',
  pMsig: '<g id="pMsig">\n\
	<use xlink:href="#pmsig"/>\n\
	<path class="fill" d="m0 -10a2 2 0 0 1 0 -4a2 2 0 0 1 0 4"/>\n\
</g>',
  imsig: '<path id="imsig" class="stroke" style="stroke-width:0.8"\n\
	d="m0 -7a5 5 0 1 1 0 -10"/>',
  iMsig: '<g id="iMsig">\n\
	<use xlink:href="#imsig"/>\n\
	<path class="fill" d="m0 -10a2 2 0 0 1 0 -4a2 2 0 0 1 0 4"/>\n\
</g>',
  hl: '<path id="hl" class="stroke" d="m-6 0h12"/>',
  hl1: '<path id="hl1" class="stroke" d="m-7 0h14"/>',
  hl2: '<path id="hl2" class="stroke" d="m-9 0h18"/>',
  ghl: '<path id="ghl" class="stroke" d="m-3 0h6"/>',
  rdots: '<g id="rdots" class="fill">\n\
	<circle cx="0" cy="-9" r="1.2"/>\n\
	<circle cx="0" cy="-15" r="1.2"/>\n\
</g>',
  srep: '<path id="srep" class="fill" d="m-1 -6l11 -12h3l-11 12h-3"/>',
  mrep: '<path id="mrep" class="fill"\n\
    d="m-5 -16.5a1.5 1.5 0 0 1 0 3a1.5 1.5 0 0 1 0 -3\n\
	M4.5 -10a1.5 1.5 0 0 1 0 3a1.5 1.5 0 0 1 0 -3\n\
	M-7 -6l11 -12h3l-11 12h-3"/>',
  mrep2: '<g id="mrep2">\n\
    <path d="m-5.5 -19.5a1.5 1.5 0 0 1 0 3a1.5 1.5 0 0 1 0 -3\n\
	M5 -7.5a1.5 1.5 0 0 1 0 3a1.5 1.5 0 0 1 0 -3" class="fill"/>\n\
    <path d="m-7 -4l14 -10m-14 4l14 -10" class="stroke" style="stroke-width:1.8"/>\n\
</g>',
  accent: '<g id="accent" class="stroke">\n\
	<path d="m-4 0l8 -2l-8 -2" style="stroke-width:1.2"/>\n\
</g>',
  marcato: '<path id="marcato" d="m-3 0l3 -7l3 7l-1.5 0l-1.8 -4.2l-1.7 4.2"/>',
  umrd: '<path id="umrd" class="fill" d="m0 -4\n\
	l2.2 -2.2 2.1 2.9 0.7 -0.7 0.2 0.2\n\
	-2.2 2.2 -2.1 -2.9 -0.7 0.7\n\
	-2.2 2.2 -2.1 -2.9 -0.7 0.7 -0.2 -0.2\n\
	2.2 -2.2 2.1 2.9 0.7 -0.7"/>',
  lmrd: '<g id="lmrd">\n\
	<use xlink:href="#umrd"/>\n\
	<line x1="0" y1="0" x2="0" y2="-8" class="stroke" style="stroke-width:.6"/>\n\
</g>',
  grm: '<path id="grm" class="fill" d="m-5 -2.5\n\
	c5 -8.5 5.5 4.5 10 -2\n\
	-5 8.5 -5.5 -4.5 -10 2"/>',
  stc: '<circle id="stc" class="fill" cx="0" cy="-3" r="1.2"/>',
  sld: '<path id="sld" class="fill" d="m-7.2 4.8\n\
	c1.8 0.7 4.5 -0.2 7.2 -4.8\n\
	-2.1 5 -5.4 6.8 -7.6 6"/>',
  emb: '<path id="emb" d="m-2.5 -3h5" style="stroke-width:1.2; stroke-linecap:round" class="stroke"/>',
  hld: '<g id="hld" class="fill">\n\
    <circle cx="0" cy="-3" r="1.3"/>\n\
    <path d="m-7.5 -1.5\n\
	c0 -11.5 15 -11.5 15 0\n\
	h-0.25\n\
	c-1.25 -9 -13.25 -9 -14.5 0"/>\n\
</g>',
  brth: '<text id="brth" y="-6" style="font:bold italic 30px serif">,</text>',
  cpu: '<path id="cpu" class="fill" d="m-6 0\n\
	c0.4 -7.3 11.3 -7.3 11.7 0\n\
	-1.3 -6 -10.4 -6 -11.7 0"/>',
  upb: '<path id="upb" class="stroke" d="m-2.6 -9.4\n\
	l2.6 8.8\n\
	l2.6 -8.8"/>',
  dnb: '<g id="dnb">\n\
	<path d="M-3.2 -2v-7.2m6.4 0v7.2" class="stroke"/>\n\
	<path d="M-3.2 -6.8v-2.4l6.4 0v2.4" class="fill"/>\n\
</g>',
  sgno: '<g id="sgno">\n\
    <path class="fill" d="m0 -3\n\
	c1.5 1.7 6.4 -0.3 3 -3.7\n\
	-10.4 -7.8 -8 -10.6 -6.5 -11.9\n\
	4 -1.9 5.9 1.7 4.2 2.6\n\
	-1.3 0.7 -2.9 -1.3 -0.7 -2\n\
	-1.5 -1.7 -6.4 0.3 -3 3.7\n\
	10.4 7.8 8 10.6 6.5 11.9\n\
	-4 1.9 -5.9 -1.7 -4.2 -2.6\n\
	1.3 -0.7 2.9 1.3 0.7 2"/>\n\
    <line x1="-6" y1="-4.2" x2="6.6" y2="-16.8" class="stroke"/>\n\
    <circle cx="-6" cy="-10" r="1.2"/>\n\
    <circle cx="6" cy="-11" r="1.2"/>\n\
</g>',
  coda: '<g id="coda" class="stroke">\n\
	<path d="m0 -2v-20m-10 10h20"/>\n\
	<circle cx="0" cy="-12" r="6" style="stroke-width:1.7"/>\n\
</g>',
  dplus: '<path id="dplus" class="stroke" style="stroke-width:1.7"\n\
	d="m0 -0.5v-6m-3 3h6"/>',
  lphr: '<path id="lphr" class="stroke" style="stroke-width:1.2"\n\
	d="m0 0v18"/>',
  mphr: '<path id="mphr" class="stroke" style="stroke-width:1.2"\n\
	d="m0 0v12"/>',
  sphr: '<path id="sphr" class="stroke" style="stroke-width:1.2"\n\
	d="m0 0v6"/>',
  sfz: '<text id="sfz" x="-5" y="-7" style="font:italic 14px serif">\n\
	s<tspan font-size="16" font-weight="bold">f</tspan>z</text>',
  trl: '<text id="trl" x="-2" y="-4"\n\
	style="font:bold italic 16px serif">tr</text>',
  opend: '<circle id="opend" class="stroke"\n\
	cx="0" cy="-3" r="2.5"/>',
  snap: '<path id="snap" class="stroke" d="m-3 -6\n\
	c0 -5 6 -5 6 0\n\
	0 5 -6 5 -6 0\n\
	M0 -5v6"/>',
  thumb: '<path id="thumb" class="stroke" d="m-2.5 -7\n\
	c0 -6 5 -6 5 0\n\
	0 6 -5 6 -5 0\n\
	M-2.5 -9v4"/>',
  turn: '<path id="turn" class="fill" d="m5.2 -8\n\
	c1.4 0.5 0.9 4.8 -2.2 2.8\n\
	l-4.8 -3.5\n\
	c-3 -2 -5.8 1.8 -3.6 4.4\n\
	1 1.1 2 0.8 2.1 -0.1\n\
	0.1 -0.9 -0.7 -1.2 -1.9 -0.6\n\
	-1.4 -0.5 -0.9 -4.8 2.2 -2.8\n\
	l4.8 3.5\n\
	c3 2 5.8 -1.8 3.6 -4.4\n\
	-1 -1.1 -2 -0.8 -2.1 0.1\n\
	-0.1 0.9 0.7 1.2 1.9 0.6"/>',
  turnx: '<g id="turnx">\n\
	<use xlink:href="#turn"/>\n\
	<path d="m0 -1.5v-9" class="stroke"/>\n\
</g>',
  wedge: '<path id="wedge" class="fill" d="m0 -1l-1.5 -5h3l-1.5 5"/>',
  ltr: '<path id="ltr" class="fill"\n\
	d="m0 -0.4c2 -1.5 3.4 -1.9 3.9 0.4\n\
	c0.2 0.8 0.7 0.7 2.1 -0.4\n\
	v0.8c-2 1.5 -3.4 1.9 -3.9 -0.4\n\
	c-0.2 -0.8 -0.7 -0.7 -2.1 0.4z"/>',
  custos: '<g id="custos">\n\
	<path d="m-4 0l2 2.5 2 -2.5 2 2.5 2 -2.5\n\
		-2 -2.5 -2 2.5 -2 -2.5 -2 2.5" class="fill"/>\n\
	<path d="m3.5 0l5 -7" class="stroke"/>\n\
</g>',
  oct: '<text id="oct" style="font:12px serif">8</text>i'
}

// mark a glyph as used and add it in <defs>
// return generated by PS function or not
function def_use(gl) {
	var	i, j, g

	if (defined_glyph[gl])
		return
	defined_glyph[gl] = true
	g = glyphs[gl]
	if (!g) {
//throw new Error("unknown glyph: " + gl)
		error(1, null, "unknown glyph: " + gl)
		return	// fixme: the xlink is set
	}
	j = 0
	while (1) {
		i = g.indexOf('xlink:href="#', j)
		if (i < 0)
			break
		i += 13;
		j = g.indexOf('"', i);
		def_use(g.slice(i, j))
	}
	defs += '\n' + g
}

// add user defs from %%beginsvg
function defs_add(text) {
	var	i, j, gl, tag, is,
		ie = 0

	while (1) {
		is = text.indexOf('<', ie);
		if (is < 0)
			break
		if (text.slice(is, is + 4) == "<!--") {
			ie = text.indexOf('-->', is + 4)
			if (ie < 0)
				break
			continue
		}
		i = text.indexOf('id="', is)
		if (i < 0)
			break
		i += 4;
		j = text.indexOf('"', i);
		if (j < 0)
			break
		gl = text.slice(i, j);
		ie = text.indexOf('>', j);
		if (ie < 0)
			break
		if (text[ie - 1] == '/') {
			ie++
		} else {
			i = text.indexOf(' ', is);
			if (i < 0)
				break
			tag = text.slice(is + 1, i);
			ie = text.indexOf('</' + tag + '>', ie)
			if (ie < 0)
				break
			ie += 3 + tag.length
		}
		glyphs[gl] = text.slice(is, ie)
	}
}

// output the stop/start of a graphic sequence
function set_g() {

	// close the previous sequence
	if (stv_g.started) {
		output.push("</g>\n");
		stv_g.started = false
	}

	// check if new sequence needed
	if (stv_g.scale == 1 && !stv_g.color)
		return

	// open the new sequence
	output.push("<g ")
//fixme: how to remove !S..! and !V..! ?
	if (stv_g.scale != 1) {
		if (stv_g.st >= 0) {
			if (staff_tb[stv_g.st].y == 0)
				output.push('!S' + stv_g.st + '!')
			else
				output.push(staff_tb[stv_g.st].scale_str)
		} else {
			if (staff_tb[0].y == 0)
				output.push('!V' + stv_g.v + '!')
			else
				output.push(voice_tb[stv_g.v].scale_str)
		}
	}
	if (stv_g.color) {
		if (stv_g.scale != 1)
			output.push(' ');
		output.push('style="color:' + stv_g.color + '"')
	}
	output.push(">\n");
	stv_g.started = true
}

/* set the color */
function set_color(color) {
	var	old_color = stv_g.color

	if (color != stv_g.color) {
		stv_g.color = color;
		set_g()
	}
	return old_color
}

/* -- set the staff scale (only) -- */
function set_sscale(st) {
	var	new_scale, dy

	if (st != stv_g.st && stv_g.scale != 1)
		stv_g.scale = 0
	if (st >= 0)
		new_scale = staff_tb[st].staffscale
	else
		new_scale = 1
	if (st >= 0 && new_scale != 1)
		dy = staff_tb[st].y
	else
		dy = posy
	if (new_scale == stv_g.scale && dy == stv_g.dy)
		return
	stv_g.scale = new_scale;
	stv_g.dy = dy;
	stv_g.st = st;
	set_g()
}

/* -- set the voice or staff scale -- */
function set_scale(s) {
	var	new_scale = voice_tb[s.v].scale

	if (new_scale == 1) {
		set_sscale(s.st)
		return
	}
/*fixme: KO when both staff and voice are scaled */
	if (new_scale == stv_g.scale && stv_g.dy == posy)
		return
	stv_g.scale = new_scale;
	stv_g.dy = posy;
	stv_g.st = -1;
	stv_g.v = s.v;
	set_g()
}

/* -- set the staff scale when delayed output -- */
function set_dscale(st) {
	output = staff_tb[st].output;
	stv_g.scale = staff_tb[st].staffscale;
//	stv_g.dy = posy;
	stv_g.st = -1;
}

// update the y offsets of delayed output
function delayed_update() {
	var st, new_out, text

	function SV_upd(new_out) {
//fixme: how to remove !S..! and !V..! ?
		var i = 0, j, k, res, v, y

		while (1) {
			j = new_out.indexOf('!', i)
			if (j < 0)
				break
			output.push(new_out.slice(i, j))
			if (new_out[j + 1] == 'S') {
				k = new_out.indexOf('!', j + 2);
				v = Number(new_out.slice(j + 2, k));
				output.push(staff_tb[v].scale_str);
				i = k + 1
			} else if (new_out[j + 1] == 'V') {
				k = new_out.indexOf('!', j + 2);
				v = Number(new_out.slice(j + 2, k));
				output.push(voice_tb[v].scale_str);
				i = k + 1
			} else {
				output.push('!');
				i = j + 1
			}
		}
		output.push(new_out.slice(i))
	}

	for (st = 0; st <= nstaff; st++) {
		if (staff_tb[st].output.length == 0)
			continue;
		output.push('<g transform="translate(0,' +
				(-staff_tb[st].y).toFixed(2))
		if (staff_tb[st].staffscale != 1)
			output.push(') scale(' + staff_tb[st].staffscale.toFixed(2));
		output.push(')">\n');
		SV_upd(staff_tb[st].output.join(''));
		output.push('</g>\n');
		staff_tb[st].output = []
	}
}

// output the annotations
// !! tied to the symbol types in abc2svg.js !!
var anno_type = ['bar', 'clef', 'custos', 'format', 'grace',
		 'key', 'meter', 'Zrest', 'note', 'part',
		 'rest', 'yspace', 'staves', 'Break', 'tempo',
		 'tuplet', 'block']
function anno_start(s) {
	if (s.istart == undefined)
		return
	var	type = s.type,
		h = s.ymx - s.ymn + 4

	if (s.grace)
		type = GRACE;

	if (stv_g.started) {		// protection against end of container
		output.push("</g>\n");
		stv_g.started = false
	}

	user.anno_start(anno_type[s.type], s.istart, s.iend,
		s.x - s.wl - 2, staff_tb[s.st].y + s.ymn + h - 2,
		s.wl + s.wr + 4, s.ymx - s.ymn + 4);
	set_g()
}
function anno_stop(s) {
	if (s.istart == undefined)
		return
	var	type = s.type,
		h = s.ymx - s.ymn + 4

	if (s.grace)
		type = GRACE;

	if (stv_g.started) {		// protection against end of container
		output.push("</g>\n");
		stv_g.started = false
	}

	user.anno_stop(anno_type[s.type], s.istart, s.iend,
		s.x - s.wl - 2, staff_tb[s.st].y + s.ymn + h - 2,
		s.wl + s.wr + 4, s.ymx - s.ymn + 4);
	set_g()
}

// external SVG string
this.out_svg = function(str) {
	output.push(str)
}

// exported functions for the annotation
this.sx = function(x) {
	return (x + posx) / stv_g.scale
}
this.sy = function(y) {
	if (stv_g.scale == 1)
		return posy - y
	if (stv_g.st < 0)
		return (posy - y) / stv_g.scale
	return stv_g.dy - y
}

// output scaled (x + <sep> + y)
function out_sxsy(x, sep, y) {
	if (!stv_g.trans) {
		x = (posx + x) / stv_g.scale
		if (stv_g.scale != 1) {
			if (stv_g.st < 0)
				y = (posy - y) / stv_g.scale
			else
				y = stv_g.dy - y
		} else {
			y = posy - y
		}
	}
	output.push(x.toFixed(2) + sep + y.toFixed(2))
}
Abc.prototype.out_sxsy = out_sxsy

// define the start of a path
function xypath(x, y, fill) {
	if (fill)
		output.push('<path class="fill" d="m')
	else
		output.push('<path class="stroke" d="m');
	out_sxsy(x, ' ', y);
	output.push('\n')
}

// define a box
function xybox(x, y, w, h) {
	output.push('<rect class="stroke" style="stroke-width:0.6"\n\
	x="');
	out_sxsy(x, '" y="', y);
	output.push('" width="' + w.toFixed(2) +
		'" height="' + h.toFixed(2) + '"/>\n')
}

// output a glyph
function xygl(x, y, gl) {
	if (psxygl(x, y, gl))
		return
	def_use(gl);
	output.push('<use x="');
	out_sxsy(x, '" y="', y);
	output.push('" xlink:href="#' + gl + '"/>\n')
}
// - specific functions -
// gua gda (acciaccatura)
function out_acciac(x, y, dx, dy, up) {
	if (up) {
		x -= 1;
		y += 4
	} else {
		x -= 5;
		y -= 4
	}
	output.push('<path class="stroke" d="m');
	out_sxsy(x, ' ', y);
	output.push('l' + dx.toFixed(2) + ' ' + (-dy).toFixed(2) + '"/>\n')
}
// simple measure bar
function out_bar(x, y, h) {
	x += posx;
	y = posy - y;
	output.push('<path class="stroke" d="m' +
		x.toFixed(2) + ' ' + y.toFixed(2) + 'v' + (-h).toFixed(2) +
		'"/>\n')
}
// tuplet value - the staves are not defined
function out_bnum(x, y, str, erase) {
	str = str.toString()
	if (erase) {				// erase under the value
		var	i,
			w = .6

		for (i = 0; i < str.length; i++)
			w += cwid(str[i]);
		w *= 12;
		output.push('<rect fill="white" x="');
		out_sxsy(x - w / 2, '" y="', y + 10);
		output.push('" width="' + w.toFixed(2) + '" height="12"/>\n')
	}
	output.push('<text style="font:italic 12px serif"\n\
	x="');
	out_sxsy(x, '" y="', y);
	output.push('" text-anchor="middle">' + str + '</text>\n"')
}
// staff system brace
function out_brace(x, y, h) {
	def_use("brace");
//fixme: '-3' depends on the scale
	x += posx - 6;
	y = posy - y;
	h /= 24;
	output.push('<use transform="translate(' +
				x.toFixed(2) + ',' + y.toFixed(2) +
			') scale(2.5,' + h.toFixed(2) +
			')" xlink:href="#brace"/>')
}

// staff system bracket
function out_bracket(x, y, h) {
	x += posx - 5;
	y = posy - y - 3;
	h += 2;
	output.push('<path class="fill"\n\
	d="m' + x.toFixed(2) + ' ' + y.toFixed(2) + '\n\
	c10.5 1 12 -4.5 12 -3.5c0 1 -3.5 5.5 -8.5 5.5\n\
	v' + h.toFixed(2) + '\n\
	c5 0 8.5 4.5 8.5 5.5c0 1 -1.5 -4.5 -12 -3.5"/>\n')
}
// dot of note/rest
function out_dot(x, y) {
	output.push('<circle class="fill" cx="');
	out_sxsy(x,  '" cy="', y);
	output.push('" r="1.2"/>\n')
}
// dotted measure bar
function out_dotbar(x, y, h) {
	x += posx;
	y = posy - y;
	output.push('<path class="stroke" stroke-dasharray="5,5"\n\
	d="m' + x.toFixed(2) + ' ' + y.toFixed(2) + 'v' + (-h).toFixed(2) + '"/>\n')
}
// hyphen
function out_hyph(x, y, w) {
	var	n, a_y,
		d = 25 + Math.floor(w / 20) * 3

	if (w > 15.)
		n = Math.floor((w - 15) / d)
	else
		n = 0;
	x += (w - d * n - 5) / 2;
	output.push('<path class="stroke" style="stroke-width:1.2"\n\
	stroke-dasharray="5,');
	output.push(Math.round((d - 5) / stv_g.scale));
	output.push('"\n\
	d="m');
	out_sxsy(x, ' ', y + 3);	// set the line a bit upper
	output.push('h' + (d * n + 5).toFixed(2) + '"/>\n')
}
// stem [and flags]
// fixme: h is already scaled - change that?
function out_stem(x, y, h, grace,
		  nflags, straight) {	// optional
//fixme: dx KO with helf note or longa
	var	dx = grace ? GSTEM_XOFF : 3.5,
		slen = -h

	if (h < 0)
		dx = -dx;		// down
//fixme: scale needed ?
	x += dx * stv_g.scale
	output.push('<path class="stroke" d="m');
	out_sxsy(x, ' ', y)
	if (stv_g.st < 0)
		slen /= stv_g.scale;
	output.push('v' + slen.toFixed(2) + '"/>\n')	// stem
	if (!nflags)
		return

	output.push('<path class="fill"\n\
	d="');
	y += h
	if (h > 0) {				// up
		if (!straight) {
			if (!grace) {
				if (nflags == 1) {
					output.push('M');
					out_sxsy(x, ' ', y);
					output.push('c0.6 5.6 9.6 9 5.6 18.4\n' +
						'	c1.6 -6 -1.3 -11.6 -5.6 -12.8\n')
				} else {
					while (--nflags >= 0) {
						output.push('M');
						out_sxsy(x, ' ', y);
						output.push('c0.9 3.7 9.1 6.4 6 12.4\n\
	c1 -5.4 -4.2 -8.4 -6 -8.4\n');
						y -= 5.4
					}
				}
			} else {		// grace
				if (nflags == 1) {
					output.push('M');
					out_sxsy(x, ' ', y);
					output.push('c0.6 3.4 5.6 3.8 3 10\n\
	c1.2 -4.4 -1.4 -7 -3 -7\n')
				} else {
					while (--nflags >= 0) {
						output.push('M');
						out_sxsy(x, ' ', y);
						output.push('c1 3.2 5.6 2.8 3.2 8\n\
	c1.4 -4.8 -2.4 -5.4 -3.2 -5.2\n');
						y -= 3.5
					}
				}
			}
		} else {			// straight
			if (!grace) {
//fixme: check endpoints
				y += 1
				while (--nflags >= 0) {
					output.push('M');
					out_sxsy(x, ' ', y);
					output.push('l7 3.2 0 3.2 -7 -3.2z\n');
					y -= 5.4
				}
			} else {		// grace
				while (--nflags >= 0) {
					output.push('M');
					out_sxsy(x, ' ', y);
					output.push('l3 1.5 0 2 -3 -1.5z\n');
					y -= 3
				}
			}
		}
	} else {				// down
		if (!straight) {
			if (!grace) {
				if (nflags == 1) {
					output.push('M');
					out_sxsy(x, ' ', y);
					output.push('c0.6 -5.6 9.6 -9 5.6 -18.4\n\
	c1.6 6 -1.3 11.6 -5.6 12.8\n')
				} else {
					while (--nflags >= 0) {
						output.push('M');
						out_sxsy(x, ' ', y);
						output.push('c0.9 -3.7 9.1 -6.4 6 -12.4\n\
	c1 5.4 -4.2 8.4 -6 8.4\n');
						y += 5.4
					}
				}
			} else {		// grace
				if (nflags == 1) {
					output.push('M');
					out_sxsy(x, ' ', y);
					output.push('c0.6 -3.4 5.6 -3.8 3 -10\n\
	c1.2 4.4 -1.4 7 -3 7\n')
				} else {
					while (--nflags >= 0) {
						output.push('M');
						out_sxsy(x, ' ', y);
						output.push('c1 -3.2 5.6 -2.8 3.2 -8\n\
	c1.4 4.8 -2.4 5.4 -3.2 5.2\n');
						y += 3.5
					}
				}
			}
		} else {			// straight
			if (!grace) {
//fixme: check endpoints
				y += 1
				while (--nflags >= 0) {
					output.push('M');
					out_sxsy(x, ' ', y);
					output.push('l7 -3.2 0 -3.2 -7 3.2z\n');
					y += 5.4
				}
//			} else {		// grace
//--fixme: error?
			}
		}
	}
	output.push('"/>\n')
}
// thick measure bar
function out_thbar(x, y, h) {
	x += posx + 1.5;
	y = posy - y;
	output.push('<path class="stroke" style="stroke-width:3"\n\
	d="m' + x.toFixed(2) + ' ' + y.toFixed(2) +
		'v' + (-h).toFixed(2) + '"/>\n')
}
// tremolo
function out_trem(x, y, ntrem) {
	output.push('<path class="fill" d="m');
	out_sxsy(x - 4.5, ' ', y);
	output.push('\n\t')
	while (1) {
		output.push('l9 -3v3l-9 3z');
		if (--ntrem <= 0)
			break
		output.push('m0 5.4')
	}
	output.push('"/>\n')
}
// tuplet bracket - the staves are not defined
function out_tubr(x, y, dx, dy, up) {
	var h
	if (up) {
		h = -3;
		y -= 3
	} else {
		h = 3;
		y += 3
	}
	dx /= stv_g.scale;
	output.push('<path class="stroke" d="m');
	out_sxsy(x, ' ', y);
//fixme: scale for h, dx and dy ?
	output.push('v' + h.toFixed(2) +
		'l' + dx.toFixed(2) + ' ' + (-dy).toFixed(2) +
		'v' + (-h).toFixed(2) + '"/>\n')
}
// underscore line
function out_wln(x, y, w) {
	output.push('<path class="stroke" style="stroke-width:0.8"\n\
	d="m');
	out_sxsy(x, ' ', y);
	output.push('h' + w.toFixed(2) + '"/>\n')
}

// decorations with string
const deco_str_style = {
crdc:	{
		dx: 0,
		dy: 5,
		style: 'style="font:italic 14px serif"'
	},
dacs:	{
		dx: 0,
		dy: 3,
		style: 'style="font:16px serif" text-anchor="middle"'
	},
fng:	{
		dx: -3,
		dy: 1,
		style: 'style="font:8px Bookman"'
	},
pf:	{
		dx: 0,
		dy: 5,
		style: 'style="font:bold italic 16px serif"'
	}
}

function out_deco_str(x, y, name, str) {
	var	a, f,
		a_deco = deco_str_style[name]

	if (!a_deco) {
//		if (name != "@") {
//			f = user[name]
//			if (!f || typeof(f) != "function") {
//				error(1, null, "no deco function '" + name + "'")
//				return
//			}
//			f(x, y, str)
//			return
//		}
		a_deco = {
			dx: 0,
			dy: 0,
//fixme: set annotation style
			style: 'style="font:14px serif"'
		}
	}
	x += a_deco.dx;
	y += a_deco.dy;
	output.push('<text ' + a_deco.style + '\n\
	x="');
	out_sxsy(x, '" y="', y);
	output.push('">');
	set_font("annotation");
	out_str(str);
	output.push('</text>\n')
}

function out_arp(x, y, val) {
	output.push('<g transform="translate(');
	out_sxsy(x, ',', y);
	output.push(') rotate(270)">\n');
	stv_g.trans = true;
	x = 0;
	y = -4;
	val = Math.ceil(val / 6)
	while (--val >= 0) {
		xygl(x, y, "ltr");
		x += 6
	}
	stv_g.trans = false
	output.push('</g>\n')
}
function out_cresc(x, y, val, defl) {
	output.push('<path class="stroke"\n\
	d="m');
	out_sxsy(x + val, ' ', y + 5);
	output.push('l' + (-val).toFixed(2))
	if (defl.nost)
		output.push(' -2.2m0 -3.6l' + val.toFixed(2) + ' -2.2"/>\n')
	else
		output.push(' -4l' + val.toFixed(2) + ' -4"/>\n')
}
function out_dim(x, y, val, defl) {
	output.push('<path class="stroke"\n\
	d="m');
	out_sxsy(x, ' ', y + 5);
	output.push('l' + val.toFixed(2))
	if (defl.noen)
		output.push(' -2.2m0 -3.6l' + (-val).toFixed(2) + ' -2.2"/>\n')
	else
		output.push(' -4l' + (-val).toFixed(2) + ' -4"/>\n')
}
function out_ltr(x, y, val) {
	y += 4;
	val = Math.ceil(val / 6)
	while (--val >= 0) {
		xygl(x, y, "ltr");
		x += 6
	}
}

var deco_val_tb = {
	arp:	out_arp,
	cresc:	out_cresc,
	dim:	out_dim,
	ltr:	out_ltr
}

function out_deco_val(x, y, name, val, defl) {
	if (deco_val_tb[name])
		deco_val_tb[name](x, y, val, defl)
	else
		error(1, null, "No function for decoration '" + name + "'")
}

// update the vertical offset
function vskip(h) {
	posy += h
}

// initialize SVG output - called before new ABC generation
// create the SVG image of the block
function svg_flush() {
	if (multicol || !output|| !user.img_out)
		return
	var img_title
	if (info.X) {
		img_title = info.X + '.'
		if (info.T)
			img_title += ' ' + info.T.split('\n')[0]
		img_title = img_title.replace(/&/g, '&amp;');
		img_title = img_title.replace(/</g, '&lt;');
		img_title = img_title.replace(/>/g, '&gt;')
	} else {
		img_title = 'noname'
	}
	posy *= cfmt.scale

	if (user.imagesize) {
		user.img_out('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"\n\
	xmlns:xlink="http://www.w3.org/1999/xlink"\n\
	xml:space="preserve" color="black"\n' +
			user.imagesize +
			' viewBox="0 0 ' + cfmt.pagewidth.toFixed(0) + ' ' +
			 posy.toFixed(0) + '">\n\
<title>abc2svg - ' + img_title + '</title>')
	} else {
		user.img_out('<svg xmlns="http://www.w3.org/2000/svg" version="1.1"\n\
	xmlns:xlink="http://www.w3.org/1999/xlink"\n\
	xml:space="preserve" color="black"\n\
	width="' + cfmt.pagewidth.toFixed(0) + 'px" height="' + posy.toFixed(0) + 'px">\n\
<title>abc2svg - ' + img_title + '</title>')
//	width="' + (cfmt.pagewidth / 72).toFixed(2) + 'in"\
// height="' + (posy / 72).toFixed(2) + 'in"\
// viewBox="0 0 ' + cfmt.pagewidth.toFixed(0) + ' ' + posy.toFixed(0) + '">\n\
//<title>abc2svg - ' + img_title + '</title>')
	}

	if (style || font_style)
		user.img_out('<style type="text/css">' +
			style + font_style +
			'\n</style>')
	if (defs)
		user.img_out('<defs>' + defs + '\n</defs>')
	if (cfmt.bgcolor)
		user.img_out('<rect width="100%" height="100%" fill="' +
				cfmt.bgcolor + '"/>')
	if (cfmt.scale != 1)
		user.img_out('<g transform="scale(' + cfmt.scale.toFixed(2) + ')">')

	if (svgobj) {			// if PostScript support
		svgobj.setg(0);
		output.push(svgbuf);
		svgbuf = ''
	}
	user.img_out(output.join(''));
	output = []
	if (cfmt.scale != 1)
		user.img_out("</g>");
	user.img_out("</svg>");

	font_style = ''
	if (cfmt.fullsvg) {
		defined_glyph = {}
		defined_font = {}
	} else {
		style = '';
		defs = ''
	}
	posy = 0
}

var block_started

// output a part of a block of images
function blk_out() {
	if (multicol || !output || !user.img_out)
		return
	if (user.page_format && !block.started) {
		block.started = true
		if (block.newpage) {
			block.newpage = false;
			user.img_out('<div class="nobrk newpage">')
		} else {
			user.img_out('<div class="nobrk">')
		}
	}
	svg_flush()
}
Abc.prototype.blk_out = blk_out

// output the end of a block (or tune)
function blk_flush() {
	if (block.started && user.img_out) {
		block.started = false;
		user.img_out('</div>')
	}
}
Abc.prototype.blk_flush = blk_flush
// abc2svg - tune.js - tune generation
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

var	par_sy,		// current staff system for parse
	cur_sy,		// current staff system for generation
	voice_tb,
	curvoice,
	staves_found,
	vover,		// voice overlay
	tsfirst

/* -- weight of the symbols !! depemds on the symbol type -- */
const weight_tb = [
	2,		// bar
	1,		// clef
	6,		// custos
	0,		// format
	3,		// grace
	4,		// key
	5,		// meter
	9,		// mrest
	9,		// note
	0,		// part
	9,		// rest
	3,		// space
	0,		// staves
	6,		// stbrk
	0,		// tempo
	7,		// tuplet
	0		// block
]

/* apply the %%voice options of the current voice */
function voice_filter() {
	var opt, sel, tmp, i

	for (opt in parse.voice_opts) {
		sel = new RegExp(opt)
		if (sel.test(curvoice.id)
		 || sel.test(curvoice.nm)) {
			for (i = 0; i < parse.voice_opts[opt].length; i++)
				do_pscom(parse.voice_opts[opt][i])
		}
	}
}

/* -- link a ABC symbol into the current voice -- */
function sym_link(s) {
	if (!curvoice.ignore) {
		parse.last_sym = s
		s.prev = curvoice.last_sym;
		if (curvoice.last_sym)
			curvoice.last_sym.next = s
		else
			curvoice.sym = s;
		curvoice.last_sym = s
	}
	s.v = curvoice.v;
	s.st = curvoice.cst;
	s.time = curvoice.time
	if (s.dur && !s.grace)
		curvoice.time += s.dur;
	s.pos = clone(curvoice.pos)
	if (curvoice.second)
		s.second = true
	if (curvoice.floating)
		s.floating = true
}

/* -- add a new symbol in a voice -- */
function sym_add(p_voice) {
	var	s = {},
		s2,
		p_voice2 = curvoice;
	curvoice = p_voice;
	sym_link(s);
	curvoice = p_voice2
	s2 = s.prev
	if (!s2)
		s2 = s.next
	if (s2) {
		s.ctx = s2.ctx;
		s.istart = s2.istart;
		s.iend = s2.iend
	}
	return s
}

/* -- expand a multi-rest into single rests and measure bars -- */
function mrest_expand(s) {
	var	p_voice, s2, next,
		nb = s.nmes,
		dur = s.dur / nb

	/* change the multi-rest (type bar) to a single rest */
	var a_dd = s.a_dd;
	s.type = REST;
	s.dur = dur;
	s.head = "full";
	s.nflags = -2;

	/* add the bar(s) and rest(s) */
	next = s.next;
	p_voice = voice_tb[s.v];
	p_voice.last_sym = s;
	p_voice.time = s.time + dur;
	p_voice.cst = s.st;
	s2 = s
	while (--nb > 0) {
		s2 = sym_add(p_voice);
		s2.type = BAR;
		s2.bar_type = "|";
		s2 = sym_add(p_voice);
		s2.type = REST
//--fixme
//		s2.as.flags = s.as.flags;
		if (s.invisible)
			s2.invisible = true;
		s2.dur = dur;
		s2.head = "full";
		s2.nflags = -2;
		p_voice.time += dur
	}
	s2.next = next
	if (next)
		next.prev = s2;

	/* copy the mrest decorations to the last rest */
	s2.a_dd = a_dd
}

/* -- sort all symbols by time and vertical sequence -- */
function sort_all() {
	var	s, s2, p_voice, v, time, w, wmin, ir, multi,
		prev, new_sy, fl, nb, nv,
		vtb = [],
		vn = [],			/* voice indexed by range */
		mrest_time = -1;

	nv = voice_tb.length
	for (v = 0; v < nv; v++)
		vtb.push(voice_tb[v].sym)

	/* initialize the voice order */
	var	sy = cur_sy,
		set_sy = true

	while (1) {
		if (set_sy) {
			set_sy = false;
			fl = 1;			// start a new sequence
			multi = -1
			for (v = 0; v < nv; v++) {
				if (!sy.voices[v]) {
					sy.voices[v] = {
						range: -1
					}
					continue
				}
				ir = sy.voices[v].range
				if (ir < 0)
					continue
				vn[ir] = v;
				multi++
			}
		}

		/* search the min time and symbol weight */
		wmin = time = 1000000				/* big int */
		for (ir = 0; ir < vn.length; ir++) {
			v = vn[ir]
			if (v == undefined)
				break
			s = vtb[v]
			if (!s || s.time > time)
				continue
			w = weight_tb[s.type]
			if (s.time < time) {
				time = s.time;
				wmin = w
			} else if (w < wmin) {
				wmin = w
			}
			if (s.type == MREST) {
				if (s.nmes == 1)
					mrest_expand(s)
				else if (multi > 0)
					mrest_time = time
			}
		}

		if (wmin > 127)
			break					/* done */

		/* if some multi-rest and many voices, expand */
		if (time == mrest_time) {
			nb = 0
			for (ir = 0; ir < vn.length; ir++) {
				v = vn[ir]
				if (v == undefined)
					break
				s = vtb[v]
				if (!s || s.time != time
				 || weight_tb[s.type] != wmin)
					continue
				if (s.type != MREST) {
					mrest_time = -1 /* some note or rest */
					break
				}
				if (nb == 0) {
					nb = s.nmes
				} else if (nb != s.nmes) {
					mrest_time = -1	/* different duration */
					break
				}
			}
			if (mrest_time < 0) {
				for (ir = 0; ir < vn.length; ir++) {
					v = vn[ir]
					if (v == undefined)
						break
					s = vtb[v]
					if (s && s.type == MREST)
						mrest_expand(s)
				}
			}
		}

		/* link the vertical sequence */
		for (ir = 0; ir < vn.length; ir++) {
			v = vn[ir]
			if (v == undefined)
				break
			s = vtb[v]
			if (!s || s.time != time
			 || weight_tb[s.type] != wmin)
				continue
			if (s.type == STAVES) {
				sy = sy.next;
				set_sy = new_sy = true
				if (s.prev)
					s.prev.next = s.next
				else
					voice_tb[v].sym = s.next
				if (s.next)
					s.next.prev = s.prev
			} else {
				if (fl) {
					fl = 0;
					s.seqst = true
				}
				if (new_sy) {
					new_sy = false;
					s.new_sy = true
				}
				s.ts_prev = prev
				if (prev) {
					prev.ts_next = s
//fixme: bad error when the 1st voice is second
//					if (s.type == BAR
//					 && s.second
//					 && prev.type != BAR
//					 && !s.invisible)
//						error(1, s, "Bad measure bar")
				} else {
					tsfirst = s
				}
				prev = s
			}
			vtb[v] = s.next
		}
		fl = wmin		/* start a new sequence if some space */
	}

	if (!prev)
		return

	/* if no bar or format_change at end of tune, add a dummy symbol */
	if ((prev.type != BAR && prev.type != FORMAT)
	 || new_sy) {
		p_voice = voice_tb[prev.v];
		p_voice.last_sym = prev;
		s = sym_add(p_voice);
		s.type = FORMAT;
		s.time = prev.time + prev.dur;
		s.seqst = true
		if (new_sy)
			s.new_sy = true
		prev.ts_next = s;
		s.ts_prev = prev
		while (1) {
			delete prev.eoln
			if (prev.seqst)
				break
			prev = prev.ts_prev
		}
	}

	/* if Q: from tune header, put it at start of the music */
	s2 = glovar.tempo
	if (!s2)
		return
	glovar.tempo = null;
	s = tsfirst.extra
	while (s) {
		if (s.type == TEMPO)
			return			/* already a tempo */
		s = s.next
	}
	s = tsfirst;
//	s2.type = TEMPO
	s2.v = s.v;
	s2.st = s.st;
	s2.time = s.time
	if (s.extra) {
		s2.next = s.extra;
		s2.next.prev = s2
	}
	s.extra = s2
}

/* -- move the symbols with no width to the next symbol -- */
function compr_voice() {
	var p_voice, s, s2, ns, v

	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v];
//8.7.0 - for fmt at end of music line
		if (p_voice.ignore)
//			continue
			p_voice.ignore = false
		for (s = p_voice.sym; s; s = s.next) {
			if (s.time >= staves_found)
				break
		}
		ns = null
		for ( ; s; s = s.next) {
			switch (s.type) {
//--fixme: test
//			case KEY:	/* remove the empty key signatures */
//				if (s.key_none) {
//					if (s.prev)
//						s.prev.next = s.next
//					else
//						p_voice.sym = s.next
//					if (s.next)
//						s.next.prev = s.prev
//					continue
//				}
//				break
			case FORMAT:
				s2 = s.extra
				if (s2) {	/* dummy format */
					if (!ns)
						ns = s2
					if (s.prev) {
						s.prev.next = s2;
						s2.prev = s.prev
					}
					if (!s.next) {
						ns = null
						break
					}
					while (s2.next)
						s2 = s2.next;
					s.next.prev = s2;
					s2.next = s.next
				}
				/* fall thru */
			case TEMPO:
			case PART:
			case TUPLET:
			case BLOCK:
				if (!ns)
					ns = s
				continue
			case MREST:		/* don't shift P: and Q: */
				if (!ns)
					continue
				s2 = {
					type: SPACE,
					width: -1,
					invisible: true,
					v: s.v,
					st: s.st,
					time: s.time
				}
				s2.next = s;
				s2.prev = s.prev;
				s2.prev.next = s2;
				s.prev = s2;
				s = s2
				break
			}
			if (s.grace) {
				if (!ns)
					ns = s
				while (!s.gr_end)
					s = s.next;
				s2 = clone(s);
				s2.type = GRACE;
				s2.dur = 0;
				delete s2.notes;
				s2.next = s.next
				if (s2.next)
					s2.next.prev = s2
				else
					p_voice.last_sym = s2;
				s2.prev = s;
				s.next = s2;
				s = s2
			}
			if (!ns)
				continue
			s.extra = ns
			delete s.prev.next;
			s.prev = ns.prev
			if (s.prev)
				s.prev.next = s
			else
				p_voice.sym = s;
			delete ns.prev;
			ns = null
		}

		/* when symbols with no space at end of tune,
		 * add a dummy format */
		if (ns) {
			s = sym_add(p_voice);
			s.type = FORMAT;
			s.extra = ns
			delete s.prev.next;	/* unlink */
			s.prev = ns.prev
			if (s.prev)
				s.prev.next = s
			else
				p_voice.sym = s
			delete ns.prev
		}
	}
}

/* -- duplicate the voices as required -- */
function dupl_voice() {
	var p_voice, p_voice2, s, s2, g, g2, v, i

	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v];
		p_voice2 = p_voice.clone
		if (!p_voice2)
			continue
		p_voice.clone = null
		for (s = p_voice.sym; s; s = s.next) {
//fixme: there may be other symbols before the %%staves at this same time
			if (s.time >= staves_found)
				break
		}
		p_voice2.clef = clone(p_voice.clef);
		curvoice = p_voice2
		for ( ; s; s = s.next) {
			s2 = clone(s)
			if (s.notes) {
				s2.notes = []
				for (i = 0; i <= s.nhd; i++)
					s2.notes.push(clone(s.notes[i]))
			}
			sym_link(s2)
//			s2.time = s.time
			if (p_voice2.second)
				s2.second = true
			else
				delete s2.second
			if (p_voice2.floating)
				s2.floating = true
			else
				delete s2.floating
			delete s2.a_ly;
			g = s2.extra
			if (!g)
				continue
			g2 = clone(g);
			s2.extra = g2;
			s2 = g2;
			s2.v = v;
			s2.st = p_voice2.st
			for (g = g.next; g; g = g.next) {
				g2 = clone(g)
				if (g.notes) {
					g2.notes = []
					for (i = 0; i <= g.nhd; i++)
						g2.notes.push(clone(g.notes[i]))
				}
				s2.next = g2;
				g2.prev = s2;
				s2 = g2;
				s2.v = v;
				s2.st = p_voice2.st
			}
		}
	}
}

/* -- create a new staff system -- */
function new_system() {
	var	st, v,
		sy_new = {
			voices: [],
			staves: [],
			top_voice: 0
		}

	if (!par_sy) {				/* first staff system */
		cur_sy = par_sy = sy_new
	} else {
		for (v = 0; v < voice_tb.length; v++) {

			// update the previous system
			st = par_sy.voices[v].st
			var sy_staff = par_sy.staves[st]
			var p_voice = voice_tb[v]
			if (p_voice.stafflines != undefined)
				sy_staff.stafflines = p_voice.stafflines
			if (p_voice.staffscale)
				sy_staff.staffscale = p_voice.staffscale;
			sy_new.voices[v] = clone(par_sy.voices[v]);
			sy_new.voices[v].range = -1;
			delete sy_new.voices[v].second
		}
		for (st = 0; st < par_sy.staves.length; st++) {
			sy_new.staves[st] = clone(par_sy.staves[st]);
			sy_new.staves[st].flags = 0
//			sy_new.staves[st].empty = true
		}
		par_sy.next = sy_new;
		par_sy = sy_new
	}
}

/* go to a global (measure + time) */
function go_global_time(s, symsel) {
	var s2, bar_time

	if (symsel.bar <= 1) {		/* special case: there is no measure 0/1 */
//	 && nbar == -1) {		/* see set_bar_num */
		if (symsel.bar == 1) {
			for (s2 = s; s2; s2 = s2.ts_next) {
				if (s2.type == BAR
				 && s2.time != 0)
					break
			}
			if (s2.time < voice_tb[cur_sy.top_voice].meter.wmeasure)
				s = s2
		}
	} else {
		for ( ; s; s = s.ts_next) {
			if (s.type == BAR
			 && s.bar_num >= symsel.bar)
				break
		}
		if (!s)
			return null
		if (symsel.seq != 0) {
			var seq = symsel.seq
			for (s = s.ts_next; s; s = s.ts_next) {
				if (s.type == BAR
				 && s.bar_num == symsel.bar) {
					if (--seq == 0)
						break
				}
			}
			if (!s)
				return null
		}
	}

	if (symsel.time == 0)
		return s;
	bar_time = s.time + symsel.time
	while (s.time < bar_time) {
		s = s.ts_next
		if (!s)
			return s
	}
	do {
		s = s.ts_prev		/* go back to the previous sequence */
	} while (!s.seqst)
	return s
}

/* treat %%clip */
function do_clip() {
	var s, s2, sy, p_voice, v

	/* remove the beginning of the tune */
	s = tsfirst
	if (clip_start.bar > 0
	 || clip_start.time > 0) {
		s = go_global_time(s, clip_start)
		if (!s) {
			tsfirst = null
			return
		}

		/* update the start of voices */
		sy = cur_sy
		for (s2 = tsfirst; s2 != s; s2 = s2.ts_next) {
			if (s2.new_sy)
				sy = sy.next
			switch (s2.type) {
			case CLEF:
				voice_tb[s2.v].clef = s2
				break
			case KEY:
				voice_tb[s2.v].key = clone(s2.as.u.key)
				break
			case METER:
				voice_tb[s2.v].meter = clone(s2.as.u.meter)
				break
			}
		}
		cur_sy = sy
		for (v = 0; v < voice_tb.length; v++) {
			p_voice = voice_tb[v]
			for (s2 = s; s2; s2 = s2.ts_next) {
				if (s2.v == v) {
					delete s2.prev
					break
				}
			}
			p_voice.sym = s2
		}
		tsfirst = s
		delete s.ts_prev
	}

	/* remove the end of the tune */
	s = go_global_time(s, clip_end)
	if (!s)
		return

	/* keep the current sequence */
	do {
		s = s.ts_next
		if (!s)
			return
	} while (!s.seqst)

	/* cut the voices */
	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		for (s2 = s.ts_prev; s2; s2 = s2.ts_prev) {
			if (s2.v == v) {
				delete s2.next
				break
			}
		}
		if (!s2)
			p_voice.sym = null
	}
	delete s.ts_prev.ts_next
}

/* -- set the bar numbers and treat %%clip / %%break -- */
function set_bar_num() {
	var	s, s2, s3, tim,
		v = cur_sy.top_voice,
		wmeasure = voice_tb[v].meter.wmeasure,
		bar_rep = gene.nbar

	/* don't count a bar at start of line */
	for (s = tsfirst; ; s = s.ts_next) {
		if (!s)
			return
		switch (s.type) {
		case METER:
		case CLEF:
		case KEY:
		case FORMAT:
		case STBRK:
			continue
		case BAR:
			if (s.bar_num) {
				gene.nbar = s.bar_num	/* (%%setbarnb) */
				break
			}
			if (s.text			// if repeat bar
			 && !cfmt.contbarnb) {
				if (s.text[0] == '1') {
					bar_rep = gene.nbar
				} else {
					gene.nbar = bar_rep; /* restart bar numbering */
					s.bar_num = gene.nbar
				}
			}
			break
		}
		break
	}

	/* set the measure number on the top bars
	 * and move the clefs before the measure bars */
	var	bar_time = s.time + wmeasure, // for incomplete measure at start of tune
		bar_num = gene.nbar
	for ( ; s; s = s.ts_next) {
		switch (s.type) {
		case CLEF:
			if (s.new_sy)
				break
			for (s2 = s.ts_prev; s2; s2 = s2.ts_prev) {
				if (s2.new_sy) {
					s2 = undefined
					break
				}
				switch (s2.type) {
				case BAR:
					if (s2.seqst)
						break
					continue
				case MREST:
				case NOTE:
				case REST:
				case SPACE:
				case STBRK:
				case TUPLET:
					s2 = undefined
					break
				default:
					continue
				}
				break
			}
			if (!s2)
				break

			/* move the clef */
			s.next.prev = s.prev;
			s.prev.next = s.next;
			s.ts_next.ts_prev = s.ts_prev;
			s.ts_prev.ts_next = s.ts_next;
			s.next = s2;
			s.prev = s2.prev;
			s.prev.next = s;
			s2.prev = s;
			s.ts_next = s2;
			s.ts_prev = s2.ts_prev;
			s.ts_prev.ts_next = s;
			s2.ts_prev = s
//			if (s.new_sy) {
//				delete s.new_sy;
//				s.ts_next.new_sy = true
//			}
			s3 = s.extra
			if (s3) {
				if (s.ts_next.extra) {
					while (s3.next)
						s3 = s3.next
					s3.next = s.ts_next.extra;
					s.ts_next.extra = s.extra
				} else {
					s.ts_next.extra = s3
				}
				s.extra = undefined
			}
			s = s2
			break
		case METER:
			wmeasure = s.wmeasure
			if (s.time < bar_time)
				bar_time = s.time + wmeasure
			break
		case MREST:
			bar_num += s.nmes - 1
			while (s.ts_next
			    && s.ts_next.type != BAR)
				s = s.ts_next
			break
		case BAR:
			if (s.bar_num) {
				bar_num = s.bar_num		/* (%%setbarnb) */
				if (s.time < bar_time) {
					delete s.bar_num
					break
				}
			} else {
				if (s.time < bar_time)	/* incomplete measure */
					break
				bar_num++
			}

			/* check if any repeat bar at this time */
			tim = s.time;
			s2 = s
			do {
				if (s2.type == BAR
				 && s2.text		// if repeat bar
				 && !cfmt.contbarnb) {
					if (s2.text[0] == '1')
						bar_rep = bar_num
					else		/* restart bar numbering */
						bar_num = bar_rep
					break
				}
				s2 = s2.next
			} while (s2 && s2.time == tim);
			s.bar_num = bar_num;
			bar_time = s.time + wmeasure
			break
		}
	}
//fixme
	/* do the %%clip stuff */
	/* do the %%break stuff */

	if (cfmt.measurenb < 0)		/* if no display of measure bar */
		gene.nbar = bar_num	/* update in case of more music to come */
}

/* -- generate a piece of tune -- */
function generate() {
	var v, p_voice;

	compr_voice();
	dupl_voice();
	sort_all();			/* define the time / vertical sequences */
	if (!tsfirst)
		return
	set_bar_num();
	if (!tsfirst)
		return				/* no more symbol */
	output_music();

	/* reset the parser */
	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v];
		p_voice.time = 0;
		p_voice.sym = p_voice.last_sym = null;
		p_voice.st = cur_sy.voices[v].st;
		p_voice.second = cur_sy.voices[v].second;
		p_voice.clef.time = 0
//		if (p_voice.autoclef)		// set in set_pitch
//			p_voice.clef.clef_type = 'a'
		delete p_voice.have_ly;
		p_voice.hy_st = 0
		delete p_voice.bar_start
		delete p_voice.slur_st
		delete p_voice.s_tie
		delete p_voice.s_rtie
	}
	staves_found = 0;			// (for compress/dup the voices)
}

/* -- output the music and lyrics after tune -- */
function gen_ly(eob) {
	generate()
	if (info.W) {
		put_words(info.W);
		delete info.W
	}
	if (eob)
		blk_out()
}

/* transpose a key */
function key_transpose(s_key, transpose) {
	var	sf, t

	if (transpose > 0)
		t = Math.floor(transpose / 3);
	else
		t = -Math.floor(-transpose / 3);
	sf = (t & ~1) + (t & 1) * 7 + s_key.k_sf
	switch ((transpose + 210) % 3) {
	case 1:
		sf = (sf + 4 + 12 * 4) % 12 - 4	/* more sharps */
		break
	case 2:
		sf = (sf + 7 + 12 * 4) % 12 - 7	/* more flats */
		break
	default:
		sf = (sf + 5 + 12 * 4) % 12 - 5	/* Db, F# or B */
		break
	}
	s_key.k_sf = sf
}

/* -- set the accidentals when K: with modified accidentals -- */
function set_k_acc(s) {
	var i, j, n, nacc, p_acc,
		accs = [],
		pits = []
	if (s.k_sf > 0) {
		for (nacc = 0; nacc < s.k_sf; nacc++) {
			accs[nacc] = 1;
//			accs[nacc] = "sh";
			pits[nacc] = [26, 23, 27, 24, 21, 25, 22][nacc]
		}
	} else {
		for (nacc = 0; nacc < -s.k_sf; nacc++) {
			accs[nacc] = -1;
//			accs[nacc] = "ft";
			pits[nacc] = [22, 25, 21, 24, 20, 23, 26][nacc]
		}
	}
	n = s.k_a_acc.length
	for (i = 0; i < n; i++) {
		p_acc = s.k_a_acc[i]
		for (j = 0; j < nacc; j++) {
			if (pits[j] == p_acc.pit) {
				accs[j] = p_acc.acc
				break
			}
		}
		if (j == nacc) {
			accs[j] = p_acc.acc;
			pits[j] = p_acc.pit
			nacc++		/* cannot overflow */
		}
	}
	for (i = 0; i < nacc; i++) {
		p_acc = s.k_a_acc[i]
		if (!p_acc)
			p_acc = s.k_a_acc[i] = {}
		p_acc.acc = accs[i];
		p_acc.pit = pits[i]
	}
}

/* for transpose purpose, check if a pitch is already in the measure
 * in the current voice and return its accidental or (-1) */
function acc_same_pitch(pitch) {
	var	i,
		s = curvoice.last_sym

	// the overlaid voices may have no measure bars
	if (curvoice.id[curvoice.id.length - 1] == 'o') {
		for (i = curvoice.v; --i > 0; )
			if (!voice_tb[i].second)
				break
		s = voice_tb[i].last_sym
	}

	for (; s; s = s.prev) {
		switch (s.type) {
		case BAR:
			return undefined	/* no same pitch */
		default:
			continue
		case NOTE:
			break
		}
		for (i = 0; i <= s.nhd; i++) {
			if (s.notes[i].pit == pitch)
				return s.notes[i].acc
		}
	}
	return undefined
}

const	cde2fcg = [0, 2, 4, -1, 1, 3, 5],
	cgd2cde = [0, 4, 1, 5, 2, 6, 3],
//	acc1 = {
//		sh: 1,
//		ft: -1,
//		nt: 0,
//		dsh: 2,
//		dft: -2
//	},
//	acc2 = ['dft', 'ft', 'nt', 'sh', 'dsh']
	acc2 = [-2, -1, 3, 1, 2]

/* transpose a note / chord */
function note_transpose(s) {
	var	i, j, n, d, a, i1, i3, i4, note,
		m = s.nhd,
		sf_old = curvoice.okey.k_sf,
		i2 = curvoice.ckey.k_sf - sf_old,
		dp = cgd2cde[(i2 + 4 * 7) % 7],
		t = curvoice.transpose

	if (t > 0) {
		dp += Math.floor(t / 3 / 12) * 7
	} else {
		if (dp != 0)
			dp -= 7;
		dp -= Math.floor(-t / 3 / 12) * 7
	}
	for (i = 0; i <= m; i++) {
		note = s.notes[i];
		n = note.pit;
		note.pit += dp;
		note.apit = note.pit
		i1 = cde2fcg[(n + 5 + 16 * 7) % 7];	/* fcgdaeb */
		a = note.acc
		if (!a) {
			if (!curvoice.okey.a_acc) {
				if (sf_old > 0) {
					if (i1 < sf_old - 1)
						a = 1
//						a = 'sh'
				} else if (sf_old < 0) {
					if (i1 >= sf_old + 6)
						a = -1
//						a = 'ft'
				}
			} else {
				for (j = 0; j < curvoice.okey.a_acc.length; j++) {
					var acc = curvoice.okey.a_acc[j]

					if ((n + 16 * 7 - acc.pit) % 7 == 0) {
						a = acc.acc
						break
					}
				}
			}
		}
		i3 = i1 + i2
//		if (a)
//			i3 += acc1[a] * 7;
		if (a && a != 3)				// ! nat
			i3 += a * 7;

		/* accidental */
		i1 = (Math.floor((i3 + 1 + 21) / 7) + 2 - 3 + 32 * 5) % 5;
		a = acc2[i1]
		if (curvoice.ckey.k_none) {
			var other_acc = acc_same_pitch(note.pit)

			switch (note.acc) {
			case undefined:
				if (other_acc || a == 3)	// nat
					continue
				break
			case 3:					// nat
				break
			default:
// this sequence may be removed for:
// "Always set natural accidentals when transposing K:none (modified in 7.5.3)"
// (David Lacroix's request...)
				if (!other_acc) {
					if (a == 3)		// nat
						a = undefined
				} else {
					if (a == other_acc)
						a = undefined
				}
				break
			}
		} else if (note.acc) {
			;
		} else if (curvoice.ckey.a_acc) {	/* acc list */
			i4 = cgd2cde[(i3 + 16 * 7) % 7]
			for (j = 0; j < curvoice.ckey.a_acc.length; j++) {
				if ((i4 + 16 * 7 - curvoice.ckey.a_acc[j].pits) % 7
							== 0)
					break
			}
			if (j < curvoice.ckey.a_acc.length)
				continue
		} else {
			continue
		}
		i1 = note.acc;
		d = note.micro_d
		if (d					/* microtone */
		 && i1 != a) {				/* different accidental type */
//fixme: strange code !!!
			if (a == 3) {			// nat
/*fixme:should treat the double sharps/flats*/
				n = note.micro_n
				if (n >= d) {
					n -= d;
					a = i1
				} else {
					n = d - n;	// sh <-> ft
					a = i1 == 1 ? -1 : 1
				}
				note.micro_n = n
			}
		}
		note.acc = a
	}
}

/* -- get staves definition (%%staves / %%score) -- */
function get_staves(cmd, param) {
	var s, p_voice, p_voice2, i, flags, v, st, p_flags, a_flags, range;

	compr_voice();
	dupl_voice()

	/* create a new staff system */
	var	maxtime = 0,
		no_sym = true
	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		if (p_voice.time > maxtime)
			maxtime = p_voice.time
		if (p_voice.sym)
			no_sym = false
	}
	if (no_sym				/* if first %%staves */
	 || (maxtime == 0 && staves_found < 0)) {
		for (v = 0; v < par_sy.voices.length; v++)
			par_sy.voices[v].range = -1
//		curvoice = voice_tb[0]
	} else if (staves_found != maxtime) {	// if no 2 %%staves
// fixme: problem if 2 %%staves and no common voice with previous %%staves

		/*
		 * create a new staff system and
		 * link the 'staves' symbol in a voice which is seen from
		 * the previous system - see sort_all
		 */
		for (v = 0; v < par_sy.voices.length; v++) {
			if (par_sy.voices[v].range >= 0) {
				curvoice = voice_tb[v]
				break
			}
		}
		curvoice.time = maxtime;
		s = {
			type: STAVES
		}
		sym_link(s);		/* link the staves in this voice */
		par_sy.nstaff = nstaff;
		new_system()
	}
	staves_found = maxtime;

	a_flags = parse_staves(param)
	if (!a_flags)
		return

	/* initialize the (old) voices */
	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		delete p_voice.second
		delete p_voice.ignore;
		p_voice.time = maxtime
	}
	range = 0;
	par_sy.top_voice = a_flags[0].v
	for (i = 0; i < a_flags.length; i++) {
		p_flags = a_flags[i];
		v = p_flags.v;
		p_voice = voice_tb[v];
//		if (!par_sy.voices[v]) {
//			par_sy.voices[v] = {
//				v: v,
//				range: -1,
//			}
//		}

		// if the voice is already here, clone it
		if (par_sy.voices[v].range >= 0) {
			p_voice2 = clone(p_voice);
			par_sy.voices[voice_tb.length] = clone(par_sy.voices[v]);
			v = voice_tb.length;
			p_voice2.v = v;
			p_voice2.sym = p_voice2.last_sym = null;
			p_voice2.time = maxtime;
			voice_tb.push(p_voice2)
			delete p_voice2.clone
			while (p_voice.clone)
				p_voice = p_voice.clone;
			p_voice.clone = p_voice2;
			p_voice = p_voice2;
			p_flags.v = v
		}
		par_sy.voices[v].range = range++
	}

	/* change the behavior from %%staves to %%score */
	if (cmd[1] == 't') {				/* if %%staves */
		for (i = 0; i < a_flags.length; i++) {
			p_flags = a_flags[i];
			flags = p_flags.flags
			if (!(flags & (OPEN_BRACE | OPEN_BRACE2)))
				continue
			if ((flags & (OPEN_BRACE | CLOSE_BRACE))
					== (OPEN_BRACE | CLOSE_BRACE)
			 || (flags & (OPEN_BRACE2 | CLOSE_BRACE2))
					== (OPEN_BRACE2 | CLOSE_BRACE2))
				continue
			if (a_flags[i + 1].flags != 0)
				continue
			if ((flags & OPEN_PARENTH)
			 || (a_flags[i + 2].flags & OPEN_PARENTH))
				continue

			/* {a b c} -> {a *b c} */
			if (a_flags[i + 2].flags & (CLOSE_BRACE | CLOSE_BRACE2)) {
				a_flags[i + 1].flags |= FL_VOICE;

			/* {a b c d} -> {(a b) (c d)} */
			} else if (a_flags[i + 2].flags == 0
				&& (a_flags[i + 3].flags & (CLOSE_BRACE | CLOSE_BRACE2))) {
				p_flags.flags |= OPEN_PARENTH;
				a_flags[i + 1].flags |= CLOSE_PARENTH;
				a_flags[i + 2].flags |= OPEN_PARENTH;
				a_flags[i + 3].flags |= CLOSE_PARENTH
			}
		}
	}

	/* set the staff system */
	st = -1
	for (i = 0; i < a_flags.length; i++) {
		p_flags = a_flags[i];
		flags = p_flags.flags
		if ((flags & (OPEN_PARENTH | CLOSE_PARENTH))
				== (OPEN_PARENTH | CLOSE_PARENTH)) {
			flags &= ~(OPEN_PARENTH | CLOSE_PARENTH);
			p_flags.flags = flags
		}
		v = p_flags.v;
		p_voice = voice_tb[v]
		if (flags & FL_VOICE) {
			p_voice.floating = true;
			p_voice.second = true
		} else {
			st++;
			if (!par_sy.staves[st]) {
				par_sy.staves[st] = {
					stafflines: '|||||',
					staffscale: 1
				}
			}
			par_sy.staves[st].flags = 0
		}
		p_voice.st = p_voice.cst =
				par_sy.voices[v].st = st;
		par_sy.staves[st].flags |= flags
		if (flags & OPEN_PARENTH) {
			p_voice2 = p_voice
			while (i < a_flags.length - 1) {
				p_flags = a_flags[++i];
				v = p_flags.v;
				p_voice = voice_tb[v];
				if (p_flags.flags & MASTER_VOICE) {
					p_voice2.second = true
					p_voice2 = p_voice
				} else {
					p_voice.second = true;
				}
				p_voice.st = p_voice.cst
						= par_sy.voices[v].st
						= st
				if (p_flags.flags & CLOSE_PARENTH)
					break
			}
			par_sy.staves[st].flags |= p_flags.flags
		}
	}
	if (st < 0)
		st = 0
	par_sy.nstaff = nstaff = st

	/* change the behaviour of '|' in %%score */
	if (cmd[1] == 'c') {				/* if %%score */
		for (st = 0; st <= nstaff; st++)
			par_sy.staves[st].flags ^= STOP_BAR
	}

	for (v = 0; v < voice_tb.length; v++) {
		if (par_sy.voices[v].range < 0)
			continue
		p_voice = voice_tb[v];
		par_sy.voices[v].second = p_voice.second;
//		par_sy.voices[v].clef = p_voice.clef;
		st = p_voice.st
		if (st > 0 && !p_voice.norepbra
		 && !(par_sy.staves[st - 1].flags & STOP_BAR))
			p_voice.norepbra = true
				;
//		par_sy.staves[st].clef = p_voice.clef
	}
	curvoice = voice_tb[par_sy.top_voice]
}

/* -- get a voice overlay -- */
function get_vover(type) {

	// get a voice or create a clone of the current voice
	function clone_voice(id) {
		var v, p_voice

		for (v = 0; v < voice_tb.length; v++) {
			p_voice = voice_tb[v]
			if (p_voice.id == id)
				return p_voice		// found
		}
		p_voice = clone(curvoice);
		p_voice.v = voice_tb.length;
		p_voice.id = id;
		p_voice.pos = clone(curvoice.pos);
		p_voice.sym = p_voice.last_sym = null;

		p_voice.nm = null;
		p_voice.snm = null;
		p_voice.lyric_restart = p_voice.lyric_restart =
			p_voice.lyric_cont = null;

		voice_tb.push(p_voice)
		return p_voice
	}

	var	line = parse.line,
		p_voice2, p_voice3, range, v, v2, v3

	/* treat the end of overlay */
	if (curvoice.ignore)
		return
	if (type == '|'
	 || type == ')')  {
		curvoice.last_sym.beam_end = true
		if (!vover) {
			line.error("Erroneous end of voice overlap")
			return
		}
		if (curvoice.time != vover.mxtime)
			line.error("Wrong duration in voice overlay");
		curvoice = vover.p_voice;
		vover = null
		return
	}

	/* treat the full overlay start */
	if (type == '(') {
		if (vover) {
			line.error("Voice overlay already started")
			return
		}
		vover = {			// no voice yet
			time: curvoice.time
		}
		return
	}

	/* (here is treated a new overlay - '&') */
	/* create the extra voice if not done yet */
	if (!curvoice.last_note) {
		line.error("No note before start of voice overlay")
		return
	}
//--fixme?
//	curvoice.last_sym.beam_end = true
	curvoice.last_note.beam_end = true;
	p_voice2 = curvoice.voice_down
	if (!p_voice2) {
		p_voice2 = clone_voice(curvoice.id + 'o');
//		p_voice2.voice_up = curvoice;
		curvoice.voice_down = p_voice2;
		p_voice2.time = 0;
		p_voice2.second = true;
		v2 = p_voice2.v;
		par_sy.voices[v2] = {
			st: curvoice.st,
			second: true,
			scale: curvoice.scale,
			transpose: curvoice.transpose,
			key: curvoice.key,
			ckey: curvoice.ckey,
			okey: curvoice.okey,
			pos: p_voice2.pos
		}
		var f_clone = curvoice.clone != undefined ? 1 : 0;
		range = par_sy.voices[curvoice.v].range
		for (v = 0; v < par_sy.voices.length; v++) {
			if (par_sy.voices[v].range > range)
				par_sy.voices[v].range += f_clone + 1
		}
		par_sy.voices[v2].range = range + 1
		if (f_clone) {
			p_voice3 = clone_voice(p_voice2.id + 'c');
			p_voice3.second = true;
			v3 = p_voice3.v;
			par_sy.voices[v3] = {
				second: true,
				scale: curvoice.clone.scale,
				range: range + 2
			}
			p_voice2.clone = p_voice3
		}
	}
//--fixme: in abcparse.c curvoice ulen and microscale are forced here
	p_voice2.ulen = curvoice.ulen
	if (curvoice.microscale)
		p_voice2.microscale = curvoice.microscale
//--fixme:, but not the scale, pos...
	
//	v = curvoice.v
//	v2 = p_voice2.v
//	p_voice2.cst = p_voice2.st = par_sy.voices[v2].st
//			= par_sy.voices[v].st
//	p_voice3 = p_voice2.clone
//	if (p_voice3) {
//		p_voice3.cst = p_voice3.st
//				= par_sy.voices[p_voice3.v].st
//				= par_sy.voices[curvoice.clone.v].st
//	}

	if (!vover) {				/* first '&' in a measure */
		vover = {
			bar: true,
			mxtime: curvoice.time,
			p_voice: curvoice
		}
		var time = p_voice2.time
		for (s = curvoice.last_sym; /*s*/; s = s.prev) {
			if (s.type == BAR
			 || s.time <= time)	/* (if start of tune) */
				break
		}
		vover.time = s.time
	} else {
		if (!vover.p_voice) {		// first '&' in '(&' sequence
			vover.mxtime = curvoice.time;
			vover.p_voice = curvoice
		} else if (curvoice.time != vover.mxtime) {
			line.error("Wrong duration in voice overlay")
		}
	}
	p_voice2.time = vover.time;
	curvoice = p_voice2
}

// check if a clef, key or time signature may go at start of the current voice
function is_voice_sig() {
	if (!curvoice.sym)
		return true		// new voice
	if (curvoice.time != 0)
		return false
	for (s = curvoice.sym; s; s = s.next) {
		switch (s.type) {
		case TEMPO:
		case PART:
		case FORMAT:
			break
		default:
			return false
		}
	}
	return true
}

// treat a clef found in the tune body
function get_clef(s) {
//	var s2, s3
	if (is_voice_sig()) {
//		var sy_voice = par_sy.voices[curvoice.v];
		curvoice.clef = s
//		sy_voice.clef = s
	} else {					// clef change

		/* the clef must appear before a key signature or a bar */
		s2 = curvoice.last_sym
		if (s2 && s2.prev
		 && ((s2.type == KEY && !s2.k_none) || s2.type == BAR)) {
			for (s3 = s2; s3.prev; s3 = s3.prev) {
				switch (s3.prev.type) {
				case KEY:
				case BAR:
					continue
				}
				break
			}
			curvoice.last_sym = s3.prev;
			sym_link(s);
			s.next = s3;
			s3.prev = s;
			curvoice.last_sym = s2
		} else {
			sym_link(s)
		}
		s.clef_small = true
	}
}

function set_voice_param(p_voice) {
	var k

//fixme: microscale in voice?
	if (cfmt.microscale)
		p_voice.microscale = cfmt.microscale
	if (glovar.stafflines != undefined && p_voice.stafflines == undefined)
		p_voice.stafflines = glovar.stafflines
	if (glovar.staffscale)
		p_voice.staffscale = glovar.staffscale
	if (cfmt.transpose && !p_voice.transpose)
		p_voice.transpose = cfmt.transpose
	for (k in parse.voice_param)
		p_voice[k] = parse.voice_param[k]
//	if (parse.voice_param) {
//		if (parse.voice_param.octave)
//			p_voice.octave = parse.voice_param.octave
//		if (parse.voice_param.scale)
//			p_voice.scale = parse.voice_param.scale
//		if (parse.voice_param.stafflines != undefined)
//			p_voice.stafflines = parse.voice_param.stafflines
//		if (parse.voice_param.map)
//			p_voice.map = parse.voice_param.map;
//		if (parse.voice_param.combine)
//			p_voice.combine = parse.voice_param.combine;
//	}
	if (!p_voice.wmeasure)
		p_voice.wmeasure = p_voice.meter.wmeasure
}

// treat K: (key signature + clef)
function get_key_clef(kc) {
	var	v, p_voice, s2,
		s_key = kc[0],
		o_key = clone(s_key),
		s_clef = kc[1]
	if (s_key.k_sf) {
		if (!s_key.k_exp
		 && s_key.k_a_acc)
			set_k_acc(s_key)
	}
	if (parse.state == 1) {			// tune header
		if (s_key.k_sf == undefined && !s_key.k_a_acc)
//fixme: empty K: - should raise a warning
			s_key.k_sf = 0
		if (cfmt.transpose)
			key_transpose(s_key, cfmt.transpose)
		for (v = 0; v < voice_tb.length; v++) {
			p_voice = voice_tb[v];
			p_voice.ckey = s_key;
			p_voice.key = clone(s_key);
			p_voice.okey = o_key;
			p_voice.clef = s_clef || clone(glovar.clef)
			if (s_key.k_none)
				p_voice.key.k_sf = 0
//			if (s_clef) {
//				p_voice.clef = s_clef;
////				par_sy.voices[v].clef = s_clef
//			}
		}
		parse.okey = o_key;
		parse.ckey = s_key
		if (s_clef) {
			glovar.clef = s_clef
		} else {
			glovar.clef.ctx = s_key.ctx;
			glovar.clef.istart = s_key.istart;
			glovar.clef.iend = s_key.iend
		}
		vskip(cfmt.topspace);
		write_heading();
		reset_gen();
		gene.nbar = cfmt.measurefirst	// measure numbering
		return
	}
	if (curvoice.transpose)
		key_transpose(s_key, curvoice.transpose)
	if (s_clef)
		get_clef(s_clef)
	if (is_voice_sig()) {
		if (s_key.k_sf != undefined || s_key.k_a_acc) {
			curvoice.ckey = s_key;
			curvoice.key = clone(s_key)
			if (s_key.k_none)
				curvoice.key.k_sf = 0
		}
		curvoice.okey = o_key
		return
	}
	if (s_key.k_sf == undefined && !s_key.k_a_acc)
		return

	s_key.k_old_sf = curvoice.ckey.k_sf;
	curvoice.okey = o_key;
	curvoice.ckey = s_key;

	/* the key signature must appear before a time signature */
	s2 = curvoice.last_sym
	if (s2 && s2.type == METER) {
		curvoice.last_sym = s2.prev
		if (!curvoice.last_sym)
			curvoice.sym = null;
		sym_link(s_key)
		s_key.next = s2;
		s2.prev = s_key;
		curvoice.last_sym = s2
	} else {
		sym_link(s_key)
	}
}

// get / create a new voice
function new_voice(id) {
	var	p_voice, v,
		n = voice_tb.length

	if (n == 1
	 && voice_tb[0].default) {
		delete voice_tb[0].default
		if (!voice_tb[0].last_sym) {
			p_voice = voice_tb[0];
			p_voice.id = id
			return p_voice		// default voice
		}
	}
	for (v = 0; v < n; v++) {
		p_voice = voice_tb[v]
		if (p_voice.id == id)
			return p_voice		// old voice
	}
	p_voice = {
		v: v,
		id: id,
//		time: 0,
		pos: clone(cfmt.pos),
		scale: 1,
		combine: cfmt.combinevoices,
//		st: 0,
//		cst: 0,
		ulen: glovar.ulen,
		key: clone(parse.ckey),
		ckey: clone(parse.ckey),
		okey: clone(parse.okey),
		meter: clone(glovar.meter),
		clef: clone(glovar.clef),
		hy_st: 0
	}
	if (parse.state == 3)
		set_voice_param(p_voice);

	voice_tb.push(p_voice);

	par_sy.voices[v] = {
		range: -1
	}
	return p_voice
}

// this function is called at program start and on end of tune
function init_tune() {
	nstaff = -1;
	voice_tb = [];
	curvoice = null;
	par_sy = null;
	new_system();
	staves_found = -1;
	parse.voice_param = null;
	gene = {}
}

/* -- treat a 'V:' -- */
function get_voice(text) {
	var	s_clef = parse_voice(text),
		v = curvoice.v
	if (par_sy.voices[v].range < 0) {
		if (cfmt.alignbars) {
			parse.line.error("V: does not work with %%alignbars")
		}
		if (staves_found >= 0)
			curvoice.ignore = true
	}

//	set_tblt(curvoice)

	if (s_clef)
		get_clef(s_clef)
}

// change state from 'tune header after K:' to 'in tune'
function goto_tune() {
	var v, p_voice

	// create the single voice if no voice yet
	if (voice_tb.length == 0) {
		curvoice = new_voice("1");
		curvoice.clef.istart = curvoice.key.istart;
		curvoice.clef.iend = curvoice.key.iend;
		nstaff = 0;
		curvoice.time = 0;
		curvoice.default = true
	} else if (staves_found < 0) {
		curvoice = voice_tb[0]
	} else {
		curvoice = voice_tb[par_sy.top_voice]
	}

	// update some voice parameters
	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v];
		p_voice.ulen = glovar.ulen
		if (p_voice.key.k_bagpipe
		 && p_voice.pos.ste == 0)
			p_voice.pos.ste = SL_BELOW
		if (p_voice.key.k_none)
			p_voice.key.k_sf = 0;
		set_voice_param(p_voice)
	}

	// initialize the voices when no %%staves/score	
	if (staves_found < 0) {
		nstaff = voice_tb.length - 1
		for (v = 0; v <= nstaff; v++) {
			p_voice = voice_tb[v];
			p_voice.st = p_voice.cst = v;
			par_sy.voices[v].st = v;
			par_sy.voices[v].range = v;
			par_sy.staves[v] = {
				stafflines: '|||||',
				staffscale: 1
			}
		}
		par_sy.nstaff = nstaff
	}
	parse.state = 3			// in tune
	if (!curvoice.last_sym
	 && parse.voice_opts)
		voice_filter()
}
// abc2svg - lyrics.js - lyrics
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

/* -- parse a lyric (vocal) line (w:) -- */
function get_lyrics(text, cont) {
	var s, word, p, i, ly

	if (curvoice.ignore)
		return
	if (curvoice.pos.voc != SL_HIDDEN)
		curvoice.have_ly = true

	// get the starting symbol of the lyrics
	if (cont) {					// +:
		s = curvoice.lyric_cont
		if (!s) {
			parse.line.error("+: lyric without music")
			return
		}
	} else {
		set_font("vocal")
		if (curvoice.lyric_restart) {		// new music
			curvoice.lyric_start = s = curvoice.lyric_restart;
			curvoice.lyric_restart = null;
			curvoice.lyric_line = 0
		} else {
			curvoice.lyric_line++
			s = curvoice.lyric_start
		}
		if (!s)
			s = curvoice.sym
		if (!s) {
			parse.line.error("w: without music")
			return
		}
	}

	/* scan the lyric line */
	p = text;
	i = 0
	while (1) {
		while (p[i] == ' ' || p[i] == '\t')
			i++
		if (!p[i])
			break
		switch (p[i]) { 
		case '|':
			while (s && s.type != BAR)
				s = s.next
			if (!s) {
				parse.line.error(
					"Not enough bar lines for lyric line")
				return
			}
			s = s.next;
			i++
			continue
		case '-':
			word = "-\n"
			break
		case '_':
			word = "_\n"
			break
		case '*':
			word = null
			break
		default:
			if (p[i] == '\\'
			 && i == p.length - 1) {
				curvoice.lyric_cont = s
				return
			}
			word = ""
			while (1) {
				if (!p[i])
					break
				switch (p[i]) {
				case '_':
				case '*':
				case '|':
					i--
				case ' ':
				case '\t':
					break
				case '~':
					word += ' ';
					i++
					continue
				case '-':
					word += "\n"
					break
				case '\\':
					word += p[++i];
					i++
					continue
				default:
					word += p[i];
					i++
					continue
				}
				break
			}
			break
		}

		/* store the word in the next note */
		while (s && (s.type != NOTE || s.grace))
			s = s.next
		if (!s) {
			parse.line.error("Too many words in lyric line")
			return
		}
		if (word &&
		    s.pos.voc != SL_HIDDEN) {
			if (word.match(/^\$\d/)) {
				if (word[1] == '0')
					set_font("vocal")
				else
					set_font("u" + word[1]);
				word = word.slice(2)
			}
			ly = {
				t:word,
				font: gene.curfont,
				w: strw(word)
			}
			if (!s.a_ly)
				s.a_ly = []
			s.a_ly[curvoice.lyric_line] = ly
		}
		s = s.next;
		i++
	}
	curvoice.lyric_cont = s
}

/* -- set the width needed by the lyrics -- */
function ly_width(s, wlw) {
	var	ly, sz,
//		tblt,
		swfac, align, xx, w, i, j, k, shift, p,
		a_ly = s.a_ly;

	/* check if the lyrics contain tablature definition */
//	if (voice_tb[s.v].tblts) {
//		for (i = 0; i < voice_tb[s.v].tblts.length; i++) {
//			tblt = voice_tb[s.v].tblts[i]
//			if (!tblt.pit) {		/* yes, no width */
//				for (i = 0; i < a_ly.length; i++) {
//					ly = a_ly[i]
//					ly.shift = 0
//				}
//				return wlw
//			}
//		}
//	}

	align = 0
	for (i = 0; i < a_ly.length; i++) {
		ly = a_ly[i]
		if (!ly)
			continue
		p = ly.t;
		w = ly.w;
		swfac = ly.font.swfac;
		xx = w + 2 * cwid(' ') * swfac
		if ((p[0] >= '0' && p[0] <= '9' && p.length > 2)
		 || p[1] == ':'
		 || p[0] == '(' || p[0] == ')') {
			if (p[0] == '(') {
				sz = cwid('(') * swfac
			} else {
				j = p.indexOf(' ');
				gene.curfont = gene.deffont = ly.font
				if (j > 0)
					sz = strw(p.slice(0, j))
				else
					sz = w
			}
			shift = (w - sz + 2 * cwid(' ') * swfac) * 0.4
			if (shift > 20)
				shift = 20;
			shift += sz
			if (ly.t[0] >= '0' && ly.t[0] <= '9') {
				if (shift > align)
					align = shift
			}
		} else if (p == "-\n" || p == "_\n") {
			shift = 0
		} else {
			shift = xx * 0.4
			if (shift > 20)
				shift = 20
		}
		ly.shift = shift
		if (wlw < shift)
			wlw = shift;
//		if (p[p.length - 1] == "\n")		// if "xx-"
//			xx -= cwid(' ') * swfac
		xx -= shift;
		shift = 2 * cwid(' ') * swfac
		for (k = s.next; k; k = k.next) {
			switch (k.type) {
			case NOTE:
			case REST:
				if (!k.a_ly || !k.a_ly[i]
				 || k.a_ly[i].w == 0)
					xx -= 9
				else if (k.a_ly[i].t == "-\n"
				      || k.a_ly[i].t == "_\n")
					xx -= shift
				else
					break
				if (xx <= 0)
					break
				continue
			case CLEF:
			case METER:
			case KEY:
				xx -= 10
				continue
			default:
				xx -= 5
				break
			}
			break
		}
		if (xx > s.wr)
			s.wr = xx
	}
	if (align > 0) {
		for (i = 0; i < a_ly.length; i++) {
			ly = a_ly[i]
			if (ly.t[0] >= '0' && ly.t[0] <= '9')
				ly.shift = align
		}
	}
	return wlw
}

/* -- draw the lyrics under (or above) notes -- */
/* (the staves are not yet defined) */
/* !! this routine is tied to ly_width() !! */
function draw_lyrics(p_voice, nly, y,
				incr) {	/* 1: below, -1: above */
	var	j, l, p, lastx, w, lskip, s, f, ly, lyl,
		hyflag, lflag, x0, Y, top, font, shift, desc

	/* check if the lyrics contain tablatures */
//--fixme: dble check needed?
//	if (p_voice.tblts[0]) {
//		if (p_voice.tblts[0].pit == 0)
//			return y		/* yes */
//		if (p_voice.tblts[1]
//		 && p_voice.tblts[1].pit == 0)
//			return y		/* yes */
//	}

/*fixme: may not be the current font*/
	set_font("vocal");
	font = gene.curfont
	if (incr > 0) {				/* under the staff */
		j = 0;
		y -= font.size
		if (y > -cfmt.vocalspace)
			y = -cfmt.vocalspace
	} else {
		top = staff_tb[p_voice.st].topbar;
		j = nly - 1;
		nly = -1
		if (y < top + cfmt.vocalspace - font.size)
			y = top + cfmt.vocalspace - font.size
	}
	desc = font.size * .25				/* descent */
	for (; j != nly ; j += incr) {
//		Y = '!Y' + p_voice.st + ' ' + (y + desc).toFixed(2) + '!'
		Y = y + desc
		if (p_voice.hy_st & (1 << j)) {
			hyflag = true;
			p_voice.hy_st &= ~(1 << j)
		}
		for (s = p_voice.sym; /*s*/; s = s.next)
			if (s.type != CLEF
			 && s.type != KEY && s.type != METER)
				break
		if (s.prev)
			lastx = s.prev.x
		else
//			lastx = 0
			tsfirst.x
		x0 = 0;
		lskip = font.size * 1.1
		for ( ; s; s = s.next) {
			if (s.a_ly)
				ly = s.a_ly[j]
			else
				ly = null
			if (!ly) {
				switch (s.type) {
				case REST:
				case MREST:
					if (lflag) {
						out_wln(lastx + 3, Y, x0 - lastx);
						lflag = false;
						lastx = s.x + s.wr
					}
				}
				continue
			}
			if (ly.font != font) {		/* font change */
				gene.curfont = gene.deffont = font = ly.font
				if (lskip < font.size * 1.1)
					lskip = font.size * 1.1
			}
			p = ly.t;
			w = ly.w
			shift = ly.shift
			if (hyflag) {
				if (p == "_\n") {		/* '_' */
					p = "-\n"
				} else if (p != "-\n") {	/* not '-' */
					out_hyph(lastx, Y, s.x - shift - lastx);
					hyflag = false;
					lastx = s.x + s.wr
				}
			}
			if (lflag
			 && p != "_\n") {		/* not '_' */
				out_wln(lastx + 3, Y, x0 - lastx + 3);
				lflag = false;
				lastx = s.x + s.wr
			}
			if (p == "-\n"			/* '-' */
			 || p == "_\n") {		/* '_' */
				if (x0 == 0 && lastx > s.x - 18)
					lastx = s.x - 18
				if (p[0] == '-')
					hyflag = true
				else
					lflag = true;
				x0 = s.x - shift
				continue
			}
			x0 = s.x - shift;
			l = p.length - 1
			if (p[l] == '\n') {		/* '-' at end */
				p = p.slice(0, l);
				hyflag = true
			}
//			xy_str(x0, [p_voice.st, (y + desc).toFixed(2)], p);
			xy_str(x0, Y, p);
			lastx = x0 + w
		}
		if (hyflag) {
			hyflag = false;
			x0 = realwidth - 10
			if (x0 < lastx + 10)
				x0 = lastx + 10;
			out_hyph(lastx, Y, x0 - lastx)
			if (cfmt.hyphencont)
				p_voice.hy_st |= (1 << j)
		}

		/* see if any underscore in the next line */
//		for (s = tsnext; s; s = s.ts_next)
//			if (s.v == p_voice.v)
//				break
//		for ( ; s; s = s.next) {
		for (p_voice.s_next ; s; s = s.next) {
			if (s.type == NOTE) {
				if (!s.a_ly)
					break
				ly = s.a_ly[j]
				if (ly
				 && ly.t == "_\n") {
					lflag = true;
					x0 = realwidth - 15
					if (x0 < lastx + 12)
						x0 = lastx + 12
				}
				break
			}
		}
		if (lflag) {
			out_wln(lastx + 3, Y, x0 - lastx + 3);
			lflag = false
		}
		if (incr > 0)
			y -= lskip
		else
			y += lskip
	}
	if (incr > 0)
		y += lskip
	return y
}

/* -- work out accidentals to be applied to each note -- */
/* returns the accidentals (7 notes) */
function setmap(sf) {	/* number of sharps/flats in key sig (-7 to +7) */
	var map = [0, 0, 0, 0, 0, 0, 0]
	switch (sf) {
	case 7: map[6] = A_SH
	case 6: map[2] = A_SH
	case 5: map[5] = A_SH
	case 4: map[1] = A_SH
	case 3: map[4] = A_SH
	case 2: map[0] = A_SH
	case 1: map[3] = A_SH
		break
	case -7: map[3] = A_FT
	case -6: map[0] = A_FT
	case -5: map[4] = A_FT
	case -4: map[1] = A_FT
	case -3: map[5] = A_FT
	case -2: map[2] = A_FT
	case -1: map[6] = A_FT
		break
	}
	return map
}

/* output a tablature string escaping the parenthesis */
//function tbl_out(str, x, y, f) {
//--fixme
//	char *p
//
//	a2b("(")
//	p = str
//	while (1) {
//		while (*p != '\0' && *p != '(' && *p != ')' )
//			p++
//		if (p != s) {
//			a2b("%.*s", (int) (p - s), s)
//			s = p
//		}
//		if (*p == '\0')
//			break
//		a2b("\\")
//		p++
//	}
//	a2b(")%.1f y %d %s ", x, j, f)
//}

/* -- draw the tablature with w: -- */
//function draw_tblt_w(p_voice, nly, y, tblt) {
//	var s
//	var ly
//	var lyl
//--fixme
//	char *p
//	var j
//
//	a2b("/y{%.1f y%d}def ", y, p_voice.st)
//--fixme
//	set_font(VOCALFONT)
//	a2b("%.1f 0 y %d %s\n", realwidth, nly, tblt.head)
//	for (j = 0; j < nly ; j++) {
//		for (s = p_voice.sym; s; s = s.next) {
//			ly = s.a_ly[j]
//			if (!ly) {
//				if (s.type == BAR) {
//					if (!tblt.bar)
//						continue
//					var bar_type = bar_cnv(s.bar_type)
//					tbl_out(bar_type, s.x, j, tblt.bar)
//				}
//				continue
//			}
//			tbl_out(ly.t, s.x, j, tblt.note)
//		}
//		a2b("\n")
//	}
//}

/* -- draw the tablature with automatic pitch -- */
//var note_scale = [0, 2, 4, 5, 7, 9, 11]	/* index = natural note */

//function draw_tblt_p(p_voice, y, tblt) {
//	var s
//	var j, pitch, octave, tied, acc
//--fixme
//	unsigned char workmap[70]	/* sharps/flats - base: lowest 'C' */
//
//	var sf = p_voice.k_sf
//	var basemap = setmap(sf)
//--fixme
//	for (j = 0; j < 10; j++)
//		memcpy(&workmap[7 * j], basemap, 7)
//	a2b("gsave 0 %.1f y%d T(%.2s)%s\n",
//		y, p_voice.st,
//		tblt.instr, tblt.head)
//	tied = false
//	for (s = p_voice.sym; s; s = s.next) {
//		switch (s.type) {
//		case REST:
//			continue
//		case NOTE:
//			if (tied) {
//				tied = s.notes[0].ti1
//				continue
//			}
//			break
//		case KEY:
//			sf = s.k_sf
//			basemap = setmap(sf)
//			for (j = 0; j < 10; j++)
//				memcpy(&workmap[7 * j], basemap, 7)
//			continue
//		case BAR:
//			if (s.invisible)
//				continue
//			for (j = 0; j < 10; j++)
//				memcpy(&workmap[7 * j], basemap, 7)
//			continue
//		default:
//			continue
//		}
//		var pit = s.notes[0].pit + 19
//		acc = s.notes[0].acc
//		if (acc != 0) {
//			workmap[pit] = acc == "nt"
//					? A_NULL
//					: (acc & 0x07)
//		}
//		switch (workmap[pit]) {
//		case "sh": pitch = 1; break
//		case "nt": pitch = 0; break
//		case "ft": pitch = -1; break
//		case "dsh": pitch = 2; break
//		default : pitch = -2; break
//		}
//		pitch += scale[pit % 7]
//			+ 12 * (pit / 7)
//			- tblt.pit
//		octave = 0
//		while (pitch < 0) {
//			pitch += 12
//			octave--
//		}
//		while (pitch >= 36) {
//			pitch -= 12
//			octave++
//		}
//		a2b("%d %d %.2f %s\n", octave, pitch, s.x, tblt.note)
//		tied = s.notes[0].ti1
//	}
//	a2b("grestore\n")
//}

/* -- draw all the lyrics and the tablatures -- */
/* (the staves are not yet defined) */
function draw_all_lyrics() {
	var	p_voice, s, v, nly, i, x, y, w,
		lyst_tb = new Array(nstaff),
		nly_tb = new Array(voice_tb.length),
		above_tb = new Array(voice_tb.length),
		rv_tb = new Array(voice_tb.length),
		top = 0,
		bot = 0,
		st = -1

	/* compute the number of lyrics per voice - staff
	 * and their y offset on the staff */
	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		if (!p_voice.sym)
			continue
		if (p_voice.st != st) {
			top = 0;
			bot = 0;
			st = p_voice.st
		}
		nly = 0
		if (p_voice.have_ly) {
			for (s = p_voice.sym; s; s = s.next) {
				var a_ly = s.a_ly
				if (!a_ly || !a_ly[0])
					continue
/*fixme:should get the real width*/
				x = s.x
				if (a_ly[0].w != 0) {
					x -= a_ly[0].shift;
					w = a_ly[0].w
				} else {
					w = 10
				}
				y = y_get(p_voice.st, 1, x, w)
				if (top < y)
					top = y;
				y = y_get(p_voice.st, 0, x, w)
				if (bot > y)
					bot = y
				if (nly < a_ly.length)
					nly = a_ly.length
			}
		} else {
			y = y_get(p_voice.st, 1, 0, realwidth)
			if (top < y)
				top = y;
			y = y_get(p_voice.st, 0, 0, realwidth)
			if (bot > y)
				bot = y
		}
		if (!lyst_tb[st])
			lyst_tb[st] = {}
		lyst_tb[st].top = top;
		lyst_tb[st].bot = bot;
		nly_tb[v] = nly
		if (nly == 0)
			continue
		if (p_voice.pos.voc != 0)
			above_tb[v] = p_voice.pos.voc == SL_ABOVE
		else if (voice_tb[p_voice.v + 1]
/*fixme:%%staves:KO - find an other way..*/
		      && voice_tb[p_voice.v + 1].st == st
		      && voice_tb[p_voice.v + 1].have_ly)
			above_tb[v] = true
		else
			above_tb[v] = false
		if (above_tb[v])
			lyst_tb[st].a = true
		else
			lyst_tb[st].b = true
	}

	/* draw the lyrics under the staves */
	i = 0
	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		if (!p_voice.sym)
			continue
		if (!p_voice.have_ly)
//		 && !p_voice.tblts)
			continue
		if (above_tb[v]) {
			rv_tb[i++] = v
			continue
		}
		st = p_voice.st;
//test alex- KO
//		output = staff_tb[st].output;
		set_dscale(st)
//		set_scale(p_voice.sym)
		if (nly_tb[v] > 0)
			lyst_tb[st].bot = draw_lyrics(p_voice, nly_tb[v],
							 lyst_tb[st].bot, 1)
//		if (p_voice.tblts) {
//			for (nly = 0; nly < p_voice.tblts.length; nly++) {
//				var tblt = p_voice.tblts[nly]
//				if (!tblt)
//					break
//				if (tblt.hu > 0) {
//					lyst_tb[st].bot -= tblt.hu;
//					lyst_tb[st].b = true
//				}
//				if (tblt.pit == 0)
//					draw_tblt_w(p_voice, nly_tb[v],
//						lyst_tb[st].bot, tblt)
//				else
//					draw_tblt_p(p_voice, lyst_tb[st].bot,
//						tblt)
//				if (tblt.ha != 0) {
//					lyst_tb[st].top += tblt.ha;
//					lyst_tb[st].a = true
//				}
//			}
//		}
	}

	/* draw the lyrics above the staff */
	while (--i >= 0) {
		v = rv_tb[i];
		p_voice = voice_tb[v];
		st = p_voice.st;
//		output = staff_tb[st].output;
		set_dscale(st);
//		set_scale(p_voice.sym)
		lyst_tb[st].top = draw_lyrics(p_voice, nly_tb[v],
						 lyst_tb[st].top, -1)
	}

	/* set the max y offsets of all symbols */
	for (v = 0; v < voice_tb.length; v++) {
		p_voice = voice_tb[v]
		if (!p_voice.sym)
			continue
		st = p_voice.st;
//test alex - useless...
//		set_sscale(st)
//		set_scale(p_voice.sym)
		if (lyst_tb[st].a) {
			top = lyst_tb[st].top + 2
			for (s = p_voice.sym.next; s; s = s.next) {
/*fixme: may have lyrics crossing a next symbol*/
				if (s.a_ly) {
/*fixme:should set the real width*/
					y_set(st, 1, s.x - 2, 10, top)
				}
			}
		}
		if (lyst_tb[st].b) {
			bot = lyst_tb[st].bot - 2
			if (nly_tb[p_voice.v] > 0) {
				for (s = p_voice.sym.next; s; s = s.next) {
					if (s.a_ly) {
/*fixme:should set the real width*/
						y_set(st, 0, s.x - 2, 10, bot)
					}
				}
			} else {
				y_set(st, 0, 0, realwidth, bot)
			}
		}
	}
}
// abc2svg - gchord.js - guitar chords
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

/* -- parse a guitar chord / annotation -- */
// 'type' may be a single '"' or a string '"xxx"' created by U:
function parse_gchord(type) {
	var line = parse.line, c, text

	if (type.length > 1) {
		text = type.slice(1, -1)
	} else {
		text = ""
		while (1) {
			c = line.next_char()
			if (c == undefined) {
				line.error("No end of guitar chord")
				return
			}
			if (c == '"')
				break
//			if (c == '\\')
//				c = line.next_char();
			text += c
		}
	}
	if (!gchord)
		gchord = cnv_escape(text)
	else
		gchord += "\n" + cnv_escape(text)
}

// replace # b = by accidental in guitar chord
function gch_acc(str, c_gch, acc) {
	var	i = 1, i2

	while (1) {
		i = str.indexOf(c_gch, i)
		if (i < 0)
			break
		if (str[i - 1] == '\\') {
			if (i == 2 || str[i - 3] == '/') {
				str = str.slice(0, i - 1) + str.slice(i)
			} else {
				str = str.slice(0, i - 1) + acc + str.slice(i + 1)
			}
		} else if (i == 1 || str[i - 2] == '/') {
			str = str.slice(0, i) + acc + str.slice(i + 1)
		}
		i++
	}
	return str
}

/* transpose a guitar chord */
const	note_names = "CDEFGAB",
	latin_names = [ "Do", "Ré", "Mi", "Fa", "Sol", "La", "Si" ],
	acc_name = ["bb", "b", "", "#", "##"]

function gch_transpose(s) {
	var	p, q, new_txt, l, latin,
		n, i1, i2, i3, i4, gch, ix, a, ip, ip2

	/* skip the annotations */
	for (ix = 0; ix < s.a_gch.length; ix++) {
		gch = s.a_gch[ix]
		if (gch.type == 'g')
			break
	}

	if (ix >= s.a_gch.length)
		return

	/* main chord */
	p = gch.text;
	latin = 0
	switch (p[0]) {
	case 'A':
	case 'B':
		n = p.charCodeAt(0) - 'A'.charCodeAt(0) + 5
		break
	case 'C':
	case 'E':
	case 'G':
		n = p.charCodeAt(0) - 'C'.charCodeAt(0)
		break
	case 'D':
		if (p[1] == 'o') {
			latin = 1;
			n = 0		/* Do */
			break
		}
		n = 1
		break
	case 'F':
		if (p[1] == 'a')
			latin = 1;	/* Fa */
		n = 3
		break
	case 'L':
		latin = 1;		/* La */
		n = 5
		break
	case 'M':
		latin = 1;		/* Mi */
		n = 2
		break
	case 'R':
		latin = 1
		if (p[1] != 'e')
			latin++;	/* Ré */
		n = 1			/* Re */
		break
	case 'S':
		latin = 1
		if (p[1] == 'o') {
			latin++;
			n = 4		/* Sol */
		} else {
			n = 6		/* Si */
		}
		break
	default:
		return
	}

	i2 = curvoice.ckey.k_sf - curvoice.okey.k_sf;
	i1 = cde2fcg[n];			/* fcgdaeb */
	a = 0;
	ip = latin + 1
	if (p[ip] == '#') {
		a++;
		ip++
		if (p[ip] == '#') {
			a++;
			ip++
		}
	} else if (p[ip] == 'b') {
		a--;
		ip++
		if (p[ip] == 'b') {
			a--;
			ip++
		}
	} else if (p[ip] == '=') {
		ip++
	}
	i3 = i1 + i2 + a * 7;
	i4 = cgd2cde[(i3 + 16 * 7) % 7]
	if (!latin)
		new_txt = note_names[i4]
	else
		new_txt = latin_names[i4];
	i1 = (Math.floor((i3 + 1 + 21) / 7) + 2 - 3 + 32 * 5) % 5;	/* accidental */
	new_txt += acc_name[i1];

	ip2 = p.indexOf('/', ip)
	if (ip2 < 0) {
		gch.text = new_txt + p.slice(ip)
		return
	}

	/* bass */
	n = note_names.indexOf(p[++ip2])
	if (n < 0) {
		gch.text = new_txt + p.slice(ip)
		return
	}
//fixme: latin names not treated
	new_txt += p.slice(ip, ip2);
	i1 = cde2fcg[n]				/* fcgdaeb */
	if (p[++ip2] == '#') {
		a = 1;
		ip2++
	} else if (p[ip2] == 'b') {
		a = -1;
		ip2++
	} else {
		a = 0
	}
	i3 = i1 + i2 + a * 7;
	i4 = cgd2cde[(i3 + 16 * 7) % 7];
	new_txt += note_names[i4];
	i1 = (Math.floor((i3 + 1 + 21) / 7) + 2 - 3 + 32 * 5) % 5;
	new_txt += acc_name[i1];
	gch.text = new_txt + p.slice(ip2)
}

/* -- build the guitar chords / annotations -- */
function gch_build(s) {
	if (curvoice.pos.gch == SL_HIDDEN)
		return

	/* split the guitar chords / annotations
	 * and initialize their vertical offsets */
	var	src, gch, w, xspc, x_abs, y_abs, ix, n,
		pos = curvoice.pos.gch == SL_BELOW ? -1 : 1,
		gch_font = get_font("gchord"),
		ann_font = get_font("annotation"),
		h_gch = gch_font.size,
		h_ann = ann_font.size,
		y_above = 0,
		y_below = 0,
		y_left = 0,
		y_right = 0,
		box = cfmt.gchordbox,
		sep = '\n';

	s.a_gch = []
	src = new scanBuf();
	src.buffer = gchord;
	src.index = 0
	while (1) {
		c = src.char()
		if (!c)
			break
		gch = {
			text: ""
		}
		if (sep != 'n' && "^_<>@".indexOf(c) >= 0) {
			antype = c;
			c = src.next_char()
			if (antype == '@') {
				x_abs = src.get_float();
				c = src.char()
				if (c != ',') {
					error(1, s, "Error in annotation \"@\"");
					y_abs = 0
				} else {
					src.advance();
					y_abs = src.get_float();
					c = src.char()
					if (c == ' ')
						c = src.next_char()
				}
			}
		} else if (sep == '\n') {
			antype = 'g'
		}
		if (antype == 'g') {
			gch.font = gch_font;
			gch.box = box
		} else {
			gch.font = ann_font
		}
		gch.type = antype
		switch (antype) {
		default:				/* guitar chord */
			if (pos < 0)
				break			/* below */
			y_above += h_gch
			if (box)
				y_above += 2
			break
		case '^':				/* above */
			y_above += h_ann
			break
		case '_':				/* below */
			break
		case '<':				/* left */
			y_left += h_ann * 0.5
			break
		case '>':				/* right */
			y_right += h_ann * 0.5
			break
		case '@':				/* absolute */
			gch.x = x_abs;
			gch.y = y_abs;
			y_abs -= h_ann
			break
		}
		for (;;) {
			switch (c) {
			case '\\':
				c = src.next_char()
				if (c == 'n')
					break
				gch.text += '\\'
			default:
				gch.text += c;
				c = src.next_char()
				continue
			case '&':			/* skip "&xxx;" */
				while (1) {
					gch.text += c;
					c = src.next_char()
					switch (c) {
					default:
						continue
					case ';':
					case undefined:
					case '\n':
					case '\\':
						break
					}
					break
				}
				if (c == ';') {
					gch.text += c;
					c = src.next_char()
					continue
				}
				break
			case undefined:
			case ';':
			case '\n':
				break
			}
			break
		}
		s.a_gch.push(gch)
		if (!c)
			break
		sep = c;
		src.advance()
	}
	if (curvoice.transpose)
		gch_transpose(s)

	/* change the accidentals in the guitar chords */
	const GCHPRE = 0.4;		// portion of guitar chord before note
	n = s.a_gch.length
	for (ix = 0; ix < n; ix++) {
		gch = s.a_gch[ix]
		if (gch.type == 'g') {
			if (gch.text.indexOf('#'))
				gch.text = gch_acc(gch.text, '#', "\u266f")
			if (gch.text.indexOf('b'))
				gch.text = gch_acc(gch.text, 'b', "\u266d")
			if (gch.text.indexOf('='))
				gch.text = gch_acc(gch.text, '=', "\u266e")
		}

		/* set the offsets and widths */
//*fixme:utf8 (?)
		if (gch.type == '@' && !user.anno_start)
			continue		/* no width */
		gene.curfont = gch.font;
		w = strw(gch.text);
		gch.w = w //+ 4
		switch (gch.type) {
		case '@':
			break
		case '_':			/* below */
			xspc = w * GCHPRE
			if (xspc > 8)
				xspc = 8;
			gch.x = -xspc;
			y_below -= h_ann;
			gch.y = y_below
			break
		case '^':			/* above */
			xspc = w * GCHPRE
			if (xspc > 8)
				xspc = 8;
			gch.x = -xspc;
			y_above -= h_ann;
			gch.y = y_above
			break
		default:			/* guitar chord */
			xspc = w * GCHPRE
			if (xspc > 8)
				xspc = 8;
			gch.x = -xspc;
			if (pos < 0) {		/* below */
				y_below -= h_gch;
				gch.y = y_below
				if (box) {
					y_below -= 2;
					gch.y -= 1
				}
			} else {
				y_above -= h_gch;
				gch.y = y_above
				if (box) {
					y_above -= 2;
					gch.y -= 1
				}
			}
			break
		case '<':		/* left */
			gch.x = -(w + 6);
			y_left -= h_ann;
			gch.y = y_left
			break
		case '>':		/* right */
			gch.x = 6;
			y_right -= h_ann;
			gch.y = y_right
			break
		}
	}
}

/* -- draw the guitar chords and annotations -- */
/* (the staves are not yet defined) */
function draw_gchord(s, gchy_min, gchy_max) {
	var	gch, gch2, text, ix, x, y, i, j,
		box, hbox, xboxl, xboxr, yboxh, yboxl

	/* adjust the vertical offset according to the guitar chords */
//fixme: w may be too small
	var	w = s.a_gch[0].w,
		y_above = y_get(s.st, 1, s.x - 2, w),
		y_below = y_get(s.st, 0, s.x - 2, w),
		n = s.a_gch.length,
		yav = s.yav || 0

	for (ix = 0; ix < n; ix++) {
		gch = s.a_gch[ix]
		if (gch.type != 'g')
			continue
		gch2 = gch		/* guitar chord closest to the staff */
		if (gch.y < 0)
			break
	}
	if (gch2) {
		if (gch2.y >= 0) {
			if (y_above < gchy_max)
				y_above = gchy_max
		} else {
			if (y_below > gchy_min)
				y_below = gchy_min
		}
	}

//	output = staff_tb[s.st].output;
	set_dscale(s.st);
	xboxr = xboxl = s.x;
	yboxh = -100;
	yboxl = 100;
	box = 0
	for (ix = 0; ix < n; ix++) {
		gch = s.a_gch[ix];
		use_font(gch.font);
		gene.curfont = gene.deffont = gch.font;
		h = gch.font.size;
		w = gch.w;
		x = s.x + gch.x;
		text = gch.text
		switch (gch.type) {
		case '_':			/* below */
			y = gch.y + y_below;
			y_set(s.st, 0, x, w, y - h * 0.2 - 2)
			break
		case '^':			/* above */
			y = gch.y + y_above;
			y_set(s.st, 1, x, w, y + h * 0.8 + 2)
			break
		default:			/* guitar chord */
			hbox = gch.box ? 3 : 2
			if (gch.y >= 0) {
				y = gch.y + y_above;
				y_set(s.st, true, x, w, y + h + hbox)
			} else {
				y = gch.y + y_below;
				y_set(s.st, false, x, w, y - hbox)
			}
			if (gch.box) {
				if (xboxl > x)
					xboxl = x;
				w += x
				if (xboxr < w)
					xboxr = w
				if (yboxl > y)
					yboxl = y
				if (yboxh < y + h)
					yboxh = y + h;
				box++
			}
			i = text.indexOf('\t')

			/* if some TAB: expand the guitar chord */
			if (i >= 0) {
				x = realwidth
				for (var next = s.next; next; next = next.next) {
					switch (next.type) {
					default:
						continue
					case NOTE:
					case REST:
					case BAR:
						x = next.x
						break
					}
					break
				}
				j = 2
				for (;;) {
					i = text.indexOf('\t', i + 1)
					if (i < 0)
						break
					j++
				}
				var expdx = (x - s.x) / j;

				x = s.x
				if (user.anno_start)
					user.anno_start("gchord", s.istart, s.iend,
						x - 2, y + h + 2, w + 4, h + 4)
				i = 0;
				j = i
				for (;;) {
					i = text.indexOf('\t', j)
					if (i < 0)
						break
					xy_str(x, y + h * 0.2,
							text.slice(j, i), 'c');
					x += expdx;
					j = i + 1
				}
				xy_str(x, y + h * 0.2, text.slice(j), 'c')
				if (user.anno_stop)
					user.anno_stop("annot", s.istart, s.iend,
						s.x - 2, y + h + 2, w + 4, h + 4)
				continue
			}
			break
		case '<':			/* left */
/*fixme: what symbol space?*/
			if (s.notes[0].acc)
				x -= s.notes[0].shac;
			y = gch.y + yav
			break
		case '>':			/* right */
			x += s.xmx
			if (s.dots > 0)
				x += 1.5 + 3.5 * s.dots;
			y = gch.y + yav
			break
		case '@':			/* absolute */
			y = gch.y + yav
			if (y > 0)
				y_set(s.st, 1, x, 1, y + h * 0.8 + 3)
			else
				y_set(s.st, 0, x, 1, y - h * 0.2)
			break
		}
		if (user.anno_start)
			user.anno_start("annot", s.istart, s.iend,
				x - 2, y + h + 2, w + 4, h + 4)
		xy_str(x, y + h * 0.2, text)		/* (descent) */
		if (user.anno_stop)
			user.anno_stop("annot", s.istart, s.iend,
				x - 2, y + h + 2, w + 4, h + 4)
	}

	/* draw the box of the guitar chords */
	if (xboxr != xboxl) {		/* if any normal guitar chord */
		xboxl -= 2;
		w = xboxr - xboxl;
		h = yboxh - yboxl + 3;
		xybox(xboxl, yboxl - 1 + h, w, h)
	}
}
// abc2svg - tail.js
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.

// end of the Abc object
// empty ps functions
	function psdeco(f, x, y, de) { return false }
	function pshdeco(f, x, y, dd) { return false }
	function psxygl(x, y, gl) { return false }

// initialize
	abc2svg_init()

	return this
}	// end of Abc()
