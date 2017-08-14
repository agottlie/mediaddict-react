import React, { Component } from 'react';
import $ from 'jquery';
import Comment from './Comment';

class MyShows extends Component {

    componentDidMount() {
        this.props.setRecaps()
    }

    updateWatched(index) {
        $.ajax({
            url: `${this.props.url}/episodes/${this.props.episodeList[index].id}`,
            method: "PUT",
            data: { watched: true, score: this.props.user.score + 5, user_id: this.props.user.id }
        }).done((data) => {
            $.ajax({
                url: `${this.props.url}/episodes/scrape`,
                method: "PUT",
                data: {
                    name: this.props.episodeList[index].show_name.replace(/\s/g, "-").toLowerCase(),
                    season: this.props.episodeList[index].season,
                    episodeNumber: this.props.episodeList[index].episodenumber,
                    id: this.props.episodeList[index].id
                }
            }).done((data) => {
                console.log(data);
                this.props.setScore(5);
            })
        });
    }

    showComments(episode) {
        let ep = "#s" + episode.season + "e" + episode.episodenumber;
        $.ajax({
            url: `${this.props.url}/comments/${episode.maze_id}?media=show`
        }).done((data) => {
            this.props.setComments(data);
        });
        $(ep).css('display', 'block');
    }

    hideComments(episode) {
        let ep = "#s" + episode.season + "e" + episode.episodenumber;
        $(ep).css('display', 'none');
    }

    render() {
        let totalSeasons = this.props.episodeList[(this.props.episodeList.length) - 1].season;
        let watched = [];
        let notWatched = [];
        let upcoming = [];
        let d = new Date();

        for (let j = 1; j <= totalSeasons; j++) {
            let watchedCount = 0,
                notWatchedCount = 0,
                upcomingCount = 0;
            watched.push(
                <div>
                    <h2 className="seasonHeader">Season {j}</h2>
                </div>
            )
            notWatched.push(
                <div>
                    <h2 className="seasonHeader">Season {j}</h2>
                </div>
            )
            upcoming.push(
                <div>
                    <h2 className="seasonHeader">Season {j}</h2>
                </div>
            )
            this.props.episodeList.forEach((episode, i) => {
                let airdate = new Date(episode.airdate);
                if (episode.season === j && episode.watched) {
                    watchedCount++;
                    watched.push(
                        <div key={i} className="episode">
                            <div className="episode-title">
                                <h5 className="episode-title-numbers">Episode {episode.season}.{episode.episodenumber}:</h5>
                                <h5>{episode.name}</h5>
                            </div>
                            <div className="aired">
                                <h5>Aired:</h5>
                                <h5>{episode.airdate.substr(0, episode.airdate.length-6)}</h5>
                            </div>
                            <div className="recaps-and-comments">
                                <a href={episode.recap_url}>Recap</a>
                                <button onClick={(e) => {this.showComments(episode)}}>Show Comments</button>
                            </div>
                            <div 
                                className="comment"
                                id={"s" + episode.season + "e" + episode.episodenumber}
                            >
                                <Comment 
                                    className="innerComment"
                                    media="show"
                                    media_id={episode.maze_id}
                                    user={this.props.user}
                                    url={this.props.url}
                                    searchValue={this.props.searchValue}                                    handleNameChange={this.props.handleNameChange}
                                    comments={this.props.comments}
                                    current={episode}
                                    showComments={this.showComments.bind(this)}
                                    hideComments={this.hideComments.bind(this)}                                />
                            </div>
                        </div>
                    );
                } else if (episode.season === j && !episode.watched && d >= airdate) {
                    notWatchedCount++;
                    notWatched.push(
                        <div key={i} className="episode">
                            <div className="episode-title">
                                <h5 className="episode-title-numbers">Episode {episode.season}.{episode.episodenumber}:</h5>
                                <h5>{episode.name}</h5>
                            </div>
                            <div className="aired">
                                <h5>Aired:</h5>
                                <h5>{episode.airdate.substr(0, episode.airdate.length-6)}</h5>
                            </div>
                            <div className="complete">
                                <h4>Finished?</h4>
                                <input 
                                    type="checkbox"
                                    onClick={(e) => {this.updateWatched(i)}}
                                />
                            </div>
                        </div>
                    );
                } else if (episode.season === j) {
                    upcomingCount++;
                    upcoming.push(
                        <div key={i} className="episode">
                            <div className="episode-title">
                                <h5 className="episode-title-numbers">Episode {episode.season}.{episode.episodenumber}:</h5>
                                <h5>{episode.name}</h5>
                            </div>
                            <div className="aired">
                                <h5>Airing:</h5>
                                <h5>{episode.airdate.substr(0, episode.airdate.length-6)}</h5>
                            </div>
                        </div>
                    );
                }
            })
            if (watchedCount === 0) {
                watched.pop();
            }
            if (notWatchedCount === 0) {
                notWatched.pop();
            }
            if (upcomingCount === 0) {
                upcoming.pop();
            }
        }

        return (
            <div>
                <h1>{this.props.currentShow.name}</h1>
                <button onClick={(e) => {this.props.delete(e, "shows", this.props.currentShow.id)}}>Remove</button>
                <div className="episodes">
                    <div className="watched">
                        <h1>Watched</h1>
                        <div>{watched}</div>
                    </div>
                    <div className="notWatched">
                        <h1>Not Watched</h1>
                        <div>{notWatched}</div>
                    </div>
                    <div className="Upcoming">
                        <h1>Upcoming</h1>
                        <div>{upcoming}</div>
                    </div>
                </div>
                {this.removeHeaders}
            </div>
        );
    }
}

export default MyShows;