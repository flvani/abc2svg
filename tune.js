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
