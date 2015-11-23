var assert = require( "assert" );

describe( "Search Scrape", function( ){
	
	it( "Is a function", function( ){
		var searchScrape = require( "../lib/index.js" );
		assert.equal( "function", typeof( searchScrape ) );
	} );

	it( "Returns an instance", function( ){
		var searchScrape = require( "../lib/index.js" );
		var _searchScrape = new searchScrape( );
		assert.ok( _searchScrape instanceof searchScrape );
	} );

	describe( "Instance", function( ){
		var _instance;
		before( function( ){
			var searchScrape = require( "../lib/index.js" );
			_instance = new searchScrape( );
		} );

		it( "Has Search function", function( ){
			assert.equal( "function", typeof( _instance.Search ) );
		} );

		it( "Search function must have a callback", function( ){
			assert.throws( function( ){
				_instance.Search( "Something to search" );
			} );
		} );

		it( "Returns results", function( cb ){
			_instance.Search( "Walmart", function( err, results ){
				return cb( err, results );
			} );
		} );
	} );

	describe( "Google", function( ){
		var _instance;
		before( function( ){
			var searchScrape = require( "../lib/index.js" );
			_instance = new searchScrape( );
		} );

		it( "Returns results", function( cb ){
			_instance._searchGoogle( "Walmart", function( err, result ){
				if( err ){ return cb( err ); }
				console.log( "I have results of ");
				console.log( result );
				return cb( null );
			} );
		} );
	} );
} );
