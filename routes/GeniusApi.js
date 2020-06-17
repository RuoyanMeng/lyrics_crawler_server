const router = require('express').Router();
const axios = require('axios');
const $ = require('cheerio');
// const BASE_URL = 'https://api.genius.com'


// var env = process.env.NODE_ENV || 'genius';
// var creds = require('../credentials')[env];

let redirect_uri =
    process.env.REDIRECT_URI ||
    'http://localhost:5000/callback'

router.route('/fetch_lyrics').get((req, res) => {
    
    let song = req.query.song.toLowerCase();
    let artist = req.query.artist.toLowerCase();
    let album  = req.query.album.toLowerCase();
    let lyrics_url = null;
    let BASE_URL = null;
    let bearer = null;
   
    //see if is Chinese song
    let pattern = new RegExp("[\u4E00-\u9FA5]+");
    if(pattern.test(song)||pattern.test(artist)||pattern.test(album)){

        BASE_URL = 'https://api.kkbox.com/v1.1';
        // bearer = process.env.KKBOX_ACCESS_TOKEN;
        bearer = global.token;

        axios({
            url: '/search',
            baseURL: BASE_URL,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                "Authorization": "Bearer " + bearer
            },
            params: {
                "q": song +' ' + artist,
                "type": "track",
                "territory": "HK",
                "limit":"10"
            }
            })
            .then(resp => {


                let results = resp.data.tracks.data;
                let rlength = results.length;

    
                for (let i = 0; i < rlength; i++) {
    
                    let _song = results[i].name.toLowerCase();
                    let _album = results[i].album.name.toLowerCase().replace("，",",").split(" -")[0];
             
                    if ( (song.includes(_song) || _song.includes(song)) && (album.includes(_album)||_album.includes(album)) ) {
                        lyrics_url = results[i].url;
                        break;
                    }
                }
            })
            .then(() => {
                if (lyrics_url == null || lyrics_url == {}) {
                    res.send('Oops! No results found')
                }
                else {
                    axios.get(lyrics_url)
                        .then(resq => {
                            let lyrics = $('.lyrics', resq.data).text()
                            if (JSON.stringify(lyrics) === '{}') {
                                res.send('Oops! No results found')
                            } else {
                                
                                lyrics = lyrics + "\nSource: KKBOX"
                                res.send(lyrics)
                            }
    
                        })
                        .catch(err => {
                            //res.send(err)
                            console.log(err)

                        })
                }
            })
            .catch(err => {
                //res.send(err);
                console.log(err)
            })
    
    }else{
        BASE_URL = 'https://api.genius.com';
        bearer = process.env.GENIUS_ACCESS_TOKEN;

        axios({
            url: '/search',
            baseURL: BASE_URL,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                "Authorization": "Bearer " + bearer
            },
            params: {
                "q": song +' ' + artist
            }
            })
            .then(resp => {
    
    
                let results = resp.data.response.hits;
                let rlength = results.length;
    
                for (let i = 0; i < rlength; i++) {
    
                    let _song = results[i].result.full_title.trim().split(' by', 1)[0].toLowerCase();
                    let _artist = results[i].result.primary_artist.name.toLowerCase().replace(/[^\x20-\x7E-ZÀ-ÿ]/g, '');
                    
                    if ((song.includes(_song) || _song.includes(song)) && _artist == artist) {
                        
                        lyrics_url = results[i].result.url;
                        break;
                    }
                }
            })
            .then(() => {
                if (lyrics_url == null || lyrics_url == {}) {
                    res.send('Oops! No results found')
                }
                else {
                    axios.get(lyrics_url)
                        .then(resq =>{
                            let lyrics = $('.lyrics', resq.data).text()
                            if (JSON.stringify(lyrics) === '{}') {
                                res.send('Oops! No results found')
                            } else {
                                lyrics = lyrics + "\n Source: GENIUS"
                                res.send(lyrics) 
                            }
    
                        })
                        .catch(err => {
                            res.send(err)
                        })
                }
    
    
            })
            .catch(err => {
                res.send(err);
            })
    
    }

    
});



module.exports = router;