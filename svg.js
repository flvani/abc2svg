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
