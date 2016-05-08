var http = require('http');
var turnerLogicModule = require('./turnerLogic.js');

/*
 * Calls turnerLogic-function of ./turnerLogic.js
 * @param {type} originalText
 * @returns {unresolved}
 */
function turnerLogic(originalText) {
    return turnerLogicModule.turnerLogic(originalText);
}

module.exports = function (dbCli, options) {

    /*
     * Default error handler
     * @TODO log errors permanently (in a file or DB), eventually notify administrator  
     */
    function defultErrorHandler(err) {
        // assert.ifError(err);
        if (err) {
            console.log('___Error!___');
            console.log(err);
        }
    }
    function defultDBErrorHandler(err) {
        defultErrorHandler(err);
    }
    function defultServerErrorHandler(err) {
        defultErrorHandler(err);
    }

    // input varibles
    var port = options.port;
    var responsePath = options.responsePath;
    var responseDomain = options.responseDomain;

    if (!port || !responsePath || !responseDomain) {
        defultErrorHandler("Missing some options, options: " + options);
    }




    /*
     * Gets 5 recent turner phrases and sends them back to the requester
     */
    function onTurnerGet(response) {
        var query = 'SELECT turned_text FROM turner.turner_by_date LIMIT 5';

        dbCli.execute(query, function (err, result) {
            defultDBErrorHandler(err);

            console.log('result:');
            console.log(result);

            if (!err) {
                if (result.rows.length > 0) {
                    //console.log(result.rows);

                    //send response is here, because of the asynchronicity of dbCli.execute() (dbCli.execute() returns promise);
                    response.write(JSON.stringify(result.rows));
                } else {
                    response.write(JSON.stringify({"turned_text": "No entries in the DB."}));
                }
                response.end();
            }
        });
    }

    /*
     * Modifies the input using turnerLogic, writes the result into the database 
     * and returns the turned phrase for response. 
     */
    function onTurnerPost(requestBody) {
        if (requestBody.length < 1) {
            return {"turned_text": "nop"};
        }

        var requestData = JSON.parse(requestBody);
        var originalText = requestData.text;
        var turnedText = turnerLogic(originalText);

        var query = 'insert into turner.turner_by_date (date, ts, original_text, turned_text) Values(?, ?, ?, ?)';
        var params = [new Date(), Date.now(), originalText, turnedText];

        dbCli.execute(query, params, {prepare: true}, function (err, result) {
            defultDBErrorHandler(err);

            console.log('result:');
            console.log(result);
        });

        return {"turned_text": turnedText};
    }

    /*
     * Handles REST communication
     */
    http.createServer(function (request, response) {
        var headers = request.headers;
        var method = request.method;
        var url = request.url;
        var requestBody = [];

        request.on('error', function (err) {
            defultServerErrorHandler(err);
        }).on('data', function (chunk) {
            requestBody.push(chunk);
        }).on('end', function () {
            requestBody = Buffer.concat(requestBody).toString();

//            console.log("requestBody:");
//            console.log(requestBody);

            response.on('error', function (err) {
                defultServerErrorHandler(err);
            });

            //Set Header
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            //Set CORS
            //@Important: will response only to request from responseDomain or same domain 
            response.setHeader("Access-Control-Allow-Origin", responseDomain);
            response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE OPTIONS, HEAD");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");


            //@Important: will response only to request from responsePath
            if (request.url === responsePath) {
                switch (request.method) {
                    case 'GET':
                        onTurnerGet(response);
                        break;
                    case 'POST':
                        responseBody = onTurnerPost(requestBody);
                        response.write(JSON.stringify(responseBody));
                        response.end();
                        break;
                    default :
                        responseBody = {"default": "default request method"};
                        response.write(JSON.stringify(responseBody));
                        response.end();
                        break;
                }
            }

        });
    }).listen(port); // Activates this server, listening on eventually port 5002.

};