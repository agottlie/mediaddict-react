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
            return (
                <li 
                  key={i}
                >
                    <span>{movie.title} - ({year})</span>
                    <button onClick={(e) => {this.props.addMovie(e, movie)}}>Add</button>
                </li>
            );
        });
    }

	render() {
		return (
	        <div>
	        	<form onSubmit={this.handleMovieSubmit.bind(this)}>
                    <label>
                        Movie Name:
                        <input type="text" name="name" 
                            value={this.props.searchValue}
                            onChange={this.props.handleNameChange.bind(this)}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <div>
                    {this.renderMovieQuery()}
                </div>
            </div>
	    );
	}
}

export default AddMovie;