# pughound-js
A simplistic plugin for rendering suggestive search results from a remote data source

# how to use
```xml
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
		remotesrc : '', 
		resultstoshow : 12, 
		showcounts : true,
		countformat : '({0})',
		ignorekeycodes : [27, 39, 40, 32, 37, 38, 9, 17, 18, 13],
		mapping : function(n,i){return {count : n.Count, text : n.Text, url : n.Url}; },
		urlformatting : function(url){return url;} //window.location.href.split('?')[0] + '?' + item.url;
	};
	
	$('.pughound').pughound(options);
});
```
# config options
abc

