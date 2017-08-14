import React, { Component } from 'react';

class Calendar extends Component {

    componentDidMount() {
        this.props.getEpisodesAndMovies('month', 7);
    }


    render() {
        return (
            <div id="calendar"></div>
        );
    }

}

export default Calendar;