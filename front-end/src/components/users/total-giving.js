import React, { Component } from 'react'
import cookie from "react-cookies";
import profilePhoto from '../../images/profile-icon.png'
import axios from 'axios';
import BACKEND_URL from '../../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
export class TotalGiving extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.totalGiveData);
        if (this.props.totalGiveData.userID1 == cookie.load('id')) {
            this.state = {
                userid: this.props.totalGiveData.userID2,
                userName: this.props.totalGiveData.userID2Name,
                groupName: this.props.totalGiveData.groupName,
                groupID: this.props.totalGiveData.groupID,
                amount: this.props.totalGiveData.amount,
                sessionID: cookie.load('id'),
                currency: this.props.totalGiveData.currency,
            }
        }
        else if (this.props.totalGiveData.userID2 == cookie.load('id')) {
            this.state = {
                userid: this.props.totalGiveData.userID1,
                userName: this.props.totalGiveData.userID1Name,
                groupName: this.props.totalGiveData.groupName,
                groupID: this.props.totalGiveData.groupID,
                amount: this.props.totalGiveData.amount,
                sessionID: cookie.load('id'),
                currency: this.props.totalGiveData.currency,
            }
        }
    };
    handleSubmit = e => {
        e.preventDefault();
        axios.post(BACKEND_URL + "/expense/givingsettleup", this.state).then(response => {
            if (response) {
                toast.success("You are all settled up.Please reload the page to update the status.");
            }
            else {

            }
        });

        console.log(this.state);
    }
    render() {
        console.log(this.state);
        let amountData = null
        if (this.state.amount < 0) {
            amountData = <div className="col-3">
                <div style={{ marginLeft: "10px", marginTop: "20px", color: "#FF8C00" }}><strong>{this.state.currency}{-1 * this.state.amount}</strong></div>

            </div>
        }
        else {
            amountData = <div className="col-3">
                <div style={{ marginLeft: "10px", marginTop: "20px", color: "#FF8C00" }}><strong>{this.state.currency}{this.state.amount}</strong></div>

            </div>
        }
        return (
            <form onSubmit={this.handleSubmit} id="totalOwe">

                <div style={{ margin: "50px" }} >
                    <div className="row" style={{ backgroundColor: "#fafafa" }}>
                        <div className="col-2">                            <img
                            src={profilePhoto} width="70px" height="70px" alt="" style={{ borderRadius: "50px" }} />
                        </div>
                        <div className="col-3">
                            <div style={{ marginTop: "20px" }}><strong>you owe {this.state.userName}</strong></div>
                        </div>
                        {amountData}
                        <span style={{ marginTop: "20px" }} >IN</span>
                        <div className="col-3">

                            <div style={{ marginLeft: "10px", marginTop: "20px" }}><strong>{this.state.groupName}</strong></div>
                        </div>
                    </div>
                    <div className="row" style={{ marginLeft: "200px", marginTop: "30px" }}>
                        <button type="submit" style={{ backgroundColor: "#FF8C00" }} class="btn btn-primary btn-sm" onSubmit={this.handleSubmit}>Settle-Up</button>
                        <ToastContainer />

                    </div>
                </div>
            </form>
        )
    }
}

export default TotalGiving
