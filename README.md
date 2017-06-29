# pughound-js
A simplistic plugin for rendering suggestive search results from a remote data source

# how to use

## references

check for the most recent version and include the script tags below noting to replace the @pughound_ver with latest 

```xml
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-throttle-debounce/1.1/jquery.ba-throttle-debounce.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/itb2k13/pughound-js@{@pughound_ver}/jquery-pughound.min.js"></script>
<link href="https://cdn.jsdelivr.net/gh/itb2k13/pughound-js@{@pughound_ver}/jquery-pughound.min.css" rel='stylesheet' type='text/css' />
```

## simple
```
    $(document).ready(function () {

        var options = {
            remotesrc: 'https://www.mydomain.com/api/example.results.json',
            mapping: function (n, i) { return { count: n.CountForDisplay, text: n.Presentation, url: n.Url }; },
            urlformatting: function (url) { return url; }
        };

        $('.pughound').pughound(options);

    });
```

## less simple
```xml
	$(document).ready(function () {

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

### customclass
each pughound element will be given this class allowing for CSS style differentiation when multiple instances of the pughound targets appear on the same page

### debounce (miliseconds)
controls the latency of the user input keydown to trigger a remote call 

