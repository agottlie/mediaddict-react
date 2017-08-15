import React, { Component } from 'react';

class Leaderboard extends Component {
	componentDidMount() {
	 	this.props.setLeaders();
   	}

   	renderLeaderboard() {
   		return this.props.leaders.map((leader, i) => {
   			return(
   				<li className="leader-row" key={i}>
   					<div className="row-non-header">
   						{leader.name}
   					</div>
   					<div className="row-non-header">
   						{leader.score}
   					</div>
   				</li>
   			);
   		})
   	}

	render() {
		return (
   	   <div>
            <div className="main-title">mediAddict</div>
            <div className="title">Leaderboard</div>
            <ul className="leaderboard">
   	        	  <li className="leader-row">
                     <div className="row-header">
                        Name
                     </div>
                     <div className="row-header">
                        Score
                     </div>
                  </li>
                 {this.renderLeaderboard()}
            </ul>
         </div>
	    );
	}
}

export default Leaderboard;