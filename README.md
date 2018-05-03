# pughound-js
A simplistic plugin for rendering suggestive search results from a remote data source

# why ?
Because other implementations are annoying, overly complex and didn't have all the options required for the destination application

# requirements 
assumed referenced in the destination project somewhere:

- jQuery >= v1.6
- jQuery-Throttle-Debounce >= v1.1 (only required when you wish to make use of the input debounce feature)

# how to use

## reference it

check for the most recent release version within this repo and include the script tags below noting to replace the @pughound_ver with latest. 

the jsDelivr CDN picks up releases directly from this repo.

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

## configure it (biggly simple)
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

## configure it (lessly simple)
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
			closeonlinkclicked : false,
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
			mapping : function(n,i){return {count : n.Count, text : n.Text, url : n.Url, id : n.Id }; },
			urlformatting : function(url){return url;},
			onanchorclick: function (data) { $('#MyFieldId').val(data.Id); }
		};

		$('.pughound').pughound(options);
	});
```
# config options

## most important

### remotesrc
the url from which results will be obtained (see section 'Remote Sources' further down)

### mapping
allows a custom JS function to be defined so that remote data sources can be mappend into an object structure that pughound understands. (see section 'Remote Sources' further down)

### urlformatting
allows customization of the result-set hrefs (see section 'Remote Sources' further down)

### onanchorclick
allows specification of a custom function which will execute on the anchor click and has access to the items data element

## least important

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

### closeonlinkclicked
whether the results container should close when one of the search results is clicked

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

triggers both jQuery events in this order: 'change' and 'input'

### resultstoshow
how many results from the remote data source to show in the result-set

### showcounts
whether to show the counts returned by the remote data source (see more on the 'Remote Sources' further below)

### countformat
if counts are shown, allows customization of the presentation of the number: e.g. (50) or [50] or -50-

### ignorekeycodes
prevents a remote call if the keydown keycode exists in the defined list. prevents CTRL, ALT, SHIFT from triggering unwanted calls.
