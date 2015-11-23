![Travis CI](https://travis-ci.org/robertkeizer/ddg-scrape.svg?branch=master)

# Duck Duck Go Scraping

Don't be a dick. 


## Overview

```
var DuckDuckGoScraper = require( "ddg-scape" );

var myScraper = new DuckDuckGoScraper( );

myScraper.Search( "Duck Duck Go Scraping", function( err, results ){
	if( err ){
		return console.log( err );
	}

	// results is an array of objects.
	// each object contains 'description', 'title', and 'link'.

	console.log( results );
} );
```
