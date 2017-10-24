# mediAddict

## Synopsis

This is a full stack app for all the media addicts out there.  There are so many shows to follow and new movies coming out every week, and sometimes it becomes a bit overwhelming to keep track of it all.  mediAddict allows you to track your favorite pieces of media, know when they will be airing, and be able to read reviews/recaps about them after you've watched.  The app makes use of MVC modeling, using a local database to store info on shows, movies, users, comments, and more, and accesses external APIs from TV Maze, TMDB, and NY Times Movie reviews.  Show recaps are also scraped from the AVClub.  Users can create accounts using an encrypted password; add and delete shows, movies and episodes; and track their viewing progress on a global leaderboard.


## User Stories


* As a media consumer, I'd like a better platform to track what I watch.
* As a show watcher, I'd like to have a good system to plan my viewing habits.
* With so many shows and movies coming out each week, I need a place to organize my options so I don't miss out on things I'd like to see.


## Requirements


Several npm packages are needed for this app to work:

axios
bcryptjs
body-parser
cheerio
cookie-parser
cors
dotenv
express
express-session
fsecurity
jquery
morgan
pg-promise
request
util
fullcalendar
moment
react
react-dom
react-moment
react-scripts

To install these, first go to your source directory and use 'npm install' and then 'npm init' to initialize npm.  Then type 'npm install --save [package name]' for each of the ones listed above.

You will also need API keys for NY Times Movie Reviews and TMDB.

Create a .env file and store your keys as NYT_KEY & TMDB_KEY.

Once everything is set up, you will need to access the repos for the React Server and the Express server:
https://github.com/agottlie/mediAddict (use localhost:8080 and run 'nodemon -e html,css,js' in your terminal)
https://github.com/agottlie/mediaddict-react (use localhost:3000 and run 'npm start' in your terminal)
use localhost:8080 as the url, and run 'nodemon -e html,css,js' in your terminal.


## Public Location

The app can be accessed at https://mediaddict.surge.sh


## Motivation

This is my final project for Web Development Immersive at General Assembly.  We were tasked with creating a full stack app utilizing local databases, RESTful routes, external API calls, and React.  I decided to create something that I'd actually want to use as an obsessive TV watcher.


## Approach

The app required a lot of moving pieces and a fairly extensive structure setup.  To start, I set up my API (index, models/services and controllers) and installed the necessary packages.  To set up user authentification, I utilized a structure implemented in the General Assembly WDI class that passes tokens to the React server.

After getting that working, I went about building out all the RESTful routing.  This included paths for creating users, and creating, editing, and deleting shows, episodes, and movies.  I at first seeded a local db and utilized only local data.

Once this was set up, I created a path for searching for movies and shows.  This involved accessing the TV Maze and TMDB APIs in order to pull in the necessary info.  Users can navigate at different levels of granularity with shows, accessing episode info as well.

With the routes working, it was time to create the React server to render everything.  I wanted a simple interface where everything can be viewed on one page.  This involved multiple components to handle all the different views, and passing through of many props to keep the experience seemless.

Additional steps included setting up a calendar view to see all upcoming events, as well as implementing leaderboard to track who's been watching the most media.  Comments were then implemented for people to discuss shows/movies they've viewed.  Finally, functionality was included to either connect to an API or do some primitive web scraping in order source reviews/recaps for any media that's been watched.

The last step was to style the html and comment up my code.