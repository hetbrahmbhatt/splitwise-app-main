import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import landingPage  from './landing-page/landing-page';
import signup  from './sign-up/sign-up';
import login from './login/login'
import logout from './login/logout';
import Navbar from './landing-page/navbar';
import Profile from './users/profile';
import NewGroup from './groups/new-group';
// import MyGroup from './groups/my-group';
// import GroupDescription from './groups/group-description';
// import RecentActivity from '../components/user/recent-activity';
// import Dashboard from './user/dashboard';

export class Routing extends Component {
    render() {
        return (
            <div>
                <Route path='/' component={ Navbar } />
                <Route exact path='/' component={landingPage} />

                {/* User */}
                <Route path='/signup' component={signup} />
                <Route path='/login' component={login} />
                <Route path='/logout' component={logout} />
                <Route path='/profile' component={Profile} />
                {/* <Route path='/dashboard' component={Dashboard} /> */}

                {/* Group */}
                <Route path='/new-group' component={NewGroup} />
                {/* <Route path='/all-group' component={MyGroup} /> */}
                {/* <Route path='/group-description' component={GroupDescription} /> */}

                {/* Recent Activity */}
                {/* <Route path='/recent-activity' component={RecentActivity} /> */}


            </div>
        )
    }
}

export default Routing