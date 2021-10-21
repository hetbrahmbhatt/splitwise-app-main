import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import editGroupAction from '../../actions/editGroupAction'
import { connect } from "react-redux";
export class EditGroup extends Component {
    constructor(props) {
        super(props);
        if (this.props.groupData.image == null) {
            this.state = {
                groupID: this.props.groupsData.groupID,
                groupName: this.props.groupsData.groupName,
                invitedBy: this.props.groupsData.invitedBy,
                groupPopUp: false,
                profileImagePath: BACKEND_URL + "/images/avatar.png",
                profileImageUpdate: false,
                updatedProfileImage: "",
            }
        }
        else {
            this.state = {
                groupID: this.props.groupData.groupID,
                groupName: this.props.groupData.groupName,
                invitedBy: this.props.groupData.invitedBy,
                groupPopUp: false,
                profileImagePath: BACKEND_URL + "/images/grouppics/" + this.props.groupData.groupID + '/' + this.props.groupData.image
            }
        }
    }
    handleInputChange = inp => {
        {
            this.setState({
                [inp.target.name]: inp.target.value
            })
        }
    }

    handleImageChange = e => {
        this.setState({
            updatedProfileImage: e.target.files[0],
            profileImageUpdate: true
        })
    }
    handleSubmit = e => {
        e.preventDefault();
        if (this.state.groupName == "") {
            toast.error("Please enter group name");
            return;
        }
        this.props.editGroupAction(this.state).then(response => {
        })
    }
    render() {
        if (!(cookie.load("auth"))) {
            return <Redirect to='/login' />
        }
        return (
            <div>
                <h1 style={{ marginLeft: "500px" }}>Edit Group Details</h1>
                <button className="btn btn-danger" style={{ marginLeft: "1200px", marginTop: "-100px" }} onClick={this.props.closePopUp}>Back</button>
                <div className="row" style={{ "height": "10vh" }}>
                </div>
                <div className="row" style={{ "height": "100vh" }}>
                    <div className="col-3"></div>
                    <div className="col-2">
                        <img src={this.state.profileImagePath} width="200" height="200" alt="" />
                        <div className="row">
                            <input style={{ "marginLeft": '20px', "marginTop": "30px" }} accept="image/x-png,image/gif,image/jpeg" type="file" name="profileImage" onChange={this.handleImageChange} />
                        </div>
                    </div>
                    <div className="col-6">
                        <h3>Group's name</h3>
                        <form onSubmit={this.handleSubmit} id="Login">
                            <input placeholder={this.state.groupName} type="text" id="groupName" name="groupName" style={{ "width": "300px", "marginTop": "-1px" }} onChange={this.handleInputChange} ></input>
                            <button type="submit" className="btn btn-success" style={{ "backgroundColor": "#FF8C00", "marginTop": "200px", "marginLeft": "-200px" }} onSubmit={this.handleSubmit}>Save</button>
                        </form>
                        <ToastContainer />
                    </div>
                </div >
            </div >
        )
    }
}
const matchStateToProps = (state) => {
    return {
        error: state.editGroupReducer.error,
        groupData: state.editGroupReducer.groupData
    }
}

const matchDispatchToProps = (dispatch) => {
    return {
        editGroupAction: (data) => dispatch(editGroupAction(data)),
    }
}

export default connect(matchStateToProps, matchDispatchToProps)(EditGroup)