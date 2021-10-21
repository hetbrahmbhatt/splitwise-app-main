import React, { Component } from 'react'
import cookie from "react-cookies";
import profilePhoto from '../../images/profile-icon.png'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import owingSettleUpAction from '../../actions/owingSettleUpAction';
import { connect } from "react-redux";
export class TotalOwe extends Component {
    constructor(props) {
        super(props)
        if (this.props.totalOweData.userID1 == cookie.load('id')) {
            this.state = {
                groupName: this.props.totalOweData.groupName,
                userid: this.props.totalOweData.userID2,
                userName: this.props.totalOweData.userID2Name,
                groupID: this.props.totalOweData.groupID,
                currency: this.props.totalOweData.currency,
                sessionID: cookie.load('id'),
                amount: this.props.totalOweData.amount,
                sessionName: cookie.load('name'),
                debtID: this.props.totalOweData._id,
            }
        }
        else if (this.props.totalOweData.userID2 == cookie.load('id')) {
            this.state = {
                groupName: this.props.totalOweData.groupName,
                userid: this.props.totalOweData.userID1,
                userName: this.props.totalOweData.userID1Name,
                groupID: this.props.totalOweData.groupID,
                currency: this.props.totalOweData.currency,
                sessionID: cookie.load('id'),
                amount: this.props.totalOweData.amount,
                sessionName: cookie.load('name'),
                debtID: this.props.totalOweData._id,
            }
        }

    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.owingSettleUpAction(this.state).then(response => {
            
        })

    }
    render() {
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
                            <div style={{ marginTop: "20px" }}><strong>{this.state.userName} owes you </strong></div>

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
const matchStateToProps = (state) => {
    return {
        owingData: state.owingSettleUpReducer.owingsettleUpData
    }
}
const matchDispatchToProps = (dispatch) => {
    return {
        owingSettleUpAction: (data) => dispatch(owingSettleUpAction(data)),
    }
}
export default connect(matchStateToProps, matchDispatchToProps)(TotalOwe)
