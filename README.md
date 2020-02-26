# Lyrivs Crawler (Server)

## Updates

* 2020.02.20. Add email sending route for user feedback function. 
* 2020.02.13. Improve lyrics matching flexibility. 


## What is it?
Lyrics Crawler is a full-stack web application. It can sync showing lyrics while playing music on Spotify. If users are Spotify premium, it can also be used as a web player and streaming the content between different devices. This project is developed by React ([frontend](https://github.com/RuoyanMeng/lyrics_crawler_client)) and NodeJS ([backend](https://github.com/RuoyanMeng/lyrics_crawler_server)), data is provided by Spotify API and Genius API. More data sources will be added in the future to improve user experience. 

## Link to running application
[Lyrics crawler](https://lyrics-crawler.herokuapp.com/)

## To start a local version
First, write the below commands in your terminal (replacing XXXX AND YYYY with your actual client id and secret from the page where you registered your application)
<pre><code>export SPOTIFY_CLIENT_ID=XXXX</code></pre>
<pre><code>export SPOTIFY_CLIENT_SECRET=YYYY</code></pre>
<pre><code>export GENIUS_CLIENT_SECRET=YYYY</code></pre>

Then, to start a local version, download and run:
<pre><code>npm install</code></pre>
<pre><code>npm start</code></pre>

### Frameworks used
* Node.js

### Libraries used
* axios
* express.js
* cheerio
* nodemailer
* cors

### API used
* Spotify Web API
* Genius API
