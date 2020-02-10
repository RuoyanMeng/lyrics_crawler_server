const router = require('express').Router();
const axios = require('axios');
const BASE_URL = 'https://accounts.spotify.com'

var env = process.env.NODE_ENV || 'spotify';
var creds = require('../credentials')[env];
let redirect_uri = process.env.REDIRECT_URI || "http://localhost:5000/callback"

router.route('/login').get((req,res) => {

    // let redirect_uri = req.params.redirect_uri
    
    let _url = BASE_URL + '/authorize' +
            '?response_type=code' +
            '&client_id=' + process.env.SPOTIFY_CLIENT_ID +
            '&redirect_uri=' + encodeURIComponent(redirect_uri) + '&scope=' + Object.values(creds.scope).join('%20');

    res.redirect(_url);

});

router.route('/callback').get((req,res)=>{
    let refresh_token = null
    let code  = req.query.code || null;
    let _url = 'https://accounts.spotify.com/api/token';
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('redirect_uri', redirect_uri);
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
    params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);
    axios.post(_url,params)
    .then(resp=>{
        refresh_token = resp.data.access_token
        let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
        var access_token = resp.data.access_token
        
        res.status(200).redirect(uri + '?access_token=' + access_token)
    })
    .catch(err=>{
        res.send(err)
    })

})

module.exports = router;