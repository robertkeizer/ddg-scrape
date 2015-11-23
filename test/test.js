var assert = require( "assert" );

describe( "Duck Duck Go Scrape", function( ){
	
	it( "Is a function", function( ){
		var ddgs = require( "../lib/index.js" );
		assert.equal( "function", typeof( ddgs ) );
	} );

	it( "Returns an instance", function( ){
		var ddgs = require( "../lib/index.js" );
		var _ddgs = new ddgs( );
		assert.ok( _ddgs instanceof ddgs );
	} );

	describe( "Instance", function( ){
		var _instance;
		before( function( ){
			var ddgs = require( "../lib/index.js" );
			_instance = new ddgs( );
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

		it( "Returns another set of results if queried", function( cb ){
			_instance.Search( "Google", function( err, results ){
				return cb( err, results );
			} );
		} );
	} );
} );
