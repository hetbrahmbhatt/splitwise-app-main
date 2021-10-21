import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
import Modal from 'react-modal';
import _ from 'lodash';
import axios from 'axios';
import description from '../../images/desrciption.png'
import AddExpense from './add-expense'
import moment from 'moment-timezone';
import grocerylogo from '../../images/grocery.png'
import camera from '../../images/camera.png'
import emptyplaceholder from '../../images/empty-placeholder.png'
import profilePhoto from '../../images/profile-icon.png'
import groupSummaryByIDAction from '../../actions/getGroupSummaryByGroupID'
import groupInternalDebtAction from '../../actions/getInternalDebtAction'
import { connect } from "react-redux";
import { Accordion, Card } from "react-bootstrap";
import Message from '../groups/message';
const customStyles = {
    content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        height: '460px',
        width: '500px',
        transform: 'translate(-50%, -50%)'
    }
};
export class GroupDescription extends Component {
    constructor(props) {
        super(props)
        if (this.props.location.state) {
            if (this.props.location.state.groupData.image == null) {
                this.state = {
                    groupID: this.props.location.state.groupData.groupID,
                    groupName: this.props.location.state.groupData.groupName,
                    profileImageUpdate: false,
                    newProfileImage: "",
                    groupImagePath: BACKEND_URL + '/images/avatar.png',
                    error: false,
                    errorMessage: "",
                    groupPopUp: false,
                    groupDescription: [],
                    emptyStateFlag: false,
                    individualExpense: [],
                    debt: [],
                    totalInternalGroupBalance: []
                }
            }
            else {
                this.state = {
                    groupID: this.props.location.state.groupData.groupID,
                    groupName: this.props.location.state.groupData.groupName,
                    profileImageUpdate: false,
                    newProfileImage: "",
                    groupImagePath: BACKEND_URL + '/images/grouppics/' + this.props.location.state.groupData.groupID + '/' + this.props.location.state.groupData.image,
                    error: false,
                    errorMessage: "",
                    groupPopUp: false,
                    groupDescription: [],
                    emptyStateFlag: false,
                    individualExpense: [],
                    debt: [],
                    totalInternalGroupBalance: []
                }
            }
        }
    }
    async componentDidMount() {
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        const totalinternalGroupBalance = await axios
            .post(BACKEND_URL + "/expenses/internalgroupbalance/", this.state)
        this.setState(
            {
                totalInternalGroupBalance: totalinternalGroupBalance.data
            }
        )
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        const groupSummary = await axios
            .get(BACKEND_URL + "/groups/groupsummarybyid/" + this.state.groupID)        
        if (groupSummary.data.length == 0) {
            if (groupSummary.data.length == 0) {
                this.setState({
                    emptyStateFlag: true
                })
            }
        }
        else {
            this.setState({
                groupDescription: groupSummary.data,
            })
        }
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        const internalDebtResponse = await axios.get(BACKEND_URL + "/expenses/totalinternaldebt/" + this.state.groupID)
        this.setState(
            {
                debt: internalDebtResponse.data
            }
        )
    }
    toggleGroupPopUp = (e) => {
        this.setState({
            groupPopUp: !this.state.groupPopUp
        })
    }
    render() {
        let individualExpenseDetails = (<div>{
            this.state.totalInternalGroupBalance.map((exp, index) => {
                if (exp.currency == null || exp.amount == 0) {
                    return (
                        <span></span>
                    )
                }
                else {
                    if (exp.amount < 0) {
                        return (
                            <div className="row" style={{ padding: "30px" }}>
                                <div className="col-6">
                                    <span style={{ width: "100px" }}>
                                        <img
                                            src={profilePhoto} width="60px" height="60px" alt="" style={{ borderRadius: "50px" }} />
                                    </span>
                                </div>
                                <div className="col-6">
                                    <strong>{exp.useerName}</strong> is owed <span style={{ color: "#FF7F50" }}><strong>{exp.currency}{-1 * exp.amount}</strong></span>
                                    <br></br>
                                </div>
                            </div>
                        )

                    }
                    else {
                        if (exp.image == null) {
                            return (
                                <div className="row" style={{ padding: "30px" }}>
                                    <div className="col-6">
                                        <span style={{ width: "100px" }}>
                                            <img
                                                src={profilePhoto} width="60px" height="60px" alt="" style={{ borderRadius: "50px" }} />
                                        </span>
                                    </div>
                                    <div className="col-6">
                                        <strong>{exp.useerName}</strong> owes <span style={{ color: "green" }}>{exp.currency}{exp.amount}</span>
                                        <br></br>
                                    </div>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className="row" style={{ padding: "30px" }}>
                                    <div className="col-6">
                                        <span style={{ width: "100px" }}>
                                            <img
                                                src={profilePhoto} width="60px" height="60px" alt="" style={{ borderRadius: "50px" }} />
                                        </span>
                                    </div>
                                    <div className="col-6">
                                        <strong>{exp.useerName}</strong> owes <span style={{ color: "green" }}>{exp.currency}{exp.amount}</span>
                                        <br></br>
                                    </div>
                                </div>
                            )
                        }
                    }
                }
            }
        )}
        </div>)
        let totalInternalDebt = this.state.debt.map((exp, index) => {
            if (exp.amount > 0) {
                return (
                    <div className="row" style={{ padding: "30px" }}>
                        <div className="col-6">
                            <span style={{ width: "100px" }}>
                                <img
                                    src={profilePhoto} width="60px" height="60px" alt="" style={{ borderRadius: "50px" }} />
                            </span>
                        </div>
                        <div className="col-6">
                            <span><strong>{exp.userID1Name}</strong> owes <strong>{exp.userID2Name}</strong> {exp.currency}{exp.amount} </span>
                            <br></br>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div className="row" style={{ padding: "30px" }}>
                        <div className="col-6">
                            <span style={{ width: "100px" }}>
                                <img
                                    src={profilePhoto} width="60px" height="60px" alt="" style={{ borderRadius: "50px" }} />
                            </span>
                        </div>
                        <div className="col-6">
                            <span><strong>{exp.userID2Name}</strong> owes <strong>{exp.userID1Name}</strong> {exp.currency}{-1 * exp.amount} </span>
                            <br></br>
                        </div>
                    </div>
                )
            }
        });
        let groupDescriptionDetails = null;
        let redirectVar = null
        if (!cookie.load("auth")) {
            redirectVar = <Redirect to="/login" />
        }
        if (this.state.emptyStateFlag) {
            groupDescriptionDetails = (
                <div style={{ margin: "200px" }}>
                    <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                    <h4 style={{ font: "Bookman" }}>Sorry, no activities yet to display!!</h4>
                </div>
            )
        }
        else {
            groupDescriptionDetails = this.state.groupDescription.map((group, index) => {
                if (group.settleFlag != 0) {
                    return (
                        <Accordion style={{ backgroundColor: "#ffffff", height: "1000px" }}>
                            <Accordion.Toggle as={Card.Header} eventKey={index + 1}>
                                <div className="row" style={{ height: "100px", border: "10px solid lightgrey", borderWidth: "thin", backgroundColor: "white", marginBottom: "1px", height: "120px" }}>
                                    <div className="col-1" style={{ margin: "20px", color: "grey" }}>
                                        <div className="row">
                                            {moment(group.createdat).tz(cookie.load("timezone")).format("MMM")}
                                        </div>
                                        <div className="row" style={{ fontSize: "30px", marginTop: "-10px" }}>
                                            {moment(group.createdat).tz(cookie.load("timezone")).format("D")}
                                        </div>
                                    </div>
                                    <div className="col-2">
                                        <img src={grocerylogo} style={{ "paddingLeft": "0%", marginLeft: "-20px", marginTop: "20px" }} width="60%" height="60%" alt="" />
                                    </div>
                                    <div className="col-6" style={{ marginLeft: "-60px", marginTop: "30px" }}>
                                        <div className="row">
                                            <h4><b>"{group.name}"</b> and <b>"{group.settlename}"</b>settled up.</h4>
                                            {moment(group.createdat).tz(cookie.load("timezone")).format("hh:mm a")}
                                        </div>
                                    </div>
                                    <div className="col-3" style={{ marginLeft: "60px", marginTop: "15px", marginRight: "-40px" }}>
                                        <div className="row" style={{ color: "grey", maxWidth: "20" }}>
                                            <h6>dues cleared worth </h6>
                                        </div>
                                        <div className="row" >
                                            <h3><b>{group.currency}{group.amount}</b></h3>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={index + 1}>
                                <div className="row" style={{ height: "100px", border: "1px solid lightgrey", borderWidth: "thin", backgroundColor: "whitesmoke", marginBottom: "1px", height: "120px" }}>
                                    <div className="col-1" style={{ margin: "20px", color: "grey" }}>
                                        <div className="row">
                                            {moment(group.createdat).tz(cookie.load("timezone")).format("MMM")}
                                        </div>
                                        <div className="row" style={{ fontSize: "30px", marginTop: "-10px" }}>
                                            {moment(group.createdat).tz(cookie.load("timezone")).format("D")}
                                        </div>
                                    </div>
                                    <div className="col-2">
                                        <img src={grocerylogo} style={{ "paddingLeft": "0%", marginLeft: "-20px", marginTop: "20px" }} width="60%" height="60%" alt="" />
                                    </div>
                                    <div className="col-6" style={{ marginLeft: "-60px", marginTop: "30px" }}>
                                        <div className="row">
                                            <h4><b>"{group.name}"</b> and <b>"{group.settlename}"</b>settled up.</h4>
                                            {moment(group.createdat).tz(cookie.load("timezone")).format("hh:mm a")}
                                        </div>
                                    </div>
                                    <div className="col-3" style={{ marginLeft: "60px", marginTop: "15px", marginRight: "-40px" }}>
                                        <div className="row" style={{ color: "grey", maxWidth: "20" }}>
                                            <h6>dues cleared worth </h6>
                                        </div>
                                        <div className="row" >
                                            <h3><b>{group.currency}{group.amount}</b></h3>
                                        </div>
                                    </div>
                                    <Message key={group.userID} groupSumData={group} />
                                </div>
                            </Accordion.Collapse>
                        </Accordion>
                    )
                }
                else {
                    return (
                        <Accordion style={{ backgroundColor: "#ffffff" }}>
                            <Accordion.Toggle as={Card.Header} eventKey={index + 1}>
                                <div className="row" style={{ height: "100px", border: "10px solid lightgrey", backgroundColor: "white", borderWidth: "thin", marginBottom: "1px" }}>
                                    <div className="col-1" style={{ margin: "20px", color: "grey" }}>
                                        <div className="row">
                                            {moment(group.createdat).tz(cookie.load("timezone")).format("MMM")}
                                        </div>
                                        <div className="row" style={{ fontSize: "30px", marginTop: "-10px" }}>
                                            {moment(group.createdat).tz(cookie.load("timezone")).format("D")}                                </div>
                                    </div>
                                    <div className="col-2">
                                        <img src={grocerylogo} style={{ "paddingLeft": "0%", marginLeft: "-20px", marginTop: "20px" }} width="60%" height="60%" alt="" />
                                    </div>
                                    <div className="col-6" style={{ marginLeft: "-60px", marginTop: "30px" }}>
                                        <div className="row">
                                            <h3>{group.description}</h3>
                                            <img src={camera} style={{ margin: "8px" }} width="20px" height="20px" alt="" />
                                        </div>
                                        <div className="row">
                                            {moment(group.createdat).tz(cookie.load("timezone")).format("hh:mm a")}

                                        </div>
                                    </div>
                                    <div className="col-3" style={{ marginLeft: "60px", marginTop: "15px", marginRight: "-40px" }}>
                                        <div className="row" style={{ color: "grey" }}>
                                            {group.userName}

                                        </div>
                                        <div className="row">
                                            <h3><b>{group.currency}{group.amount}</b></h3>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey={index + 1} style={{ height: "1000px" }}>
                                <div>
                                    <div className="row" style={{ height: "350px", marginLeft: "50px" }}>
                                        <div className="col-2">
                                            <img src={description} style={{ marginTop: "60px" }} width="100px" height="100px" alt="" />
                                        </div>
                                        <div className="col-3">
                                            <div className="row">
                                                <div className="col-2" style={{ marginTop: "60px" }}>
                                                    <h4>{group.description}</h4>
                                                </div>
                                            </div>
                                            <div className="row" style={{ marginLeft: "0px" }}>
                                                <h3><b>{group.currency}{group.amount}</b></h3>
                                            </div>
                                            <div className="row" style={{ marginLeft: "0px" }}>
                                                <div className="col-4"></div>
                                                <span style={{ color: "grey" }}>Added by {group.userName} on    {' '}
                                                    {moment(group.createdat).tz(cookie.load("timezone")).format("D")}{' '}
                                                    {moment(group.createdat).tz(cookie.load("timezone")).format("MMM")}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <Message key={group.userID} groupSumData={group} />
                                        </div>
                                    </div>
                                    <div className="row">
                                    </div>
                                </div>
                            </Accordion.Collapse>
                        </Accordion>
                    )
                }
            })
        }
        return (
            <div>
                <div>
                    {this.state.totalInternalDebt}
                </div>
                <script src="moment.js"></script>
                <script src="moment-timezone-with-data.js"></script>
                {redirectVar}
                <div class="container">
                    <div class="row">
                        <div class="col-2" style={{ marginLeft: "-100px" }}>
                            {totalInternalDebt}
                        </div>
                        <div class="col-1">
                        </div>
                        <div class="col-8">
                            <div style={{ backgroundColor: "whitesmoke", "height": "10vh" }} className="row">
                                <img style={{ margin: "20px", borderRadius: "200px" }} src={this.state.groupImagePath} width="40px" height="40px" alt="" />
                                <h1 style={{ marginTop: "20px" }}>{this.state.groupName}</h1>
                                <button type="submit" className="btn btn-amber" onClick={this.toggleGroupPopUp} style={{ marginLeft: "70px", marginTop: "25px", height: "40px", width: "250px", backgroundColor: "#FF7F50", color: "white" }} >Add an Expense</button>
                                <div style={{ height: "200px" }}>
                                    <Modal style={customStyles} isOpen={this.state.groupPopUp} ariaHideApp={false}>
                                        <AddExpense groupData={this.state} closePopUp={this.toggleGroupPopUp} />
                                    </Modal>
                                </div>
                            </div>
                            {groupDescriptionDetails}
                        </div>
                        <div class="col-2">
                            {individualExpenseDetails}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const matchStateToProps = (state) => {
    return {
        error: state.groupSummaryByIDReducer.error,
        groupSummaryData: state.groupSummaryByIDReducer.groupSummaryData,
        groupInternalDebt: state.getInternalDebtReducer.internalData

    }
}
const matchDispatchToProps = (dispatch) => {
    return {
        groupSummaryByIDAction: (data) => dispatch(groupSummaryByIDAction(data)),
        groupInternalDebtAction: (data) => dispatch(groupInternalDebtAction(data)),

    }
}

export default connect(matchStateToProps, matchDispatchToProps)(GroupDescription)