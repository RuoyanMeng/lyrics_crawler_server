const router = require('express').Router();
const axios = require('axios');
const $ = require('cheerio');
const BASE_URL = 'https://api.genius.com'

var env = process.env.NODE_ENV || 'genius';
var creds = require('../credentials')[env];

router.route('/fetch_lyrics').get((req,res) => {
    let song = req.body.song.toLowerCase();
    let artist = req.body.artist.toLowerCase();
    let lyrics_url = null
    console.log(song+artist)
    axios({
        url : '/search', 
        baseURL : BASE_URL,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + creds.client_access_token
        },
        data:{
            "q": song + artist
        }
    })
    .then( resp =>{

        let results = resp.data.response.hits;
        let rlength = results.length;
        
        for (let i = 0; i<rlength; i++){

            let _song = results[i].result.full_title.split(' by',1)[0].toLowerCase();
            let _artist = results[i].result.primary_artist.name.toLowerCase();

            console.log(_song+"....."+song)
            console.log(_artist+"....."+artist)
            if(_song==song && _artist==artist){
                
                lyrics_url = results[i].result.url;
                break;
            }
        }
    })
    .then(()=>{
        axios.get(lyrics_url)
        .then(resq=>{
            console.log($('.lyrics',resq.data))
            res.send($('.lyrics',resq.data).text())
        })
        .catch(err=>{
            res.send(err)
        })
    })
    .catch( err =>{
        res.send(err);
    })

});

// router.route('/web_scraping').get((req,res)=>{
//     url = "https://genius.com/Adele-hello-lyrics"
//     axios.get(url)
//     .then(resq=>{
//         console.log($('.lyrics',resq.data))
//         res.send($('.lyrics',resq.data).text())
//     })
//     .catch(err=>{
//         res.send(err)
//     })
// });

module.exports = router;