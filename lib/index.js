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
		port: 8080,
		timeout: 30000
	}, options );

	this.availableProviders = [ "DDG" ];
}

SearchScrape.prototype.Search = function( stringToSearch, options, cb ){

	if( !cb && typeof( options ) === "function" ){
		cb	= options;
		options	= { };
	}

	if( typeof( cb ) !== "function" ){
		throw "Callback must be specified";
	}

	var self = this;
	async.mapLimit( this.options.providers, this.options.concurrent, function( provider, cb ){

		if( self.availableProviders.indexOf( provider ) < 0 ){
			return cb( "Invalid provider: " + provider  );
		}

		self['_search'+provider]( stringToSearch, options, cb );

	}, function( err, results ){
		
		for( var i=0; i<self.options.providers.length; i++ ){
			for( var z=0; z<results[i].length; z++ ){
				results[i][z].provider = self.options.providers[i];
			}
		}

		return cb( err, results.reduce( function( a, b ){ return a.concat( b ); } ) );
	} );
};

SearchScrape.prototype._searchDDG = function( stringToSearch, options, cb ){

	if( !cb && typeof( options ) === "function" ){
		cb	= options;
		options	= { };
	}

	if( typeof( cb ) !== "function" ){
		throw "Callback must be specified";
	}

	var _options = {
		itemLocation: "div.cw div#links_wrapper.results-wrapper div#links.results .result",
		linkSelect: ".result__a",
		snippetSelect: ".result__snippet",
		imageTileClickSelect: ".tile--img.has-detail",
		imageLinkSelect: ".c-detail__filemeta"
	};

	var _ia;
	if( options.images ){
		_ia = "images";
		_options.image = true;
	}else{
		_ia = "about";
	}

	var _url = util.format( "https://duckduckgo.com/?q=%s&ia=" + _ia, querystring.escape( stringToSearch ) );

	var _return		= false;

	var noop = function(){
		// avoid casper dying.
	};

	var spooky = new Spooky( merge( {
		child: {
			port: this.options.port,
			transport: "http"
		},
		casper: {
			logLevel: "debug",
			verbose: true,
			timeout: this.options.timeout
		}
	}, this.options.spookyOptions ), function( err ){

		if( err ){ return cb( err ); }
	
		spooky.start( _url );

		spooky.run( noop );

		spooky.then( function( ){
			// Inside casper scope; Define error handler so that we 
			// don't die horribly
			this.on( "error", function( ){
				
			} );
		} );

		spooky.thenEvaluate( function( options ){
			$(document).ready( function( ){
				var _return = [ ];

				if( options.image ){
					var iterate = function( currentArray, currentIndex, timeout, currentValues, _cb ){

						if( currentIndex == currentArray.length-1 ){
							return _cb( null, currentValues );
						}else{
							$(currentArray[currentIndex]).click();

							for( var i=0; i<timeout; i++ ){
								var p = i*i;
							}

							var _link = $(options.imageLinkSelect).find("a").toArray()[0].href;

							currentValues.push( _link );

							// insert into currentValues
							iterate( currentArray, currentIndex+1, timeout, currentValues, _cb );
						}
					};

					iterate( $(options.imageTileClickSelect).toArray(), 0, 100000, [ ], function( err, results ){
						window.callPhantom( { "result": results } );
					} );
				}else{
					$(options.itemLocation).toArray().forEach( function( itemElement ){
						var linkElement		= $(itemElement).find( options.linkSelect );
						var snippetElement	= $(itemElement).find( options.snippetSelect );

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
				}
			} );
		}, _options );

		spooky.run( noop );
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
