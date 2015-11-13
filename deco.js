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
