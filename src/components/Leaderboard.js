import React, { Component } from 'react';

class Leaderboard extends Component {
	componentDidMount() {
	 	this.props.setLeaders();
   	}

   	renderLeaderboard() {
   		return this.props.leaders.map((leader, i) => {
   			return(
   				<li key={i}>
   					<div>
   						{leader.name}
   					</div>
   					<div>
   						{leader.score}
   					</div>
   				</li>
   			);
   		})
   	}

	render() {
		return (
	        <div>
	        	{this.renderLeaderboard()}
            </div>
	    );
	}
}

export default Leaderboard;