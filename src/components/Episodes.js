import React, { Component } from 'react';
import $ from 'jquery';

class Episodes extends Component {
	updateCheck(index, episode_id) {
        let ep = "#" + episode_id;
        if ($(ep).attr('checked') === "checked") {
            $(ep).prop('checked', false);
            $(ep).attr('checked', false);
        } else {
            $(ep).prop('checked', true);
            $(ep).attr('checked', true);
        }
    }

    checkSeason(e, season) {
        let thisSeasonHeader = ".seasonHeader" + season;
        let thisSeason = ".season" + season;
        if ($(thisSeasonHeader).eq(0).attr('checked') === "checked") {
            $(thisSeason).attr('checked', false);
            $(thisSeason).prop('checked', false);
            $(thisSeasonHeader).eq(0).attr('checked', false);
        } else {
            $(thisSeason).attr('checked', true);
            $(thisSeason).prop('checked', true);
            $(thisSeasonHeader).eq(0).attr('checked', true);
        }     
    }

	render() {
        let totalSeasons = this.props.episodeList[(this.props.episodeList.length)-1].season;
        let episodeDisplay= [];

        for (let j=1; j<=totalSeasons; j++) {
            episodeDisplay.push(
                <div className="episodepage-season">
                    <h2>Season {j}</h2>
                    <div className="season-complete" onChange={(e) => {this.checkSeason(e, j)}}>
                        <h5>Season Watched?</h5>
                        <input 
                            type="checkbox"
                            value={j}
                            className={"seasonHeader"+j}
                        />
                    </div>
                </div>
            )
            this.props.episodeList.forEach((episode, i) => {
                if (episode.season === j) {
                    episodeDisplay.push(
                        <div className="episodepage-episode" key={i}>
                            <h3>Episode {episode.season}.{episode.number}: {episode.name}</h3>
                            <div className="episode-complete">
                                <input 
                                    type="checkbox"
                                    value={episode.id}
                                    id={episode.id}
                                    className={"season" + j}
                                    onClick={(e) => {this.updateCheck(i, episode.id)}}
                                />
                                <h5>Episode Watched?</h5>
                            </div>
                            <h5 >Aired: {episode.airdate}</h5>
                        </div>);
                }
            })
            episodeDisplay.push(
                <div className="divider"></div>
            )
        }

        return(
            <div>
                <div className="show-title">
                    <img src={this.props.show.image.medium} alt=""/>
                    <h1>{this.props.show.name}</h1>
                </div>
                <h3 className="show-submit" onClick={(e) =>{this.props.addShow(e)}}>Add to My Shows</h3>
                {episodeDisplay}
            </div>
        )
    }
}

export default Episodes;