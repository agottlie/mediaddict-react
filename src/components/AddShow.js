import React, { Component } from 'react';
import $ from 'jquery';

class AddShow extends Component {

    handleShowSubmit(event){
        event.preventDefault();
        $.ajax({
            url: "http://api.tvmaze.com/search/shows",
            data: { q: this.props.searchValue }
        }).done((data) => {
            this.props.updateQuery(data);
        });
    }

    renderShowQuery() {
        return this.props.queryResult.map((show, i) => {
            let network,
                poster;
            if (show.show.image) {
                poster = show.show.image.medium;
            } else {
                poster = this.props.generic_image;
            }

            if (show.show.network) {
                network = show.show.network.name;
            } else {
                network = show.show.webChannel.name;
            }
            return (
                <li key={i} className="search-results" onClick={(e) => {this.props.setShow(e, show.show)}}>
                    <img src={poster} alt=""/>
                    <h3>{show.show.name} ({network})</h3>
                </li>
            );
        });
    }

	render() {
		return (
	        <div className="show-search">
	        	<div className="instructions">
                    <p>Search for a show you'd like to follow in the below search box.  When the episodes appear, check off which ones you've already watched, so that only unseen and upcoming episodes are tracked.  You can still read recaps for the episodes you've watched.</p>
                </div>
                <form onSubmit={this.handleShowSubmit.bind(this)}>
                    <label>
                        Show Name:
                        <input type="text"
                            name="name" 
                            value={this.props.searchValue}
                            onChange={this.props.handleNameChange.bind(this)}
                            className="show-input-box"
                        />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                
                <ul>
                    {this.renderShowQuery()}
                </ul>
            </div>
	    );
	}
}

export default AddShow;