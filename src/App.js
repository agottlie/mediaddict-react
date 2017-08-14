import React, { Component } from 'react';
import $ from 'jquery';
import './App.css';
import Display from './components/Display';
import Navbar from './components/Navbar';
import axios from 'axios';
import Cookies from './helpers/Cookies';
import UserAuth from './components/UserAuth';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: false,
            display: "profile",
            mode: "loading",
            queryResult: [],
            searchValue: "",
            show: {},
            episodeList: [],
            count: 0,
            url: 'http://localhost:8080',
            myShows: [],
            myMovies: [],
            events: [],
            currentShow: null,
            currentMovie: null,
            leaders: [],
            comments: [],
            generic_image: "https://image.freepik.com/free-vector/old-television-set-icon_23-2147501665.jpg"
        }
    }

    componentDidMount() {
        this.initUser();
    }

    initUser() {
        // get the token from the cookie
        const token = Cookies.get('token');

        // if there is a token
        if (token && token !== '') {
            // send a request to our API to validate the user
            axios.get(`${this.state.url}/users/validate`, {
                    // include the token as a parameter
                    params: { auth_token: token }
                })
                .then(res => { // the response will be the user
                    // set the user in the state, and change the mode to content
                    this.setState({ user: res.data, mode: 'content', display: 'profile' });
                })
                .catch(err => { // if there is an error
                    Cookies.set('token', '') // take away the cookie
                    // change the state so that there is no user and render the auth
                    this.setState({ user: false, mode: 'auth' });
                })
        } else { // if there is no token
            // we should render the auth forms
            this.setState({ mode: 'auth' });
        }
    }

    setUser(user) {
        // set a cookie with the user's token
        Cookies.set('token', user.token);
        // set state to have the user and the mode to content
        this.setState({ user: user, mode: 'content' });
    }

    setShows(newValue) {
        this.setState({
            myShows: newValue
        })
    }

    setComments(newValue) {
        this.setState({
            comments: newValue
        })
    }

    setMovies(newValue) {
        this.setState({
            myMovies: newValue
        })
    }

    setScore(newValue) {
        let tempUser = this.state.user;
        tempUser.score += newValue;
        this.setState({
            user: tempUser
        }, function complete() { this.setDisplay("profile") })
    }

    logout() {
        // take away the cookie
        Cookies.set('token', '');
        // remove the user and set the mode to auth
        this.setState({ user: false, mode: 'auth' });
    }

    setDisplay(newValue) {
        this.setState({
            display: newValue,
            queryResult: [],
            searchValue: ""
        })
    }

    setCurrentShow(e, index) {
        e.preventDefault();
        this.setState({
            currentShow: this.state.myShows[index]
        }, function complete() { this.setCurrentEpisodes() });
    }


    setCurrentEpisodes() {
        $.ajax({
            url: `${this.state.url}/episodes/show/${this.state.currentShow.id}`
        }).done((data) => {
            this.setState({
                episodeList: data
            }, function complete() {
                let tempList = this.state.episodeList;
                $.ajax({
                    url: `http://api.tvmaze.com/shows/${this.state.currentShow.maze_id}/episodes`
                }).done((data) => {
                    data.forEach((episode) => {
                        let present = false;
                        this.state.episodeList.forEach((ep) => {
                            if (episode.season === ep.season && episode.number === ep.episodenumber) {
                                present = true;
                            }
                        })
                        if (!present) {
                            let airdate;
                            if (episode.airtime) {
                                airdate = episode.airdate + "T" + episode.airtime;
                            } else if (episode.airstamp) {
                                airdate = episode.airstamp.substr(0, episode.airstamp.length - 9);
                            } else {
                                airdate = "no date given";
                            }
                            $.ajax({
                                url: `${this.state.url}/episodes`,
                                method: "POST",
                                data: { name: episode.name, season: episode.season, episodeNumber: episode.number, airDate: airdate, watched: false, show_id: this.state.currentShow.id, user_id: this.state.user.id, show_name: this.state.currentShow.name }
                            }).done((data) => {
                                tempList.push(data);
                                this.setState({
                                    episodeList: tempList
                                })
                            }) 
                        }
                    });
                });
                this.setState({
                    display: "myShows"
                })
            })
        });
    }

    setCurrentMovie(index) {
        this.setState({
            currentMovie: this.state.myMovies[index]
        })
    }

    setLeaders() {
        $.ajax({
            url: `${this.state.url}/leaderboard`
        }).done((data) => {
            this.setState({
                leaders: data
            }, function complete() {
                this.setState({
                    display: "leaderboard"
                })
            })
        });
    }

    setShow(e, newValue) {
        e.preventDefault();
        this.setState({
            show: newValue
        }, function complete() { this.setEpisodes() });
    }

    setEpisodes() {
        $.ajax({
            url: `http://api.tvmaze.com/shows/${this.state.show.id}/episodes`
        }).done((data) => {
            data.forEach((episode) => {
                episode.watched = false;
            })
            this.setState({
                episodeList: data,
                display: "episodes"
            });
        });
    }

    setRecaps() {
        this.state.episodeList.forEach((episode, index) => {
            if (episode.watched && episode.recap_url === null) {
                $.ajax({
                    url: `${this.state.url}/episodes/scrape`,
                    method: "PUT",
                    data: {
                        name: this.state.episodeList[index].show_name.replace(/\s/g, "-").toLowerCase(),
                        season: this.state.episodeList[index].season,
                        episodeNumber: this.state.episodeList[index].episodenumber,
                        id: this.state.episodeList[index].id
                    }
                }).done((data) => {
                    console.log(data);
                    let tempList = this.state.episodeList;
                    tempList[index].recap_url = data.recap_url;
                    this.setState({
                        episodeList: tempList
                    })
                })
            }
        })
    }

    handleNameChange(event) {
        this.setState({ searchValue: event.target.value });
    }

    updateQuery(newValue) {
        this.setState({
            queryResult: newValue
        })
    }

    addMovie(event, movie) {
        event.preventDefault();
        $.ajax({
            url: `https://api.themoviedb.org/3/movie/${movie.id}?api_key=5d8a82f4af8222c35db864c6cae30bc4`,
        }).done((data) => {
            console.log(data.poster_path);
            let poster;
            if (data.poster_path) {
                poster = "https://image.tmdb.org/t/p/w300/" + data.poster_path;
            } else {
                poster = this.state.generic_image;
            }
            console.log(poster);
            $.ajax({
                url: `${this.state.url}/movies`,
                method: "POST",
                data: { name: data.title, premiereDate: data.release_date, length: data.runtime, user_id: this.state.user.id, tmdb_id: data.id, image: poster }
            }).done((data) => {
                this.setState({
                    display: "profile"
                })
            })
        });
    }

    addShow(event) {
        event.preventDefault();
        let network,
            poster;
        if (this.state.show.network) {
            network = this.state.show.network.name;
        } else {
            network = this.state.show.webChannel.name;
        }

        if (this.state.show.image) {
            poster = this.state.show.image.medium;
        } else {
            poster = this.state.generic_image;
        }
        $.ajax({
            url: `${this.state.url}/shows`,
            method: "POST",
            data: { name: this.state.show.name, premiereDate: this.state.show.premiered, network: network, user_id: this.state.user.id, maze_id: this.state.show.id, image: poster }
        }).done((data) => {
            this.updateWatched(data, event);
        });
    }

    updateWatched(data, event) {
        let tempList = this.state.episodeList;
        this.state.episodeList.forEach((episode, index) => {
            let ep = "#" + episode.id;
            if ($(ep).eq(0).attr('checked') === "checked") {
                tempList[index].watched = true;
            } else {
                tempList[index].watched = false;
            }
        })
        this.setState({
            episodeList: tempList
        }, function complete() { this.addEpisode(event, this.state.episodeList[this.state.count], data.id, this.state.show.name) })
    }

    addEpisode(event, episode, show_id, show_name) {
        event.preventDefault();
        let airdate;
        if (episode.airtime) {
            airdate = episode.airdate + "T" + episode.airtime;
        } else {
            airdate = episode.airstamp.substr(0, episode.airstamp.length - 9);
        }
        $.ajax({
            url: `${this.state.url}/episodes`,
            method: "POST",
            data: { name: episode.name, season: episode.season, episodeNumber: episode.number, airDate: airdate, watched: episode.watched, show_id: show_id, user_id: this.state.user.id, show_name: show_name, maze_id: episode.id }
        }).done((data) => {
            this.setState({
                count: this.state.count + 1
            })
            if (this.state.count < this.state.episodeList.length) {
                this.addEpisode(event, this.state.episodeList[this.state.count], show_id, show_name);
            } else {
                this.setState({
                    count: 0,
                    display: 'profile',
                    searchValue: ""
                })
            }
        });
    }

    delete(event, type, id) {
        event.preventDefault();
        $.ajax({
            url: `${this.state.url}/${type}/${id}`,
            method: "DELETE"
        }).done((data) => {
            this.setState({
                display: "profile"
            })
        });
    }

    renderView() {
        if (this.state.mode === 'loading') {
            return (
                <div className="loading">
              <img src="https://s-media-cache-ak0.pinimg.com/originals/8b/a8/ce/8ba8ce24910d7b2f4c147359a82d50ef.gif"
                alt="loading" />
            </div>
            )
        } else if (this.state.mode === 'auth') {
            return (
                <UserAuth
              setUser={this.setUser.bind(this)}
              url={this.state.url}
            />
            )
        } else {
            return (
                <div>
                <Navbar 
                    display = {this.state.display}
                    setDisplay={this.setDisplay.bind(this)}
                    logout={this.logout.bind(this)}
                    user={this.state.user}
                    myScore={this.state.myScore}
                  />
                  <Display
                    display={this.state.display}
                    setDisplay={this.setDisplay.bind(this)}
                    user={this.state.user}
                    handleNameChange={this.handleNameChange.bind(this)}
                    queryResult={this.state.queryResult}
                    searchValue={this.state.searchValue}
                    updateQuery={this.updateQuery.bind(this)}
                    show={this.state.show}
                    setShow={this.setShow.bind(this)}
                    setShows={this.setShows.bind(this)}
                    setMovies={this.setMovies.bind(this)}
                    episodeList={this.state.episodeList}
                    addShow={this.addShow.bind(this)}
                    addMovie={this.addMovie.bind(this)}
                    updateWatched={this.updateWatched.bind(this)}
                    logout={this.logout.bind(this)}
                    url={this.state.url}
                    myShows={this.state.myShows}
                    myMovies={this.state.myMovies}
                    currentShow={this.state.currentShow}
                    currentMovie={this.state.currentMovie}
                    setCurrentShow={this.setCurrentShow.bind(this)}
                    setCurrentMovie={this.setCurrentMovie.bind(this)}
                    setScore={this.setScore.bind(this)}
                    leaders={this.state.leaders}
                    setLeaders={this.setLeaders.bind(this)}
                    setRecaps={this.setRecaps.bind(this)}
                    delete={this.delete.bind(this)}
                    setComments={this.setComments.bind(this)}
                    comments={this.state.comments}
                />
            </div>
            )
        }
    }

    render() {
        return (
            <div className="App">
              {this.renderView()}
            </div>
        );
    }
}

export default App;