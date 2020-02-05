const router = require('express').Router();
const BASE_URL = 'https://accounts.spotify.com'

var env = process.env.NODE_ENV || 'spotify';
var creds = require('../credentials')[env];

router.route('/login').get((req,res) => {

    // let redirect_uri = req.params.redirect_uri
    let redirect_uri = "http://localhost:3000/"
    let _url = BASE_URL + '/authorize' +
            '?response_type=token' +
            '&client_id=' + creds.client_id +
            '&redirect_uri=' + encodeURIComponent(redirect_uri) + '&scope=' + Object.values(creds.scope).join('%20');

    res.redirect(_url);

});

module.exports = router;