import React, { Component } from 'react';
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config';
import axios from 'axios';
import grocerylogo from '../../images/grocery.png'
import emptyplaceholder from '../../images/empty-placeholder.png'
import moment from 'moment-timezone';
import Select from 'react-select';
import { Redirect } from 'react-router';
import recentactivityAction from '../../actions/recentActivityAction';
import { connect } from "react-redux";
import ReactPaginate from 'react-paginate';
import '../css/pagination.css';
import groupGetByIDAction from '../../actions/getGroupByIDAction';
export class RecentActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recentactivity: [],
            emptyStateFlag: false,
            selectedOption: "",
            groups: [],
            userID: cookie.load('id'),
            groupsFlag: false,
            activitiesValue: "",
            activitiesFlag: false,
            orderByValue: "",
            orderByFlag: false,
            offset: 0,
            perPage: 2,
            pageCount: 0,
            groupIDSelected: "",
            orderBy: ""
        }
    }
    handleChange = e => {
        this.setState({
            activitiesValue: e.value,
            activitiesFlag: true,
            groupIDSelected: e.value,
            orderBy: '-1'
        })
        let object = {
            activitiesFlag: true,
            groupIDSelected: e.value,
            orderBy: '-1',
            userID: cookie.load('id'),
        }
        this.props.recentactivityAction(object).then(response => {
            this.setState({
                recentactivity: this.props.userData.data
            })
        })
    }
    handlePageClick = (e) => {
        this.setState({
            offset: this.state.perPage * e.selected,
        })
    };
    handlePaginationChange = (e) => {
        this.setState({
            perPage: Number(e.value),
        })
    };
    handleOrderByChange = e => {
        this.setState({
            orderByFlag: true,
            orderByValue: e.value
        })
        if (this.state.activitiesFlag) {
            var obj = {
                userID: cookie.load('id'),
                groupID: this.state.activitiesValue,
                orderBy: e.value,
                orderByFlag: true,
                activitiesFlag: true
            }
            this.props.recentactivityAction(obj).then(response => {
                this.setState({
                    recentactivity: this.props.userData.data
                })
            })
        }
        else {
            var obj = {
                userID: cookie.load('id'),
                createdAt: e.value,
                orderByFlag: true,
                activitiesFlag: false
            }
            this.props.recentactivityAction(obj).then(response => {
                this.setState({
                    recentactivity: this.props.userData.data
                })
            })
        }
    }
    async componentDidMount() {
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        const groups = await axios.get(BACKEND_URL + '/users/userbyid/' + cookie.load('id'));
        if (groups.data.acceptedGroups.length != 0) {
            for (let i = 0; i < groups.data.acceptedGroups.length; i++) {
                const data = await axios.get(BACKEND_URL + '/groups/groupbyid/' + groups.data.acceptedGroups[i].groupID);
                this.setState({
                    groups: [...this.state.groups, data.data]
                })
            }
        }
        this.props.recentactivityAction(this.state).then(response => {
            console.log(this.props.userData.data);
            if (this.props.userData.data.length == 0) {
                this.setState({
                    emptyStateFlag: true
                })
            }
            else {
                this.props.userData.data.map((recentactivity) => {
                    this.setState({
                        recentactivity: [...this.state.recentactivity, recentactivity]
                    })
                })
            }
        })
        this.props.groupGetByIDAction(cookie.load('id'));
    }
    onClear = () => {
        window.location.reload();
    };
    render() {
        let redirectTo = null;
        if (!(cookie.load("auth"))) {
            redirectTo = <Redirect to="/" />
        }
        let orderByOptions = [
            { value: '-1', label: 'Most Recent First' },
            { value: '1', label: 'Most Recent Last' },
        ]
        let pageOptions = [
            { value: '2', label: '2' },
            { value: '5', label: '5' },
            { value: '10', label: '10' },
        ]
        let groupOptions = this.state.groups.map(function (group) {
            return { value: group[0]._id, label: group[0].groupName };
        })
        let recentactivityDetails = null;
        if (this.state.emptyStateFlag) {
            recentactivityDetails = (
                <div style={{ margin: "200px" }}>
                    <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                    <h4 style={{ font: "Bookman" }}>Sorry, no activities yet to display!!</h4>
                </div>
            )
        }
        else {
            recentactivityDetails = this.state.recentactivity.slice(this.state.offset, this.state.offset + this.state.perPage).map((group, index) => {
                let groupDivision = null;
                let groupPayingDivision = null;
                let amount = group.amount / group.count;
                amount = amount.toFixed(2);
                let getAmount = 0;
                if (group.count == 2) {
                    getAmount = amount / 2;
                }
                else if (group.count == 1) {
                    getAmount = amount;
                }
                else {
                    getAmount = (group.count - 1) * amount;
                }
                getAmount = Number(getAmount).toFixed(2);
                if (Number(group.settleflag) > 0) {
                    groupDivision = <p style={{ fontSize: "20px" }}><b>{group.userName} in <b>"{group.groupName}".</b></b></p>
                    groupPayingDivision = <div style={{ 'color': '#20BF9F', fontSize: "18px" }}><b> {group.currency} {group.amount > 0 ? group.amount : -1 * group.amount} {' '}dues cleared  </b></div>
                }
                else if (Number(group.commentFlag) == 1) {
                    if (group.userName == cookie.load('name')) {
                        groupDivision = <p style={{ fontSize: "20px" }}><b>You</b> added a comment <b>"{group.message}"</b> in <b>"{group.groupName}".</b></p>
                    }
                    else {
                        groupDivision = <p style={{ fontSize: "20px" }}><b>"{group.userName}"</b> added a comment <b>"{group.message}"</b> in <b>"{group.groupName}".</b></p>
                    }
                }
                else {
                    if (group.payeeID == cookie.load('id')) {
                        amount = group.amount.toString();
                        amount = amount.slice(0, (amount.indexOf(".")) + 3);
                        groupDivision = <p style={{ fontSize: "20px" }}><b>You</b> updated <b>"{group.description}"</b> in <b>"{group.groupName}". </b></p>
                        groupPayingDivision = <div style={{ 'color': '#20BF9F', fontSize: "18px" }}><b>You get back {group.currency} {amount}</b></div>

                    }
                    else {
                        amount = group.amount.toString();
                        amount = amount.slice(0, (amount.indexOf(".")) + 3);
                        amount = group.amount.toFixed(2);
                        amount = -1 * amount;
                        groupDivision = <p style={{ fontSize: "18px" }}><b>"{group.userName}"</b> added <b>"{group.description}"</b> in <b>"{group.groupName}".</b></p>
                        groupPayingDivision = <div style={{ 'color': '#FF8C00', fontSize: "18px" }}><b>You owe {group.currency} {amount}</b></div>
                    }
                }
                return (
                    <div>
                        <div className="row" className="row" style={{ height: "100px", borderBottom: "0.01px solid lightgrey", borderLeft: "0.01px solid lightgrey", borderRight: "0.01px solid lightgrey", borderWidth: "thin", marginLeft: "-14px", height: "130px" }}>
                            <div className="col-2">
                                <img src={grocerylogo} style={{ "paddingLeft": "0%", marginLeft: "10px", marginTop: "20px" }} width="60%" height="60%" alt="" />
                            </div>
                            <div className="col-8" style={{ marginTop: "20px", marginLeft: "5px", zIndex: "100", position: "relative" }}>
                                {groupDivision}
                                <div style={{ marginTop: "-15px", color: "grey" }}>
                                    {groupPayingDivision}
                                    {moment(group.createdAt).tz(cookie.load("timezone")).format("MMM")}
                                    {' '}
                                    {moment(group.createdAt).tz(cookie.load("timezone")).format("D")}
                                </div>
                            </div>
                        </div>
                    </div >
                )
            });
        }
        let pageCount = null;
        pageCount = Math.ceil(this.state.recentactivity.length / this.state.perPage)
        return (
            <div className="row">
                {redirectTo}
                <div className="col-3 p-1 m-3">
                    <Select
                        style={{ width: "300px", marginLeft: "-30px" }}
                        name="form-field-name"
                        onChange={this.handleChange}
                        labelKey='name'
                        valueKey='groupid'
                        placeholder="Select a particular group for recent activities"
                        options={groupOptions}
                    />
                    <Select
                        style={{ width: "400px", marginLeft: "-30px" }}
                        name="form-field-name"
                        onChange={this.handleOrderByChange}
                        placeholder="Select Order by"
                        options={orderByOptions}
                    />
                    <button class="btn btn-info" style={{ marginLeft: "100px", marginTop: "20px", backgroundColor: "#20BF9F" }} onClick={this.onClear}>Clear Value</button>
                    <h4>Pagination Options</h4>
                    <Select
                        style={{ width: "400px", marginLeft: "-30px", marginTop: "100px" }}
                        name="form-field-name"
                        onChange={this.handlePaginationChange}
                        placeholder="Select Pagination Options"
                        options={pageOptions}
                        defaultValue={{ label: "2", value: "2" }}
                    />
                </div>
                <div className="col-6">
                    <div className="row" style={{ height: "80px", backgroundColor: "whitesmoke" }}>
                        <strong style={{ margin: "20px", fontSize: "30px" }}>Recent Activity</strong>
                    </div>
                    {recentactivityDetails}
                    <div className="col-5">
                        <ReactPaginate
                            previousLabel={"prev"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"} />
                    </div>
                </div>
            </div>
        )
    }
}
const matchStateToProps = (state) => {
    return {
        error: state.recentActivityReducer.error,
        userData: state.recentActivityReducer.userData,
        groupData: state.getByIDReducer.userData
    }
}
const matchDispatchToProps = (dispatch) => {
    return {
        recentactivityAction: (data) => dispatch(recentactivityAction(data)),
        groupGetByIDAction: (data) => dispatch(groupGetByIDAction(data)),

    }
}

export default connect(matchStateToProps, matchDispatchToProps)(RecentActivity)
