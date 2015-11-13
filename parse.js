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
