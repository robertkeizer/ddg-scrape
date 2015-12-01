var util	= require( "util" );
var querystring	= require( "querystring" );
var merge	= require( "merge" );
var Spooky	= require( "spooky" );
var async	= require( "async" );

function SearchScrape( options ){

	this.options = merge( {
		concurrent: 1,
		spookyOptions: { },
		providers: [ "DDG" ],
		port: 8080
	}, options );

	this.availableProviders = [ "DDG" ];
}

SearchScrape.prototype.Search = function( stringToSearch, cb ){

	if( typeof( cb ) !== "function" ){
		throw "Callback must be specified";
	}

	var self = this;
	async.mapLimit( this.options.providers, this.options.concurrent, function( provider, cb ){

		if( self.availableProviders.indexOf( provider ) < 0 ){
			return cb( "Invalid provider: " + provider  );
		}

		self['_search'+provider]( stringToSearch, cb );

	}, function( err, results ){
		
		for( var i=0; i<self.options.providers.length; i++ ){
			for( var z=0; z<results[i].length; z++ ){
				results[i][z].provider = self.options.providers[i];
			}
		}

		return cb( err, results.reduce( function( a, b ){ return a.concat( b ); } ) );
	} );
};

SearchScrape.prototype._searchDDG = function( stringToSearch, cb ){

	if( typeof( cb ) !== "function" ){
		throw "Callback must be specified";
	}

	var _url = util.format( "https://duckduckgo.com/?q=%s&ia=about", querystring.escape( stringToSearch ) );

	var itemLocation	= "div.cw div#links_wrapper.results-wrapper div#links.results .result";
	var linkSelect		= ".result__a";
	var snippetSelect	= ".result__snippet";
	var _return		= false;

	var spooky = new Spooky( merge( {
		child: {
			port: this.options.port,
			transport: "http"
		},
		casper: {
			logLevel: "debug",
			verbose: true
		}
	}, this.options.spookyOptions ), function( err ){
		if( err ){ return cb( err ); }
		
		spooky.start( _url );

		spooky.thenEvaluate( function( itemLocation, linkSelect, snippetSelect ){
			$(document).ready( function( ){
				var _return = [ ];

				$(itemLocation).toArray().forEach( function( itemElement ){
					var linkElement		= $(itemElement).find( linkSelect );
					var snippetElement	= $(itemElement).find( snippetSelect );

					var _obj = {
						title: $(linkElement).first().text(),
						link: $(linkElement).first().attr( "href" ),
						description: snippetElement.text()
					};

					if( !_obj.link ){ return; }
					if( !_obj.title ){ return; }

					_return.push( _obj );
				} );

				window.callPhantom( { "result": _return } );
			} );
		}, { itemLocation: itemLocation, linkSelect: linkSelect, snippetSelect: snippetSelect } );

		spooky.run( );
	} );

	spooky.on( "error", function( err ){
		if( !_return ){ _return = true; return cb( err ); }
		return;
	} );

	spooky.on( "remote.callback", function( results ){
		if( !_return ){ _return = true; return cb( null, results.result ); }
		return;
	} );

	spooky.on( "log", function( log ){
		//console.log( log );
	} );
};

module.exports = SearchScrape;
