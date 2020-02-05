const router = require('express').Router();
const BASE_URL = 'https://api.genius.com/oauth'

var env = process.env.NODE_ENV || 'genius';
var creds = require('../credentials')[env];

router.route('/loging').get((req,res) => {

    // let redirect_uri = req.params.redirect_uri
    let redirect_uri = "http://localhost:3000/"
    let _url = BASE_URL + '/authorize' +
            '?response_type=code' +
            '&client_id=' + creds.client_id +
            '&redirect_uri=' + encodeURIComponent(redirect_uri) ;

    res.redirect(_url);

});

module.exports = router;