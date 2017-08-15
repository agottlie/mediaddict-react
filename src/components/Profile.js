import React, { Component } from 'react';
import $ from 'jquery';

class Profile extends Component {

	componentDidMount() {
	 	this.getShows();
        this.getMovies();
        this.props.getEpisodesAndMovies('listWeek', 'today');
   	}

   	getShows() {
        $.ajax({
            url: `${this.props.url}/shows/${this.props.user.id}`
        }).done((data) => {
            this.props.setShows(data);
        });
    }

    getMovies() {
    	$.ajax({
            url: `${this.props.url}/movies/${this.props.user.id}`
        }).done((data) => {
            this.props.setMovies(data);
        });
    }

    handleShowClick(e, index) {
    	this.props.setCurrentShow(e, index);
    }

    handleMovieClick(index) {
    	this.props.setCurrentMovie(index);
    	this.props.setDisplay("myMovies");
    }

    renderShows(){
        if (this.props.myShows[0]) {
	        let watched = [],
		        notWatched = [],
	            watchedCount = 0,
                notWatchedCount = 0;
            watched.push(
                <div>
                    <h2 className="showHeader">Up to Date</h2>
                </div>
            )
            notWatched.push(
                <div>
                    <h2 className="showHeader">Watching</h2>
                </div>
            )
	        this.props.myShows.forEach((show,i) => {
	            let count = 0;
	            this.props.episodes.forEach((episode) => {
	            	if (episode.show_name === show.name && !episode.watched) {
	            		count++;
	            	}
	            })
	            if (count === 0) {
                    watchedCount++;
                    watched.push(
                        <li className="list" key={i} onClick={(e) => {this.handleShowClick(e, i)}}>
                            <img src={show.image} alt=""/>
                            <h3>{show.name}</h3>
		                </li>
                    );
                } else {
                    notWatchedCount++;
                    notWatched.push(
                        <li className="list" key={i} onClick={(e) => {this.handleShowClick(e, i)}}>
                            <img src={show.image} alt=""/>
                            <h3>{show.name}</h3>
		                </li>
                    );
                }
	        })
	        if (watchedCount === 0) {
                watched.pop();
            }
            if (notWatchedCount === 0) {
                notWatched.pop();
            }

            notWatched.push(watched);

            return notWatched;
	    } else {
	    	return(
	    		<li onClick={(e) => {this.props.setDisplay("addShow")}}>Add Show</li>
	    	)
	    }
    }

    renderMovies(){
        if (this.props.myMovies[0]) {
            let watched = [],
		        notWatched = [],
		        upcoming = [],
		        d = new Date(),
	            watchedCount = 0,
                notWatchedCount = 0,
                upcomingCount = 0;
            watched.push(
                <div>
                    <h2 className="movieHeader">Completed</h2>
                </div>
            )
            notWatched.push(
                <div>
                    <h2 className="movieHeader">Not Watched</h2>
                </div>
            )
            upcoming.push(
                <div>
                    <h2 className="movieHeader">Upcoming</h2>
                </div>
            )
	        this.props.myMovies.forEach((movie,i) => {
	            let premieredate = new Date(movie.premieredate)
	            if (movie.watched) {
                    watchedCount++;
                    watched.push(
                        <li className="list" key={i} onClick={(e) => {this.handleMovieClick(i)}}>
		                    <img src={movie.image} alt=""/>
                            <h3>{movie.name}</h3>
		                </li>
                    );
                } else if (!movie.watched && d>=premieredate ) {
                    notWatchedCount++;
                    notWatched.push(
                        <li className="list" key={i} onClick={(e) => {this.handleMovieClick(i)}}>
		                    <img src={movie.image} alt=""/>
                            <h3>{movie.name}</h3>
		                </li>
                    );
                } else {
                    upcomingCount++;
                    upcoming.push(
                        <li className="list" key={i} onClick={(e) => {this.handleMovieClick(i)}}>
		                    <img src={movie.image} alt=""/>
                            <h3>{movie.name}</h3>
		                </li>
                    );
                }
	        })
	        if (watchedCount === 0) {
                watched.pop();
            }
            if (notWatchedCount === 0) {
                notWatched.pop();
            }
            if (upcomingCount === 0) {
                upcoming.pop();
            }

            upcoming.push(notWatched);
            upcoming.push(watched);

            return upcoming;

	    } else {
	    	return(
	    		<li onClick={(e) => {this.props.setDisplay("addMovie")}}>Add Movie</li>	    	)
	    }
    }

	render() {
		return (
	        <div className="profile">
                <div className="shows">
                	<div className="tv-images">
                        <div className="tv-img"></div>
                        <div className="tv-img"></div>
                        <div className="tv-img"></div>
                    </div>
                    <h2>MY SHOWS</h2>
	                <ul>
	                	{this.renderShows()}
	                </ul>
	            </div>
              
                <div className="upcoming">
                	<div className="title">mediAddict</div>
                    <div id="upcoming">
                        <h2>UPCOMING</h2>
                    	<div id="calendar"></div>
                    </div>
                </div>

                <div className="movies">
                    <div className="movie-images">
                        <div className="movie-img"></div>
                        <div className="movie-img"></div>
                        <div className="movie-img"></div>
                    </div>
                    <h2>MY MOVIES</h2>
                    <ul>
                        {this.renderMovies()}
                    </ul>
                </div>
            </div>
	    );
	}
}

export default Profile;