import React, { Component } from 'react';
import Login from './login/Login';
import Home from './home/Home';
import Profile from './profile/Profile';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

class Controller extends Component {

    constructor() {
        super();
        this.baseUrl = 'https://api.instagram.com/v1/';
    }

    render() {
        return (
            <Router>
                <div className='main-container'>

                    {/* Referencing and routing to login page */}
                    <Route exact path='/' render={(props) => <Login {...props} baseUrl={this.baseUrl} />} />

                    {/* Referencing home page and user will be redirected to homepage only if the access token is not null and if access token is not null it will take to login page again */}
                    <Route path='/home' render={(props) => (sessionStorage.getItem('access-token') === null ? 
                        (<Redirect to='/' />) : 
                        (<Home {...props} userInfoUrl={this.baseUrl + "users/self/?access_token="} userMediaRecentUrl={this.baseUrl + "users/self/media/recent/?access_token="} accessToken={sessionStorage.getItem('access-token')}/>)
                         )} />
                    {/* Referencing profile page and user will be redirected to profile page only if the access token is not null and if access token is not null it will take to login page again */}
                    <Route path='/profile' render={(props) => (sessionStorage.getItem('access-token') === null ? 
                        (<Redirect to='/' />) : 
                        (<Profile {...props} userInfoUrl={this.baseUrl + "users/self/?access_token="} userMediaRecentUrl={this.baseUrl + "users/self/media/recent/?access_token="} accessToken={sessionStorage.getItem('access-token')}/>                            )
                        )} />
                </div>
            </Router>
        )
    }
}

export default Controller;
