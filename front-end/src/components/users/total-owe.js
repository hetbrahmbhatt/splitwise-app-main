import React, { Component } from 'react'
import cookie from "react-cookies";
import profilePhoto from '../../images/profile-icon.png'
import axios from 'axios';
import BACKEND_URL from '../../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export class TotalOwe extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.totalOweData);
        if (this.props.totalOweData.userID1 == cookie.load('id')) {
            this.state = {
                groupName: this.props.totalOweData.groupName,
                id: this.props.totalOweData.userID2,
                name: this.props.totalOweData.userID2Name,
                groupID: this.props.totalOweData.groupID,
                currency: this.props.totalOweData.currency,
                sessionID: cookie.load('id'),
                amount: this.props.totalOweData.amount
            }
        }
        else if (this.props.totalOweData.userID2 == cookie.load('id')) {
            this.state = {
                groupName: this.props.totalOweData.groupName,
                id: this.props.totalOweData.userID1,
                name: this.props.totalOweData.userID1Name,
                groupID: this.props.totalOweData.groupID,
                currency: this.props.totalOweData.currency,
                sessionID: cookie.load('id'),
                amount: this.props.totalOweData.amount
            }
        }

    };
    handleSubmit = e => {
        e.preventDefault();
        axios.post(BACKEND_URL + "/expenses/owingsettleup", this.state).then(response => {
            if (response) {
                toast.success("You are all settled up.Please reload the page to update the status.");

            }
            else {

            }
        });

    }
    render() {
        console.log(this.state);
        let amountData = null;
        if (this.state.amount < 0) {
            amountData = <div className="col-3">
                <div style={{ marginLeft: "10px", marginTop: "20px", color: "#20BF9F" }}><strong>{this.state.currency}{-1 * this.state.amount}</strong></div>

            </div>
        }
        else {
            amountData = <div className="col-3">
                <div style={{ marginLeft: "10px", marginTop: "20px", color: "#20BF9F" }}><strong>{this.state.currency}{this.state.amount}</strong></div>

            </div>
        }
        return (
            <form onSubmit={this.handleSubmit} id="totalOwe">
                <div style={{ margin: "50px" }} >

                    <div className="row" style={{ backgroundColor: "#fafafa" }}>
                        <div className="col-2">
                            <img
                                src={profilePhoto} width="70px" height="70px" alt="" style={{ borderRadius: "50px" }} />
                        </div>

                        <div className="col-3">
                            <div style={{ marginTop: "20px" }}><strong>{this.state.name} owes you </strong></div>

                        </div>
                        {amountData}
                        <span style={{ marginTop: "20px" }} >IN</span>
                        <div className="col-3">

                            <div style={{ marginLeft: "10px", marginTop: "20px" }}><strong>{this.state.groupName}</strong></div>
                        </div>
                    </div>
                    <div className="row" style={{ marginLeft: "200px", marginTop: "30px" }}>
                        <button type="submit" style={{ backgroundColor: "#20BF9F" }} class="btn btn-primary btn-sm" onSubmit={this.handleSubmit}>Settle-Up</button>
                    </div>
                </div>
                <ToastContainer />

            </form>

        )
    }
}

export default TotalOwe
