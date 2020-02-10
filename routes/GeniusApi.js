const router = require('express').Router();
const axios = require('axios');
const $ = require('cheerio');
const BASE_URL = 'https://api.genius.com'


// var env = process.env.NODE_ENV || 'genius';
// var creds = require('../credentials')[env];

let redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:5000/callback'

router.route('/fetch_lyrics').get((req, res) => {
    let song = req.query.song.toLowerCase();
    let artist = req.query.artist.toLowerCase();

    // let song = req.body.song.toLowerCase();
    // let artist = req.body.artist.toLowerCase();
    let lyrics_url = null

    axios({
        url: '/search',
        baseURL: BASE_URL,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + process.env.GENIUS_ACCESS_TOKEN
        },
        data: {
            "q": song + artist
        }
    })
        .then(resp => {

            let results = resp.data.response.hits;
            let rlength = results.length;

            for (let i = 0; i < rlength; i++) {

                let _song = results[i].result.full_title.trim().split(' by', 1)[0].toLowerCase();
                let _artist = results[i].result.primary_artist.name.toLowerCase();
                
                console.log(song)
                console.log(results[i].result.full_title.text.trim())
                console.log(_artist + "....." + artist)
                if (_song == song && _artist == artist) {

                    lyrics_url = results[i].result.url;
                    break;
                }
            }
        })
        .then(() => {
            if (lyrics_url == null || lyrics_url == {}) {
                res.send('Opps...')
            }
            else {
                axios.get(lyrics_url)
                    .then(resq => {
                        res.send($('.lyrics', resq.data).text())
                    })
                    .catch(err => {
                        res.send(err)
                    })
            }


        })
        .catch(err => {
            res.send(err);
        })

});



module.exports = router;