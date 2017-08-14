import React, { Component } from 'react';
import $ from 'jquery';

class Comment extends Component {

    addComment(event) {
        event.preventDefault();
        let d = new Date();
        $.ajax({
            url: `${this.props.url}/comments`,
            method: "POST",
            data: { comment: this.props.searchValue, mediatype: this.props.media, media_id: this.props.media_id, user_name: this.props.user.name, post_date: d, user_id: this.props.user.id }
        }).done((data) => {
            this.props.showComments(this.props.current)
        })
    }

    renderComments() {
    	return this.props.comments.map((comment, i) => {
    		return (
    			<li key={i}>
    				<h3>{comment.comment}</h3>
    				<p>posted on {comment.post_date} by {comment.user_name}</p>
    			</li>
    		)
    	})
    }

    render() {
        return (
            <div 
            	className={this.props.className}
            	id={this.props.id}
            >
            	<form onSubmit={this.addComment.bind(this)}>
                    <label>
                        Add Comment:
                        <input type="text" name="name" 
                            value={this.props.searchValue}
                            onChange={this.props.handleNameChange.bind(this)}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <ul>
                	{this.renderComments()}
                </ul>
                <div 
                	className="close"
                	onClick={(e) => {this.props.hideComments(this.props.current)}}
                >
                	X
                </div>
            </div>
        );
    }

}

export default Comment;