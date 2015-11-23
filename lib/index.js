var util	= require( "util" );
var querystring	= require( "querystring" );
var request	= require( "request" );
var Promise	= require( "lie" );
var cheerio	= require( "cheerio" );

function DDGScrape( options ){
	this.options			= options || { };
	this.options.requestOptions	= this.options.requestOptions || { };
}

DDGScrape.prototype.Search = function( stringToSearch, cb ){

	var _url = util.format( "https://duckduckgo.com/?q=%s&ia=about", querystring.escape( stringToSearch ) );

	request.get( merge( { uri: _url }, this.options.requestOptions ), function( err, response, body ){
		if( err ){ return cb( err ); }

		var $ = cheerio.load( body );

		var itemLocation	= "div.cw div#links_wrapper.results-wrapper div#links.results .result";
		var linkSelect		= ".result__a";
		var snippetSelect	= ".result__snippet";

		var _promises = [ ];
		$(itemLocation).each( function( i, itemElement ){
			_promises.push( new Promise( function( resolve, reject ){
				var linkElement		= $(itemElement).find( linkSelect );
				var snippetElement	= $(itemElement).find( snippetSelect );

				return resolve( {
					title: $(linkElement).first().text(),
					link: $(linkElement).first().attr( "href" ),
					description: snippetElement.text()
				} );
			} ) );
		} );
		

		_promises.all( _promises ).then( function( results ){
			return cb( null, results );
		}, cb );
	} );
};

module.exports = DDGScrape;
