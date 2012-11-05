var http = require('http'),
	url  = require('url');
var port = "8000";
var node_static = require('node-static');

//create node-static server instance to serve the public folder ./public
var file = new (node_static.Server)('./public');
/* var Caching = require('caching');
var cache = new Caching('redis'); /* use 'memory' or 'redis' 

setInterval(function() {
    cache('key', 10000 /*ttl in ms, function(passalong) {
        // This will only run once, all following requests will use cached data.
 /*       setTimeout(function() {
            passalong(null, 'Cached result');
        }, 1000);
    }, function(err, results) {
        // This callback will be reused each call
        console.log(results);
    });
}, 100);
*/
// function notFound
function notFound(response)
{
	response.witeHead(404, "text/plain");
	response.end("404 : File not Found");
}

//create simple http server with browser requet and browser response
http.createServer(function(b_request, b_response){
	//create caching proxy server
	
	//Parse the browser request'url
	var b_url = url.parse(b_request.url, true);
	if(!b_url.query || !b_url.query.url) return notFound(b_response);
	
	//Read and parse url parameter (/?url=p_url)
	var p_url = url.parse(b_url.query.url);
	
	//Initialize Http client
	var p_client = http.createClient(p_url.port || 80, p_url.hostname);
	
	//Send request
	var p_request = p_client.request('GET', p_url.pathname || "/", {
	   host: p_url.hostname
	});
	p_request.end();
	
	//Listen for response
	p_request.addListener('response', function(p_response){
		//Pass through headers
		b_response.writeHead(p_response.statusCode, p_response.headers);
		
		//Pass through data
		p_response.addListener('data', function(chunk){
			b_response.write(chunk);
		});
		
		//Serve file
		file.serve(b_request,b_response);
		//End request
		p_response.addListener('end', function(){
			b_response.end();
		});
	});
}).listen(port, "127.0.0.1");

console.log("Server running at http://127.0.0.1:" +port + "/");
