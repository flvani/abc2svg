// abc2svg - cmdline.js - command line
//
// Copyright (C) 2014-2015 Jean-Francois Moine
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.");

// global variables
var abc, errtxt = ''

// -- replace the exotic end of lines by standard ones
function set_eoln(file) {
	var i = file.indexOf('\r')
	if (i < 0)
		return undefined	// standard
	if (file[i + 1] == '\n')
		return file.replace(/\r\n/g, '\n')	// M$
	return  file.replace(/\r/g, '\n')		// Mac
}

// -- abc2svg init argument
function User() {
	// include a file (%%abc-include)
	this.read_file = function(fn) {
		var	file = readFile(fn),
			file2 = set_eoln(file)
		if (file2)
			return file2
		return file
	}
	// get the errors
	this.errmsg = function(msg, l, c) {
		errtxt += msg + '\n'
	}
	// image output
	this.img_out = function(str) {
		print(str)
	}
	// optional attributes
	this.page_format = true	// page formatting
}
var user = new User()

// -- local functions
function abort(e) {
	abc.blk_out();
	abc.blk_flush();
	print(e.message);
	if (errtxt) {
		errtxt = errtxt.replace(/</g, '&lt;');
		errtxt = errtxt.replace(/>/g, '&gt;');
		errtxt = errtxt.replace(/&/g, '&amp;');
		print("<pre>" + errtxt + "</pre>")
	}
	print("<pre>*** Abort ***\n" + e.stack + "</pre>");
	print("</body> </html>");
	quit()
}

//test
function dump_obj(obj) {
	print("<!-- dump")
	if (obj && typeof(obj) == 'object') {
		for (var k in obj)
			print("  " + k + ": " + obj[k])
	} else {
		print(" not an object:", obj)
	}
	print(" -->")
}

function debug() {
	errtxt += "debug:"
	for (var i = 0; i < arguments.length; i++)
		user.errmsg(" " + arguments[i]);
}

function debugi() {
	if (output) {
		output.push("<!-- debug")
		for (var i = 0; i < arguments.length; i++)
			output.push(" " + arguments[i]);
		output.push(" -->\n");
	} else {
		errtxt += '(no output)\n'
	}
	errtxt += "*** debugi: " + arguments[0] + "\n"
}

function do_file(fname) {
	var i, j, file, file2
	j = fname.lastIndexOf("/")
	if (j < 0)
		j = 0
	i = fname.indexOf(".", j)
	if (i < 0)
		fname += ".abc";
	file = readFile(fname)
	if (!file)
		abort(new Error("Cannot read file '" + fname + "'"));
	file2 = set_eoln(file)
	if (file2)
		file = file2
//	if (typeof(utf_convert) == "function")
//		file = utf_convert(file);
	try {
		abc.tosvg(fname, file)
	}
	catch (e) {
		abort(e)
	}
}

var months = [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

function abc_cmd(cmd, args, i) {
	abc = new Abc(user);

    var	item, fname,
	now = new Date(),
	date = months[now.getMonth()] + ' ' +
		now.getDate() + ', ' + now.getFullYear() + ' ' +
		now.getHours() + ':' + now.getMinutes();
	print('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"\n\
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1.dtd">\n\
<html xmlns="http://www.w3.org/1999/xhtml">\n\
<head>\n\
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>\n\
<meta name="generator" content="abc2svg-' + abc2svg.version + '"/>\n\
<!-- CreationDate: ' + date + '-->');
//fixme: pb with '--' and ','
//		"<!-- CommandLine: " + args.toString() + " -->")
	print('<style type="text/css">\n\
	body {margin:0; padding:0; border:0}\n\
	@page {margin:0}\n\
	text, tspan {white-space:pre; fill:currentColor}\n\
	svg {display:block}\n\
	@media print {\n\
		div.newpage {page-break-before: always}\n\
		div.nobrk {page-break-inside: avoid}\n\
	}\n\
</style>\n\
<title>' + cmd + ' document</title>\n\
</head>\n\
<body>')
	for ( ; i < args.length; i++) {
		item = args[i].toString()
		if (item[0] == "-") {
			if (item[1] == "-") {
				abc.tosvg("cmd", 
					"%%" + item.slice(2) + " " +
						args[++i].toString() + "\n")
			}
		} else {
			if (fname)
				do_file(fname);
			fname = item
		}
	}
	if (fname)
		do_file(fname)

	if (errtxt) {
//fixme: should create an image
		print("<pre>" + errtxt + "</pre>")
	}
	print("</body>\n</html>")
}
