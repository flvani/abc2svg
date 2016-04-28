/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

if (!window.SITE)
    window.SITE = {};

// -- Abc create argument
SITE.User = function () {
	// -- required methodes
	// include a (THE) file (%%abc-include)
	this.read_file = function(fn) {
		document.getElementById("s" + srcidx).style.display = "inline"
		var	s = "src1";
		return document.getElementById(s).value
	}
	// insert the errors
	this.errmsg = function(msg, l, c) {
		var diverr = document.getElementById("diverr")
		if (l)
			diverr.innerHTML += '<b onclick="gotoabc(' +
				l + ',' + c +
				')" style="cursor: pointer; display: inline-block">' +
				msg + "</b><br/>\n"
		else
			diverr.innerHTML += msg + "<br/>\n"
	}
	// image output
	this.my_img_out = function(str) {
		abc_images += str
//                try {
//                //    var x = abc_images+'</sgv></div>';
//                    
//                //    this.tgt.innerHTML = 'x';
//                  //  this.tgt.innerHTML = x;
//                    
//                  ///  var y=1;
//                } catch(e) {
//                    // just ignore it
//                }
	};
        
	this.img_out = this.my_img_out;
        
	// -- optional methods
	// annotations
	this.anno_start = function(type, start, stop, x, y, w, h) {
		stop -= start;
		// keep the source reference
		ref.push([start, stop])
		// create a container for the music element
		abc.out_svg('<g class="e_' + start + '_' + stop + '_">\n')
	}
	this.anno_stop = function(type, start, stop, x, y, w, h) {
		// close the container
		abc.out_svg('</g>\n');
		// create a rectangle
		abc.out_svg('<rect class="abcr _' + start + '_' + (stop - start) +
			'_" x="');
		abc.out_sxsy(x, '" y="', y);
		abc.out_svg('" width="' + w.toFixed(2) +
			'" height="' + h.toFixed(2) + '"/>\n')
	}
	// for playing
	this.get_abcmodel = function(tsfirst, voice_tb, music_types) {
		if (abcplay && playing)
			abcplay.add(tsfirst, voice_tb[0].key)
	}
	// -- optional attributes
	this.page_format = true		// define the non-page-breakable blocks
};
