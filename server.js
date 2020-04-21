const express = require('express');
const cors = require('cors');
const axios = require('axios');


const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world\n');
  });

var expiryDate;
global.token;

check_token = (req, res, next) =>{
  let now = new Date();
  if(now < expiryDate){
    return next()
  }else{
    axios({
      url: '/oauth2/token',
      baseURL: 'https://account.kkbox.com',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `client_id=${encodeURIComponent(process.env.KKBOX_CLIENT_ID)}&client_secret=${encodeURIComponent(process.env.KKBOX_CLIENT_SECRET)}&grant_type=client_credentials`
      })
      .then(resp=>{
          let now = new Date();
          let expires_in = resp.data.expires_in;
          global.token  = resp.data.access_token;
          expiryDate = new Date(now.getTime() + expires_in*1000);
      })
      .then(()=>{
          return next();
      })
      .catch(err=>{
        console.log(err)
      })
  }
}

const SpotifyAuth = require('./routes/SpotifyAuth');
const GeniusApi = require('./routes/GeniusApi');
const Mail = require('./routes/Mail')

app.use('/', SpotifyAuth);
app.use('/', check_token, GeniusApi);
app.use('/', Mail);

app.listen(port, ()=>{
      console.log(`Running on http://localhost:${port}`);
      axios({
        url: '/oauth2/token',
        baseURL: 'https://account.kkbox.com',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `client_id=${encodeURIComponent(process.env.KKBOX_CLIENT_ID)}&client_secret=${encodeURIComponent(process.env.KKBOX_CLIENT_SECRET)}&grant_type=client_credentials`
      })
        .then(resp=>{
            let now = new Date();
            let expires_in = resp.data.expires_in;
            global.token  = resp.data.access_token;
            expiryDate = new Date(now.getTime() + expires_in*1000);
            
        })
        .catch(err=>{
          console.log(err)
        })

      
      });