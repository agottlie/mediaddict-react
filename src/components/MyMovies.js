import React, { Component } from 'react';
import Moment from 'react-moment';
import $ from 'jquery';
import 'moment-timezone';
import Comment from './Comment';

class MyMovies extends Component {
	showComments(movie) {
        $.ajax({
            url: `${this.props.url}/comments/${movie.tmdb_id}?media=movie`
        }).done((data) => {
            this.props.setComments(data);
        });
        $('.comment').css('display', 'block');
    }

    hideComments(episode) {
        $('.comment').css('display', 'none');
    }

	updateWatched() {
		if (this.props.currentMovie.watched === false) {
			$.ajax({
	            url: `${this.props.url}/movies/${this.props.currentMovie.id}`,
	            method: "PUT",
	            data: {watched: true, score: this.props.user.score + 10, user_id: this.props.user.id}
	        }).done((data) => {        
                $.ajax({
	                url: `${this.props.url}/movies/recap`,
	                method: "PUT",
	                data: {
	                    id: this.props.currentMovie.id,
	                    query: this.props.currentMovie.name
	                }
	            }).done((data) => {
		            this.props.setScore(10);
		        })
	        });
    	}	
	}


	render() {
		let status;
		if (new Date() < new Date(this.props.currentMovie.premieredate)) {
			status = <h2>Status: Upcoming</h2>;
		} else if (this.props.currentMovie.watched === true) {
			status = 
				<div>
					<h2>Status: Watched</h2>
					<a href={this.props.currentMovie.recap_url}>Read Review</a>
					<button onClick={(e) => {this.showComments(this.props.currentMovie)}}>Show Comments</button>
                    <div 
                        className="comment"
                    >
                        <Comment 
                            className="innerComment"
                            media="movie"
                            media_id={this.props.currentMovie.tmdb_id}
                            user={this.props.user}
                            url={this.props.url}
                            searchValue={this.props.searchValue}
                            handleNameChange={this.props.handleNameChange}
                            comments={this.props.comments}
                            current={this.props.currentMovie}
                            showComments={this.showComments.bind(this)}
                            hideComments={this.hideComments.bind(this)}
                        />
                    </div>
				</div>;
		} else {
			status = 
				<div>
					<h2>Status: Not Watched</h2>
					<div className="complete">
						<h4>Watched?</h4>
		                <input 
		                    type="checkbox"
		                    onClick={(e) => {this.updateWatched()}}
		                />
	                </div>
	            </div>;
		}

		return (
	        <div className="movie-info">
	        	<img src={this.props.currentMovie.image} alt=""/>
	        	<h1>{this.props.currentMovie.name}</h1>
	        	<h3>Release Date: <Moment format="MMMM D, YYYY">{this.props.currentMovie.premieredate}</Moment></h3>
	        	<h3>Run Time: {this.props.currentMovie.length} minutes</h3>
	        	<br />
	        	<div>
	        		{status}
	        	</div>
	        	<h3 className="remove" onClick={(e) => {this.props.delete(e, "movies", this.props.currentMovie.id)}}>Remove</h3>
	        </div>
	    );
	}
}

export default MyMovies;