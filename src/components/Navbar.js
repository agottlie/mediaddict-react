import React, { Component } from 'react';

class Display extends Component {

    render() {
        let navDisplay;
        if (this.props.display === "new" || this.props.display === "login" || this.props.display === "logout") {
            navDisplay = <div></div>;
        } else {
            navDisplay = 
                <div className="nav">
                    <div className='points'>
                        <h4>{this.props.user.name}'s Points: <span className="points-value">{this.props.user.score}</span></h4>
                    </div>
                    <ul>
                        <li onClick={(e) => {this.props.setDisplay("profile")}}>Profile</li>
                        <li onClick={(e) => {this.props.setDisplay("calendar")}}>Calendar</li>
                        <li onClick={(e) => {this.props.setDisplay("addShow")}}>Add Show</li>
                        <li onClick={(e) => {this.props.setDisplay("addMovie")}}>Add Movie</li>
                        <li onClick={(e) => {this.props.setDisplay("leaderboard")}}>Leaderboard</li>
                        <li onClick={(e) => {this.props.logout()}}>Logout</li>
                    </ul>
                </div>;
        }

        return (
            <div>
                {navDisplay}
            </div>
        );
    }
}

export default Display;