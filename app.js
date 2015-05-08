
var express = require('express')
    , stylus = require('stylus')
    , nib = require('nib')
    , request = require('request')
    , session = require('express-session')
    , request = require('request')
    , bodyParser = require('body-parser')
    , parseString = require('xml2js').parseString;

var EndpointDialer = function() {

    //  Scope.

    var self = this;
    app = this;
    this.reqid = 0;



    self.intialized = false

    self.compile = function(str, path) {
        return stylus(str)
            .set('filename', path)
            .use(nib())
    }


    self.initializeServer = function() {

        this.app = express()
        this.app.set('views', __dirname + '/views')
        this.app.set('view engine', 'jade')
        this.app.use(bodyParser.json()); // for parsing application/json
        this.app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
        this.app.use(session({ secret: 'Quick Demo', cookie: { maxAge: 6000000 }}))
        //app.use(express.logger('dev'))
        this.app.use(stylus.middleware(
            { src: __dirname + '/public'
                , compile: this.compile
            }
        ))
        this.app.use(express.static(__dirname + '/public'))

        this.app.get('/', function (req, res) {
            res.render('home',
                { title : 'Home Test' }
            )
        })
        this.app.post('/login' ,function (req, res) {
            var sess = req.session
            var username = req.body.username;
            var password = req.body.password;
            var ipAddress = req.body.ipaddress

            request.get({url:'http://'+ipAddress+'/getxml?location=status/systemunit',
                'auth': {
                    'user': username,
                    'pass': password,
                    'sendImmediately': false
                }}, function(err,httpResponse,body) {

                if (err)
                {
                    console.log("res:"+httpResponse+ " err:"+err)
                    sess.authenticated = false;
                    res.json({error: err, httpResponse: httpResponse })

                    return
                }

                parseString(body, function (err, result) {

                    if (err) {
                        console.log("res2:"+httpResponse.statusCode+ " err2:"+err)
                        sess.authenticated = false;
                        res.json({error: "parse error", httpResponse: httpResponse })
                        return
                    }
                    else {

                        sess.username = username;
                        sess.password = password;
                        sess.ipAddress = ipAddress;
                        sess.authenticated = true;

                        res.render('endpoint',{info:result.Status.SystemUnit[0]})


                    }

                });

            })

        })

        this.app.post('/placecall' ,function (req, res) {
            var sess = req.session
            if (!sess.authenticated)
            {
                res.json({error :'please authenticate again!'})
                return
            }
            var xmlString = '<Command><Dial command="True"><Number>'+uri+'</Number></Dial></Command>';
            var username = sess.username;
            var password = sess.password;
            var ipAddress = sess.ipAddress
            var uri = req.body.uri;
            var callrate = req.body.callRate;
            var xmlString = '<Command><Dial command="True"><Number>'+uri+'</Number></Dial></Command>';
            request.post({url:'http://'+ipAddress+'/putxml',
                    'auth': {
                        'user': username,
                        'pass': password,
                        'sendImmediately': false
                    },
                    'body': xmlString
                }, function(err,httpResponse,body) {

                if (err)
                {
                    console.log("res:"+httpResponse+ " err:"+err)
                    sess.authenticated = false;
                    res.json({error: err, httpResponse: httpResponse })

                    return
                }

                parseString(body, function (err, result) {

                    if (err) {
                        console.log("res2:"+httpResponse.statusCode+ " err2:"+err)
                        sess.authenticated = false;
                        res.json({error: "parse error", httpResponse: httpResponse })
                        return
                    }
                    else {

                        if (result) {

                            res.json(result.Command)
                        }
                        else
                            res.json({error: "nothing was returned from the api call"})

                    }

                });

            })

        })

        this.app.post('/senddtmf' ,function (req, res) {
            var sess = req.session
            if (!sess.authenticated)
            {
                res.json({error :'please authenticate again!'})
                return
            }

            var username = sess.username;
            var password = sess.password;
            var ipAddress = sess.ipAddress
            var dtmf = req.body.dtmf;
            var callrate = req.body.callRate;
            var xmlString = '<Command><DTMFSend command="True"><DTMFString>'+dtmf+'</DTMFString></DTMFSend></Command>';

            request.post({url:'http://'+ipAddress+'/putxml',
                'auth': {
                    'user': username,
                    'pass': password,
                    'sendImmediately': false
                },
                'body': xmlString
            }, function(err,httpResponse,body) {

                if (err)
                {
                    console.log("res:"+httpResponse+ " err:"+err)
                    sess.authenticated = false;
                    res.json({error: err, httpResponse: httpResponse })

                    return
                }

                parseString(body, function (err, result) {

                    if (err) {
                        console.log("res2:"+httpResponse.statusCode+ " err2:"+err)
                        sess.authenticated = false;
                        res.json({error: "parse error", httpResponse: httpResponse })
                        return
                    }
                    else {

                        if (result) {
                            res.json(result.Command)
                        }
                        else
                            res.json({error: "nothing was returned from the api call"})

                    }

                });

            })

        })

        this.app.post('/disconnect' ,function (req, res) {
            var sess = req.session
            if (!sess.authenticated)
            {
                res.json({error :'please authenticate again!'})
                return
            }

            var username = sess.username;
            var password = sess.password;
            var ipAddress = sess.ipAddress
            var callid = req.body.callid;

            var xmlString = '<Command><Call><Disconnect command="True"><CallId>'+callid+'</CallId></Disconnect></Call></Command>';

            request.post({url:'http://'+ipAddress+'/putxml',
                'auth': {
                    'user': username,
                    'pass': password,
                    'sendImmediately': false
                },
                'body': xmlString
            }, function(err,httpResponse,body) {

                if (err)
                {
                    console.log("res:"+httpResponse+ " err:"+err)
                    sess.authenticated = false;
                    res.json({error: err, httpResponse: httpResponse })

                    return
                }

                parseString(body, function (err, result) {

                    if (err) {
                        console.log("res2:"+httpResponse.statusCode+ " err2:"+err)
                        sess.authenticated = false;
                        res.json({error: "parse error", httpResponse: httpResponse })
                        return
                    }
                    else {

                        if (result) {
                            res.json(result.Command)
                        }
                        else
                            res.json({error: "nothing was returned from the api call"})

                    }

                });

            })

        })

        this.app.post('/callinfo' ,function (req, res) {
            var sess = req.session
            if (!sess.authenticated)
            {
                res.json({error :'please authenticate again!'})
                return
            }

            var username = sess.username;
            var password = sess.password;
            var ipAddress = sess.ipAddress

            request.get({url:'http://'+ipAddress+'/getxml?location=status/call',
                'auth': {
                    'user': username,
                    'pass': password,
                    'sendImmediately': false
                }}, function(err,httpResponse,body) {

                if (err)
                {
                    console.log("res:"+httpResponse+ " err:"+err)
                    sess.authenticated = false;
                    res.json({error: err, httpResponse: httpResponse })

                    return
                }

                parseString(body, function (err, result) {

                    if (err) {
                        console.log("res2:"+httpResponse.statusCode+ " err2:"+err)
                        sess.authenticated = false;
                        res.json({error: "parse error", httpResponse: httpResponse })
                        return
                    }
                    else {

                        if (result.Status) {

                            res.render('callinfo', {callinfo: result.Status.Call})
                        }
                        else
                            res.render('callinfo')

                    }

                });

            })

        })

    }

    self.startServer = function() {
        this.app.listen(3000)
    }

}

var theApp = new EndpointDialer();
theApp.initializeServer();
theApp.startServer()
