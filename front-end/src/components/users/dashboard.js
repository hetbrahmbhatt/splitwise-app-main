import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import _ from 'lodash';
import axios from 'axios';
import BACKEND_URL from '../../config/config';
import emptyplaceholder from '../../images/empty-placeholder.png';
import TotalOwe from './total-owe';
import TotalGiving from './total-giving';

export class DashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalBalance: "",
            totalNegativeBalance: [],
            totalPositiveBalance: [],
            totalBalance: [],
            totalOwingData: [],
            totalOwingFlag: false,
            totalGivingFlag: false,
            totalGivingData: [],
        }
    }
    async componentDidMount() {
        var userID = cookie.load("id");
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        const totalGivingResponse1 = await axios.post(BACKEND_URL + "/expenses/totalgiving/" + cookie.load('id'));
        console.log(totalGivingResponse1);
        console.log("Here");
        if (totalGivingResponse1.data.length == 0) {
            this.setState({
                totalGivingFlag: true
            })

        }
        else {
            this.setState({
                totalGivingData: totalGivingResponse1.data
            })
        }
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        const totalOwingReponse1 = await axios.post(BACKEND_URL + "/expenses/totalowing/" + cookie.load('id'));
        console.log(totalOwingReponse1);
        if (totalOwingReponse1.data.length == 0) {
            this.setState({
                totalOwingFlag: true
            })
        }
        else {
            this.setState({
                totalOwingData: totalOwingReponse1.data
            })
        }

    }
    render() {
        let redirectTo = null;
        if (!(cookie.load("auth"))) {
            redirectTo = <Redirect to="/" />
        }
        let totalOwe = null;
        let totalGiving = null;
        console.log(this.state)
        if (this.state.totalOwingFlag) {
            totalOwe = (
                <div style={{ margin: "130px" }}>
                    <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                    <h4 style={{ font: "Bookman" }}>You are owed nothing</h4>
                </div>
            )

        }
        else {
            totalOwe = this.state.totalOwingData.map((data, index) => {
                console.log(data[index])
                return (
                    <div>
                        <TotalOwe key={data._id} totalOweData={data} />
                    </div>

                )
            })
        }
        if (this.state.totalGivingFlag) {
            totalGiving = (
                <div style={{ margin: "130px" }}>
                    <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                    <h4 style={{ font: "Bookman", "marginLeft": "50px" }}>You owe nothing</h4>
                </div>
            )

        }
        else {
            totalGiving = this.state.totalGivingData.map((data, index) => {
                return (
                    <div>
                        <TotalGiving key={data._id} totalGiveData={data} />
                    </div>

                )
            })
        }
        console.log(this.state);
        return (
            <div>
                {redirectTo}
                <div className="row">
                    <div className="col-1">
                    </div>
                    <div className="col-10">
                        <div style={{ backgroundColor: "whitesmoke", height: "90px" }}>
                            <div className="row">
                                <p style={{ marginLeft: "550px", marginTop: "30px" }}><h3><strong>Dashboard</strong></h3></p>
                            </div>
                        </div>
                        <div style={{ backgroundColor: "whitesmoke", height: "100px", borderTop: "0.6px solid lightgrey" }}>
                            <div className="row">
                                <div col-2 style={{ marginLeft: "70px", height: "90px", marginTop: "5px", width: "26%", marginRight: "60px", paddingRight: "60px", borderRight: "1px solid lightgrey" }}><h5>total</h5><p style={{ color: "#20BF9F", fontSize: "18px", marginLeft: "-40px" }}><strong>{this.state.totalBalance}</strong></p></div>
                                <div col-2 style={{ marginLeft: "10px", width: "33%", marginTop: "5px", marginRight: "60px", paddingRight: "90px", borderRight: "1px solid lightgrey" }}><center><h5>you owe</h5><p style={{ color: "#20BF9F", fontSize: "18px", marginLeft: "0px" }}><strong>{this.state.totalPositiveBalance}</strong></p></center></div>
                                <div col-2 style={{ marginLeft: "10px", marginTop: "5px", maxWidth: "120px", marginRight: "60px", paddingRight: "2px" }}><h5>you are owed</h5><p style={{ color: "red", fontSize: "18px", marginLeft: "0px", color: "#FF8C00" }}><strong>{this.state.totalNegativeBalance}</strong></p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-3">

                                </div>
                                <div className="col-3">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-1">
                    </div>
                </div>
                <div className="row" style={{ marginTop: "20px" }}>
                    <div className="col-1">
                    </div>
                    <div className="col-5" style={{ borderRight: "2px solid lightgrey" }}>
                        <div style={{ marginLeft: "250px" }}>
                            YOU ARE OWED
                        </div>
                    </div>
                    <div className="col-5">
                        <div style={{ marginLeft: "150px" }}>
                            YOU OWE
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-1">
                    </div>
                    <div className="col-5" style={{ borderRight: "2px solid lightgrey" }}>
                        <div style={{ padding: "0px" }}>
                            {totalOwe}
                        </div>
                    </div>
                    <div className="col-5">
                        {totalGiving}
                        <div style={{ marginLeft: "150px" }}>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default DashBoard
