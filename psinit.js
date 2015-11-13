// psinit.js
// initialize the abcm2ps symbols for the PS interpreter
//wpsobj = new Wps;
var abcm2ps_op =
"/!{bind def}bind def\n\
%/bdef{bind def}!\n\
/T/translate load def\n\
/M/moveto load def\n\
/RM/rmoveto load def\n\
/L/lineto load def\n\
/RL/rlineto load def\n\
/C/curveto load def\n\
/RC/rcurveto load def\n\
/SLW/setlinewidth load def\n\
/defl 0 def\n\
/dlw{0.7 SLW}!\n\
/xymove{/x 2 index def/y 1 index def M}!\n\
/showc{dup stringwidth pop .5 mul neg 0 RM show}!\n\
%\n\
% abcm2ps internal glyphs\n\
/arp{.svg(arp)3 .call0}.bdef\n\
%/brace - same as arp if redefined\n\
/ft0{(ft0).svg(xygl)3 .call0}.bdef\n\
/lmrd{(lmrd).svg(xygl)3 .call0}.bdef\n\
/ltr{(ltr).svg(xyglv)4 .call0}.bdef\n\
/nt0{(nt0).svg(xygl)3 .call0}.bdef\n\
/sh0{(sh0).svg(xygl)3 .call0}.bdef\n\
/trl{(trl).svg(xygl)3 .call0}.bdef\n\
/umrd{(umrd).svg(xygl)3 .call0}.bdef\n\
/y0{.svg(y0)1 .call}.bdef\n\
/y1{.svg(y1)1 .call}.bdef\n"
