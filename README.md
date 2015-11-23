[![Travis CI](https://travis-ci.org/robertkeizer/search-scrape.svg?branch=master)](https://travis-ci.org/robertkeizer/search-scrape)

# Search Scraping

Don't be a dick. 


## Overview

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
