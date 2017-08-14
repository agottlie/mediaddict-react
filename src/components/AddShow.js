import React, { Component } from 'react';
import $ from 'jquery';

class AddShow extends Component {
	componentDidMount() {
        $('.instructions').css('display', 'block');
    }

    handleShowSubmit(event){
        event.preventDefault();
        $('.instructions').css('display', 'none');
        $.ajax({
            url: "http://api.tvmaze.com/search/shows",
            data: { q: this.props.searchValue }
        }).done((data) => {
            this.props.updateQuery(data);
        });
    }

    renderShowQuery() {
        return this.props.queryResult.map((show, i) => {
            return (
                <li 
                  key={i}
                >
                    <span>{show.show.name}</span>
                    <button onClick={(e) => {this.props.setShow(e, show.show)}}>Select</button>
                </li>
            );
        });
    }

	render() {
		return (
	        <div>
	        	<form onSubmit={this.handleShowSubmit.bind(this)}>
                    <label>
                        Show Name:
                        <input type="text" name="name" 
                            value={this.props.searchValue}
                            onChange={this.props.handleNameChange.bind(this)}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <div className="instructions">
                    <p>Search for a show you'd like to follow in the above search box.  When the episodes appear, check off which ones you've already watched, so that only unseen and upcoming episodes are tracked.  You can still read recaps for the episodes you've watched.</p>
                </div>
                <div>
                    {this.renderShowQuery()}
                </div>
            </div>
	    );
	}
}

export default AddShow;