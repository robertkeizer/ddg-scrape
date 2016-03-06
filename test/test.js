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

		it.skip( "Returns results", function( cb ){
			_instance.Search( "Walmart", function( err, results ){
				return cb( err, results );
			} );
		} );

		it( "Returns image results", function( cb ){
			_instance.Search( "Walmart Logo", { images: true }, function( err, results ){
				console.log( results );
				return cb( null );
			} );
		} );

		it.skip( "Allows for a port to be specified", function( cb ){
			// ideally at this point we should do a netstat or try and make sure we
			// can connect to that port now ( tcp localhost ).

			// For testing purposes we can just make sure to specify one.
			var searchScrape = require( "../lib/index.js" );
			_instance = new searchScrape( { port: 1339 } );
			_instance.Search( "Walmart", function( err, results ){
				return cb( err, results );
			} );
		} );
	} );
} );
