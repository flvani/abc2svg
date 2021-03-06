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
