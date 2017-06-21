// A simplistic plugin for rendering suggestive search results from a remote data source
// https://github.com/itb2k13/pughound-js
// Version: v1.0.0
/*
 Pug-Hound - component based jQuery Plugin
 A simplistic plugin for rendering suggestive search results from a remote data source
 version 1.0, June 15 2017
 by Steph Smith

 The MIT License (MIT)

 Copyright (c) 2017 Steph Smith

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function($) {
	$.pughound = function (element, options) {

		var defaults = {prefix: 'pughound_'};	
		var plugin = this;plugin.settings = {};
		
		String.prototype.rpl = function (s) {return this.replace('{0}',s);};
		String.prototype.first = function(s) {return (this && this.length >= 1) ? this.charAt(0) : '';};
		
		function parseBool(s) {return /^true$/i.test(s);}
		
		plugin.element = $(element); 		
		plugin.results = {};
		plugin.container = {};
		plugin.up = 38;
		plugin.down = 40;
		plugin.esc = 27;
		plugin.namespace = 'pughound';
		plugin.uniqueid = Math.random().toString(36).slice(2);
		plugin.closeresultevents = ['keydown','mousedown','pointerdown'];
		
		$int = function(s){return parseInt(s);}
		$bool = function(s){return parseBool(s);}
		$cs = function(s){return '.' + plugin.namespace + s;}
		$ns = function(s){return plugin.namespace + s;}		
		$log = function(o){console.log(o);};
		
		// INITIALIZE
		plugin.init = function () {
			plugin.settings = $.extend({}, defaults, options);
			var f = function(e){plugin.tryhide(e);};
			$.each(plugin.closeresultevents, function(i,e){$(document).off(e,f).on(e,f)});
			$(element).off('keydown').off('focusin')
				.on('keydown', $.debounce(plugin.cfg('debounce'), function (event) { plugin.search(event.keyCode); }))
				.on('keydown', $.debounce(0, function (event) { plugin.setfocus(event.keyCode).focus(false); }))
				.on('focusin', function(event){plugin.tryshow(event);})
				;
			plugin.element.attr('autocomplete',plugin.cfg('autocomplete'));
			if (plugin.cfg('autofocus')){plugin.element.focus();}
			plugin.element.addClass(plugin.customclass());
		};

		//MAIN SEARCH FUNCTION
		plugin.search = function(keyCode){
			var term = plugin.searchterm();
			if (plugin.inarray(keyCode, plugin.cfg('ignorekeycodes'))){return;}
			if (term.length <= 0) { plugin.emptyterm(); return; }
			if (term.length < plugin.cfg('minchars')) { return; }
			if (term.length >= plugin.cfg('minchars')) {plugin.get(plugin.cfg('remotesrc').replace('{0}',plugin.enc(term)), plugin.onresults, plugin.onerror);}			
		}
		
		plugin.getattr = function(s){return plugin.element.attr('data-' + plugin.namespace + '-' + s);}
		plugin.cfg = function(s,f){if(plugin.atr(s)){return plugin.atr(s,f); } else if(plugin.settings[s]){return plugin.settings[s];}}
		plugin.atr = function(s,f){if(f) return f(plugin.getattr(s)); else return plugin.getattr(s);}
		plugin.customclass = function(){if(plugin.cfg('customclass')){return "{0}-{0}".rpl(plugin.namespace).rpl(plugin.cfg('customclass'));}else{return "{0}-{0}".rpl(plugin.namespace).rpl(plugin.uniqueid);}}
		plugin.inarray = function(i,a){if($.inArray(i,a) > -1)return true;else return false;}
		plugin.setfocus = function(keyCode){if (keyCode == plugin.up){plugin.findlast($cs('-link')).focus();}if (keyCode == plugin.down){plugin.findfirst($cs('-link')).focus();} return plugin.element;};
		plugin.get = function (url, onsuccess, onerror) {$.ajax({ url: url, cache: false }).done(onsuccess);};
		plugin.onerror = function(error){plugin.log(error);};
		plugin.enc = function(url){return encodeURIComponent(url);}
		plugin.emptyterm = function(){if(plugin.cfg('closeonemptyterm')){plugin.hidecontainer();}};		
		plugin.searchterm = function(){return plugin.element.val().trim();}
		plugin.highlight = function (text, term) {return text.replace(new RegExp("(" + plugin.preg_quote(term) + ")", 'gi'), '<span class="pughound-highlight">$1</span>');};
		plugin.setcontainer = function(d){$(d).insertAfter(plugin.element);$(d).on('keydown',function(e){plugin.movefocus(e);});};
		plugin.removecontainer = function(){plugin.findcontainer().remove();};
		plugin.destroy = function () {};	
		plugin.log = function(s){$log(s);}
		plugin.find = function(s){return plugin.element.parent().find(s);};
		plugin.findfirst = function(s){return plugin.find(s).first();};	
		plugin.findlast = function(s){return plugin.find(s).last();};	
		plugin.focus = function(f){window.setTimeout(function () {plugin.element.focus().select();}, 20);}
		plugin.preg_quote = function (str) { return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1"); }
		plugin.tryhide = function(event){if((event.keyCode==plugin.esc && plugin.cfg('closeonescape')) || (event.which == 1 && plugin.isnottarget(event))){plugin.hidecontainer();}};
		plugin.tryshow = function(event){if(plugin.cfg('showonfocus')){plugin.showcontainer();}};
		plugin.istarget = function(event){if($(event.target).is(".pughound,.pughound-text")){return true;}}
		plugin.isnottarget = function(event){return !plugin.istarget(event);}
		plugin.hidecontainer = function(){plugin.findcontainer().fadeOut(plugin.cfg('fadespeed',$int));}
		plugin.showcontainer = function(){plugin.findcontainer().fadeIn(plugin.cfg('fadespeed',$int));}
		plugin.findcontainer = function(){return plugin.element.next($cs('-results-container'));}
		plugin.mapdata = function(data){if (plugin.cfg('mapping')){return jQuery.map(data,plugin.cfg('mapping'))}else{return data;}}
		plugin.isstring = function(o){return typeof o === 'string' || o instanceof String;}
		plugin.linkclicked = function(event){if(plugin.cfg('settextonclick',$bool)){plugin.element.val(plugin.linktext(event));}}
		plugin.linktext = function(event){return $(event.currentTarget).attr('data-text');}
		
		plugin.onresults = function(data){
			if(plugin.isstring(data)){data = JSON.parse(data);}
			plugin.container = plugin.makeresults(plugin.mapdata(data), plugin.cfg('resultstoshow'));
			plugin.removecontainer();
			plugin.setcontainer(plugin.container);
		};
		
		plugin.movefocus = function (event) {
			var e = event.keyCode;
			var focus = parseInt($('.pughound-link:focus').attr('data-order'));
			var next = $(".pughound-link[data-order={0}]".rpl(focus + 1));
			var prev = $(".pughound-link[data-order={0}]".rpl(focus - 1));
			if (e == plugin.down) { if(next.length > 0){next.focus();}else if(plugin.cfg('loopsaround')){$(".pughound-link[data-order=0]").focus();} }
			if (e == plugin.up) { prev.focus(); }
			if (e == plugin.up && focus == 0) { plugin.focus(true); }
		};		
	
		plugin.makeresults = function(data,take){
			
			var div = document.createElement('div');
			var ul = document.createElement('ul');

			$.each(data, function (i, item) {
				if (i <= take) {					
					var li = document.createElement('li');
					var anchor = document.createElement('a');
					var text = document.createElement('span');
					var counter = document.createElement('span');
					var att = document.createAttribute("data-order");
					text.innerHTML = (plugin.cfg('highlightsearch') && plugin.searchterm().length > 1) ? plugin.highlight(item.text, plugin.searchterm()) : item.text;
					text.classList.add($ns('-text'));
					text.classList.add(plugin.customclass());
					counter.innerText = plugin.cfg('countformat').rpl(item.count);
					counter.classList.add($ns('-counter'));
					counter.classList.add(plugin.customclass());
					anchor.href = (item.url.first() == '/') ? item.url : plugin.cfg('urlformatting') ? plugin.cfg('urlformatting')(item.url) : item.url;
					anchor.appendChild(text);
					if(plugin.cfg('showcounts',$bool)){anchor.appendChild(counter);}
					att.value = i;
					anchor.setAttributeNode(att);
					anchor.classList.add($ns('-link'));
					anchor.classList.add(plugin.customclass());
					$(li).on('click', function(event){plugin.linkclicked(event);});
					$(li).attr('data-text',item.text);
					li.appendChild(anchor);
					li.classList.add($ns('-list-item'));
					li.classList.add(plugin.customclass());
					ul.appendChild(li);
				}
			});
			
			ul.classList.add($ns('-list'));
			ul.classList.add(plugin.customclass());		
			div.appendChild(ul);
			div.classList.add($ns('-results-container'));					
			div.classList.add(plugin.customclass());					
			
			return div;
		}
			
		plugin.init();	
		
	};
	
	$.fn.pughound = function(options) {
		options = options !== undefined ? options : {};
		return this.each(function () {
			if (typeof(options) === 'object') {
				if (undefined === $(this).data('pughound')) {
					var plugin = new $.pughound(this, options);
					$(this).data('pughound', plugin);
				}
			} else if ($(this).data('pughound')[options]) {
				$(this).data('pughound')[options].apply(this, Array.prototype.slice.call(arguments, 1));
			} else {
				$.error('Method ' + options + ' does not exist in $.pughound');
			}
		});
	};

}(jQuery));

$(function () {
	
	var options = {
		customclass : '',
		debounce : 250, 
		minchars : 3, 
		fadespeed : 160, 
		highlightsearch : true, 
		closeonemptyterm : true, 
		closeonescape : true, 
		showonfocus : true,
		loopsaround : true,
		autocomplete : 'off',
		autofocus : true,
		settextonclick : true,
		remotesrc : 'http://localhost:4462/schema/search/listed?term={0}', 
		resultstoshow : 12, 
		showcounts : true,
		countformat : '({0})',
		ignorekeycodes : [27, 39, 40, 32, 37, 38, 9, 17, 18, 13],
		mapping : function(n,i){return {count : n.CountForDisplay, text : n.Presentation, url : n.CatalogQueryString}; },
		urlformatting : function(url){return '/used-equipment-results?' + url;} //window.location.href.split('?')[0] + '?' + item.url;
	};
	
	$('.pughound').pughound(options);
});