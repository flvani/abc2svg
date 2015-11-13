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
