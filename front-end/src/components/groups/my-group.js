import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
import axios from 'axios';
import { connect } from "react-redux";
import IndividualGroup from './individual-group';
import AcceptedGroup from './accepted-group';
import emptyplaceholder from '../../images/empty-placeholder.png'
import groupGetActionForUser from '../../actions/groupGetAction'


export class MyGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groups: [],
            acceptedGroups: [],
            searchInput: "",
            emptygroupsFlag: false,
            emptyAcceptedGroupsFlag: false
        }
    }
    handleSearch = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    reload = (e) => {
        this.props.groupGetActionForUser(cookie.load("id")).then(response => {
            this.setState({
                groups: this.props.userData.data.invitedGroups,
                acceptedGroups: this.props.userData.data.acceptedGroups,
            });
        })
    }
    async componentDidMount() {
        this.props.groupGetActionForUser(cookie.load("id")).then(response => {
            this.setState({
                groups: this.props.userData.data.invitedGroups,
                acceptedGroups: this.props.userData.data.acceptedGroups,
            });
        })
    }
    render() {
        var redirectVar = null;
        let groupInvitationDetails = null
        let groupAcceptedDetails = null
        if (!cookie.load("auth")) {
            redirectVar = <Redirect to="/login" />
        }
        let searchedGroups = this.state.acceptedGroups.filter((group) => {
            if (group.groupName.toLowerCase().includes(this.state.searchInput.toLowerCase())) {
                return group;
            }      })
        if (this.state.groups.length == 0) {
            groupInvitationDetails = (
                <div style={{ margin: "200px" }}>
                    <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                    <h4 style={{ font: "Bookman" }}>No invitations yet!!!</h4>
                </div>
            )
        }
        else {
            groupInvitationDetails = this.state.groups.map((group) => {
                return (
                    <div>
                        <IndividualGroup changeStatus={this.reload} key={group.groupID} groupID={group} />
                    </div>
                )
            });
        }
        if (this.state.acceptedGroups.length == 0) {
            groupAcceptedDetails = (
                <div style={{ margin: "130px" }}>
                    <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                    <h4 style={{ font: "Bookman" }}>Sorry!! There are no groups</h4>
                </div>
            )
        }
        else {
            groupAcceptedDetails = searchedGroups.map((group) => {
                return (
                    <div>
                        <AcceptedGroup key={group.groupID} acceptedGroupData={group} />
                    </div>
                )
            });
        }
        return (
            <div>
                { redirectVar}
                <div className="row">
                    <div className="col-6">
                        <h1 style={{ marginLeft: "50px", "marginBottom": "40px", "marginLeft": "150px" }}>Group Invitations</h1>
                        {groupInvitationDetails}
                        <div style={{ "borderLeft": "6px solid black", "height": "100%", "position": "absolute", "left": "100%", "marginLeft": "-3px", "top": "0px" }}></div>
                    </div>
                    <div className="col-6">
                        <h1 style={{ marginLeft: "50px", "marginBottom": "40px", "marginLeft": "150px" }}>Your Groups</h1>
                        <div className="col-6 m-4">
                            <input type="text" style={{ "width": "400px", "marginLeft": "10px" }} name="searchInput" onChange={this.handleSearch} placeholder="Search Accepted Groups"></input>
                        </div>
                        {groupAcceptedDetails}
                    </div>
                </div>
            </div>
        )
    }
}
const matchStateToProps = (state) => {
    return {
        error: state.getByIDReducer.error,
        userData: state.getByIDReducer.userData
    }
}
const matchDispatchToProps = (dispatch) => {
    return {
        groupGetActionForUser: (data) => dispatch(groupGetActionForUser(data)),
    }
}

export default connect(matchStateToProps, matchDispatchToProps)(MyGroup)
