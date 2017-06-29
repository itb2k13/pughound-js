# pughound-js
A simplistic plugin for rendering suggestive search results from a remote data source

# how to use

## reference it

check for the most recent version and include the script tags below noting to replace the @pughound_ver with latest 

```xml
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-throttle-debounce/1.1/jquery.ba-throttle-debounce.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/itb2k13/pughound-js@{@pughound_ver}/jquery-pughound.min.js"></script>
<link href="https://cdn.jsdelivr.net/gh/itb2k13/pughound-js@{@pughound_ver}/jquery-pughound.min.css" rel='stylesheet' type='text/css' />
```
## mark it up ("target element")

apply the class 'pughound' to a target input text element

```xml
<input type="text" id="keyword_search" name="keyword_search" class="pughound" placeholder="Search for things..." />
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

### minchars
how may characters must be entered before a remote call for results is made

### fadespeed (miliseconds)
how fast the results container fades in and out (0 = off/nofade/instant)

### highlightsearch
whether the results should highlight the search term if found within the result string. if so, a custom class is applied allowing for style overloading

### closeonescape
whether the results container should close on user pressing the ESCAPE key

### showonfocus
whether the results container will re-show itself if the target element loses and re-gains focus

### loopsaround
whether the focus returns to the top element in the result set upon reaching the last element using the DOWN key

### autocomplete
can be used to disable the browser auto-complete feature of the target element thus preventing annoying webkit overlays

### autofocus
attemps to force the browser to auto-focus the target element upon page load. not always 100% successful depending on other conflicting JS logic.

### settextonclick
upon the user clicking an element in the result-set, this setting determines whether the target element should recieve the full href text of the clicked element.

