import React, { Component } from 'react';
import AddMovie from './AddMovie';
import AddShow from './AddShow';
import Calendar from './Calendar';
import Episodes from './Episodes';
import Leaderboard from './Leaderboard';
import Profile from './Profile';
import MyMovies from './MyMovies';
import MyShows from './MyShows';
import $ from 'jquery';
import 'fullcalendar';
import '../css/fullcalendar.css'

class Display extends Component {
    constructor(props) {
        super(props)
        this.state = {
            events: [],
            episodes: []         
        }
    }

    getEpisodesAndMovies(view, day) {
        $.ajax({
            url: `${this.props.url}/episodes/${this.props.user.id}`
        }).done((data) => {
            let episodes = [];
            data.forEach((episode) => {
                episodes.push({ title: episode.show_name, start: episode.airdate, color: "green" });
            })
            this.setState({
                events: episodes,
                episodes: data
            });
            $.ajax({
                url: `${this.props.url}/movies/${this.props.user.id}`
            }).done((data) => {
                let movies = this.state.events;
                data.forEach((movie) => {
                    movies.push({ title: movie.name, start: movie.premieredate, color: "red" });
                })
                this.setState({
                    events: movies
                }, function complete() {
                    let right;
                    if (view === "month") {
                        right = 'month,agendaWeek,agendaDay'
                    } else {
                        right = false;
                    }
                    $('#calendar').fullCalendar({
                        defaultView: view,
                        firstDay: day,
                        header: {
                            left: 'prev,next today',
                            center: 'title',
                            right: right
                        },
                        events: this.state.events
                    });
                });
            });
        });
    }

    render() {
        let displayElement;

//---------------------PROFILE VIEW--------------------------------
        if (this.props.display === "profile") {
            displayElement =
                <Profile 
                    user={this.props.user}
                    url={this.props.url}
                    myShows={this.props.myShows}
                    myMovies={this.props.myMovies}
                    setShows={this.props.setShows}
                    setMovies={this.props.setMovies}
                    setDisplay={this.props.setDisplay}
                    setCurrentShow={this.props.setCurrentShow}
                    setCurrentMovie={this.props.setCurrentMovie}
                    getEpisodesAndMovies={this.getEpisodesAndMovies.bind(this)}
                    episodes={this.state.episodes}
                />;

//---------------------CALENDAR VIEW--------------------------------
        } else if (this.props.display === "calendar") {
            displayElement = 
                <Calendar
                    getEpisodesAndMovies={this.getEpisodesAndMovies.bind(this)}
                />;

//---------------------ADD SHOW VIEW--------------------------------
        } else if (this.props.display === "addShow") {
            displayElement = 
                <AddShow
                    searchValue={this.props.searchValue}
                    handleNameChange={this.props.handleNameChange}
                    queryResult={this.props.queryResult}
                    updateQuery={this.props.updateQuery}
                    setShow={this.props.setShow}
                />;

//---------------------EPISODES VIEW--------------------------------
        } else if (this.props.display === "episodes") {
            displayElement = 
                <Episodes 
                    episodeList={this.props.episodeList}
                    updateWatched={this.props.updateWatched}
                    addShow={this.props.addShow}
                    show={this.props.show}
                />;
                

//---------------------ADD MOVIE VIEW--------------------------------
        } else if (this.props.display === "addMovie") {
            displayElement = 
                <AddMovie 
                    searchValue={this.props.searchValue}
                    handleNameChange={this.props.handleNameChange}
                    queryResult={this.props.queryResult}
                    addMovie={this.props.addMovie}
                    updateQuery={this.props.updateQuery}
                />;

//---------------------LEADERBOARD VIEW--------------------------------
        } else if (this.props.display === "leaderboard") {
            displayElement = 
                <Leaderboard 
                    setLeaders={this.props.setLeaders}
                    leaders={this.props.leaders}
                />;

//---------------------MY SHOWS VIEW--------------------------------
        } else if (this.props.display === "myShows") {
            displayElement = 
                <MyShows 
                    currentShow={this.props.currentShow}
                    episodeList={this.props.episodeList}
                    user={this.props.user}
                    url={this.props.url}
                    setScore={this.props.setScore}
                    setRecaps={this.props.setRecaps}
                    delete={this.props.delete}
                    searchValue={this.props.searchValue}
                    setComments={this.props.setComments}
                    handleNameChange={this.props.handleNameChange}
                    comments={this.props.comments}
                    setDisplay={this.props.setDisplay}
                />;

//---------------------MY MOVIES VIEW--------------------------------
        } else if (this.props.display === "myMovies") {
            displayElement = 
                <MyMovies 
                    currentMovie={this.props.currentMovie}
                    url={this.props.url}
                    setDisplay={this.props.setDisplay}
                    user={this.props.user}
                    setScore={this.props.setScore}
                    delete={this.props.delete}
                    searchValue={this.props.searchValue}
                    setComments={this.props.setComments}
                    handleNameChange={this.props.handleNameChange}
                    comments={this.props.comments}
                />;

        }

        return (
            <div className="container">
                {displayElement}
            </div>
        );
    }
}

export default Display;