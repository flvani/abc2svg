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
