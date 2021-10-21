import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
import axios from 'axios';
import groupGetByIDAction from '../../actions/getGroupByIDAction'
import { connect } from "react-redux";

export class IndividualGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupID: this.props.groupID.groupID,
            invitedBy: "",
            groupName : this.props.groupID.groupName
        }
    }
    async componentDidMount() {
        this.setState({
            invitedBy: this.props.groupID.invitedBy,
            groupName: this.props.groupID.groupName,
        })
    }    
    acceptButtonClick = e => {
        e.preventDefault();
        var object = {
            userID: cookie.load('id'),
            groupID: this.state.groupID,
            type: "accept",
            userName: cookie.load('name'),
            groupName : this.state.groupName
        }
        axios
            .put(BACKEND_URL + "/groups/invite", object).then(response => {
                if (response.status == 200) {
                    window.location.assign('/all-group');
                }
            });
    }
    ignorebuttonClick = e => {
        e.preventDefault();
        var object = {
            userID: cookie.load('id'),
            groupID: this.state.groupID,
            type: "ignore"
        }
        axios
            .put(BACKEND_URL + "/groups/invite", object).then(response => {
                if (response.status == 200) {
                    window.location.reload();
                }
            });
    }
    displayPicture = (name, groupID) => {
        if (name == null) {
            var groupImagePath = BACKEND_URL + "/images/avatar.png"
        }
        else {
            var groupImagePath = BACKEND_URL + "/images/grouppics/" + groupID + '/' + name
        }
        return (
            <img src={groupImagePath} width="80px" height="80px" alt="" />
        )
    }

    render() {
        if (!(cookie.load("auth"))) {
            return <Redirect to='/login' />
        }
        let addOption =
            <div>
                <div >
                    <button className="btn btn-success" onClick={this.acceptButtonClick} >Accept </button>
                </div>
            </div>

        let ignoreOption =
            <div>
                <div>
                    <button className="btn btn-danger" onClick={this.ignorebuttonClick} >Ignore </button>
                </div>
            </div>
        return (
            <div>
                <div className="row" style={{ "width": "80%", "height": "200px", "background": "whitesmoke", "marginLeft": "50px" }}>
                    <div className="col-2 " style={{ marginTop: "10px" }}>
                        <div className="row p-1 m-2"><h4></h4></div>
                        <div className="row p-1 m-2"><h4></h4></div>
                        {this.displayPicture(this.state.image, this.state.groupID)}
                    </div>
                    <div className='col-4'>
                        <div className="row p-1 m-3"><h6>Group Name</h6></div>
                        <div className="row p-1 m-3" ></div>
                        <div className="row p-1 m-3"><h2>{this.state.groupName}</h2></div>
                    </div>
                    <div className='col-2'>
                        <div className="row p-1 m-3" ><h6>Invited By</h6></div>
                        <div className="row p-1 m-3"><h3>{this.state.invitedBy}</h3></div>
                    </div>
                </div>
                <div className="row p-4" style={{ marginLeft: "160px" }}>
                    <div className="col-2">
                        <div className="row" ><h6>{addOption}</h6></div>
                    </div>
                    <div className="col-2" style={{ marginLeft: "40px" }}>
                        <div className="row" ><h6>{ignoreOption}</h6></div>
                    </div>
                </div>
            </div >
        )
    }
}
const matchStateToProps = (state) => {
    return {
        error: state.getGroupByIDReducer.error,
        groupData: state.getGroupByIDReducer.groupData
    }

}

const matchDispatchToProps = (dispatch) => {
    return {
        groupGetByIDAction: (data) => dispatch(groupGetByIDAction(data)),
    }
}

export default connect(matchStateToProps, matchDispatchToProps)(IndividualGroup)
