import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import landingPage from './landing-page/landing-page';
import signup from './sign-up/sign-up';
import login from './login/login'
import logout from './login/logout';
import Navbar from './landing-page/navbar';
import NewGroup from './groups/new-group';
import MyGroup from './groups/my-group';

export class Routing extends Component {
    render() {
        return (
            <div>
                <Route path='/' component={Navbar} />
                <Route exact path='/' component={landingPage} />
                {/* User */}
                <Route path='/signup' component={signup} />
                <Route path='/login' component={login} />
                <Route path='/logout' component={logout} />

                {/* Group */}
                <Route path='/new-group' component={NewGroup} />
                <Route path='/all-group' component={MyGroup} />


            </div>
        )
    }
}

export default Routing