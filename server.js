const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world\n');
  });


const SpotifyAuth = require('./routes/SpotifyAuth');
const GeniusApi = require('./routes/GeniusApi');
const Mail = require('./routes/Mail')

app.use('/', SpotifyAuth);
app.use('/', GeniusApi);
app.use('/', Mail);

app.listen(port, ()=>{
      console.log(`Running on http://localhost:${port}`);
    });