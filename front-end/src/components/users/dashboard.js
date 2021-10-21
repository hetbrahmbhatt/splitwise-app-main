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
        axios.defaults.headers.common["authorization"] = cookie.load('token')
        axios.defaults.withCredentials = true;
        const totalGivingResponse1 = await axios.post(BACKEND_URL + "/expenses/totalgiving/" + cookie.load('id'));
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
