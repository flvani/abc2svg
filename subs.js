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
		if (head[0] == '"')
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

