[![Travis CI](https://travis-ci.org/robertkeizer/search-scrape.svg?branch=master)](https://travis-ci.org/robertkeizer/search-scrape)

# Search Scraping

Don't be a dick. 

PRs welcome. I'm only updating this when it breaks. Documentation could use some work.

## Overview

This system makes use of SpookyJS, which makes use of CasperJS, which makes use of PhantomJS.


```
var Scraper = require( "search-scape" );

var myScraper = new Scraper( );

myScraper.Search( "Scraping a webpage", function( err, results ){
	if( err ){
		return console.log( err );
	}

	// results is an array of objects.
	// each object contains 'description', 'title', and 'link'.

	console.log( results );
} );
```

```
var Scraper = require( "search-scape" );

var myScraper = new Scraper( { port: 8081 } );	// what port spooky will use for communication to casper

myScraper.Search( "Dice on black table", { images: true }, function( err, images ){
	
	// images is an array of urls.

} );
```
