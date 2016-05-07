var http = require('http');

function turnerLogic(originalText) {
    return "Turned:" + originalText.split(" ");
}

module.exports = function (port, dbCli) {
    function defultDBErrorHandler(err) {
        //        assert.ifError(err);
        if (err) {
            console.log('err:');
            console.log(err);
        }
    }


    function onTurnerGet(response) {
        var query = 'SELECT * FROM turner.turner_by_date LIMIT 1';

        dbCli.execute(query, function (err, result) {
            defultDBErrorHandler(err);

            console.log('result:');
            console.log(result);

            if (!err) {
                if (result.rows.length > 0) {
                    var responseEntry = result.rows[0].turned_text;

                    //send response; It's here, because of the asynchronicity of dbCli.execute();
                    response.write(JSON.stringify({"turned_text": responseEntry}));
                    response.end();
                }
            }
        });
    }

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
    
    function onTurnerDelete(requestBody) {
        return {"turned_text": "delete turned_text dummy"};

    }



    http.createServer(function (request, response) {
        var headers = request.headers;
        var method = request.method;
        var url = request.url;
        var requestBody = [];

        request.on('error', function (err) {
            console.error(err);
        }).on('data', function (chunk) {
            requestBody.push(chunk);
        }).on('end', function () {
            requestBody = Buffer.concat(requestBody).toString();

//        console.log("requestBody:");
//        console.log(requestBody);

            response.on('error', function (err) {
                console.error(err);
            });

            //Set Header
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            //Set CORS
            response.setHeader("Access-Control-Allow-Origin", "http://localhost");
            response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE OPTIONS, HEAD");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");


            if (request.url === '/williamturner/node') {
                switch (request.method) {
                    case 'GET':
                        onTurnerGet(response);
                        break;
                    case 'POST':
                        responseBody = onTurnerPost(requestBody);
                        response.write(JSON.stringify(responseBody));
                        response.end();
                        break;
                    case 'DELETE':
                        responseBody = onTurnerDelete(requestBody);
                        response.write(JSON.stringify(responseBody));
                        response.end();
                        break;
                    default :
                        responseBody = {"default": "default DUMMY"};
                        response.write(JSON.stringify(responseBody));
                        response.end();
                        break;
                }
            }

//        response.end('<html><body><h1>Hello, World!</h1></body></html>');

        });
    }).listen(port); // Activates this server, listening on eventually port 5002.

};