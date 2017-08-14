import React, { Component } from 'react';
import Login from './Login';
import Signup from './Signup';

class UserAuth extends Component {
  constructor(){
    super();
    // set up state
    this.state = {
      mode: 'login' // keeps track of if the user is logging in or signing up
    }
  }

  toggleMode(e){ // toggle between the two modes
    e.preventDefault();
    this.setState(prev => { // the mode is what it is not
      prev.mode = prev.mode === "login" ? 'signup' : 'login';
      return prev
    })
  }

  render(){
    let display;
    if (this.state.mode === 'login') {
      display = <Login {...this.props} toggleMode={this.toggleMode.bind(this)} />;
    } else {
      display = <Signup {...this.props} toggleMode={this.toggleMode.bind(this)} />;
    }

    return (
      <div className="intro">
        {display}
        <div className="logo">
          <div>mediAddict</div>
        </div>
      </div>
    )
  }
}
export default UserAuth;
