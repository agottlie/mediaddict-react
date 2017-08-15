import React, { Component } from 'react';
import $ from 'jquery';

class AddMovie extends Component {
	
	handleMovieSubmit(event){
        event.preventDefault();
        $.ajax({
            url: `${this.props.url}/movies/find?q=${this.props.searchValue}`
        }).done((data) => {
            this.props.updateQuery(data.results);
        });
    }

    renderMovieQuery() {
        return this.props.queryResult.map((movie, i) => {
            let year=movie.release_date.substr(0, 4);
            let poster;
            if (movie.poster_path) {
                poster = "https://image.tmdb.org/t/p/w300/" + movie.poster_path;
            } else {
                poster = this.props.generic_image;
            }
            return (
                <li key={i} className="search-results">
                    <img src={poster} alt=""/>
                    <h3>{movie.title} - ({year})</h3>
                    <button id="pointer" onClick={(e) => {this.props.addMovie(e, movie)}}>Add Movie</button>
                </li>
            );
        });
    }

	render() {
		return (
	        <div className="show-search">
	        	<form onSubmit={this.handleMovieSubmit.bind(this)}>
                    <label>
                        Movie Name:
                        <input type="text" name="name" 
                            value={this.props.searchValue}
                            onChange={this.props.handleNameChange.bind(this)}
                            className="show-input-box"
                        />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <ul>
                    {this.renderMovieQuery()}
                </ul>
            </div>
	    );
	}
}

export default AddMovie;