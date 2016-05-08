var moment = require('moment')

module.exports = function (app, dbCli) {

    // api ---------------------------------------------------------------------
    app.get('/api/turner', function (req, res) {

        dbCli.execute('SELECT * from turner_by_date LIMIT 10', function (err, result) {
            if (err) {
                res.send(err)
            } else {
                res.json(result.rows)
            }
        });

    });

    app.post('/api/turner', function (req, res) {

        console.log(req.body.text);
        if (req.body.text) {

            var original_text = req.body.text;
            var turned_text = req.body.text;

            var momDate = moment();
            var qryDate = momDate.format('YYYY-MM-DD');
            var qryTS = momDate.format('YYYY-MM-DD HH:mm:ss');


            dbCli.execute('INSERT INTO turner_by_date (date, ts, original_text, turned_text) VALUES (\'' + qryDate + '\', \'' + qryTS + '\', \'' + original_text + '\', \'' + turned_text + '\');', function (err, result) {
                if (err) {
                    res.send(err)
                    return;
                } else {
                    res.json({"original_text": original_text, "turned_text": turned_text})
                }
            });

        } else {
            res.status(400).send("cannot turn without text.")
        }
    });

    app.delete('/api/turner/:id', function (req, res) {

    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./server/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};