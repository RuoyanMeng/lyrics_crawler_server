const router = require('express').Router();
const axios = require('axios');
const BASE_URL = 'https://accounts.spotify.com'
const scope = ['user-modify-playback-state', 'user-read-currently-playing', 'user-read-playback-state', "streaming", "user-read-email", "user-read-private"]


let redirect_uri = process.env.REDIRECT_URI || "http://localhost:5000/callback"

let env = null;

router.route('/login/:env').get((req, res) => {

    env = req.params.env;
    let _url = BASE_URL + '/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.SPOTIFY_CLIENT_ID +
        '&redirect_uri=' + encodeURIComponent(redirect_uri) + '&scope=' + scope.join('%20');

    res.redirect(_url);

});

router.route('/callback').get((req, res) => {
    let refresh_token = null
    let code = req.query.code || null;
    let _url = 'https://accounts.spotify.com/api/token';
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('redirect_uri', redirect_uri);
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
    params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET);
    axios.post(_url, params)
        .then(resp => {
            refresh_token = resp.data.access_token
            if (env == "web") {
                let uri = process.env.FRONTEND_URI || 'http://localhost:3000';
            } else {
                let uri = process.env.REDIRECT_URI_M || "exp://127.0.0.1:19000"
                let access_token = resp.data.access_token
                res.redirect(uri + "?access_token="+access_token)
            }

        })
        .catch(err => {
            res.send(err)
        })

})

module.exports = router;