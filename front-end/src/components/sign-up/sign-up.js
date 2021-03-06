import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../../config/config';
import splitwiselogo from '../../images/signup.png'
import cookie from "react-cookies";
import { connect } from "react-redux";
import signUpAction from '../../actions/signupAction';
import { Redirect } from 'react-router'

export class signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            error: false,
            errorMessage: "",
            emailError: false,
            backendError: false
        }
    }
    handlePasswordChange = inp => {
        this.setState({
            password: inp.target.value
        })

    }
    handleEmailChange = inp => {
        console.log(inp.target.name, inp.target.value);
        if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(inp.target.value)) {
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value,
                errorMessage: " "
            })
        } else {
            this.setState({
                error: true,
                backendError: false,

                errorMessage: "Please correct email",
                [inp.target.name]: ""
            })
        }
    }
    //handle input change
    handleInputChange = inp => {
        // console.log( inp.target.name, inp.target.value );
        if (/[~`!#$@%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(inp.target.value)) {
            this.setState({
                error: true,
                errorMessage: "Special characters not allowed",
                [inp.target.name]: ""
            })
        } else {
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value,
                errorMessage: " "

            })
        }
    }
    //handle submit
    handleSubmit = e => {
        if (!this.state.error) {
            e.preventDefault();
            this.props.signUpAction(this.state).then(response => {
                if (this.props.error) {
                    this.setState(
                        {
                            backendError: true
                        }
                    )
                }
            })
        };
    }
    render() {
        let renderError = null;
        let emailError = null;
        let redirectVar = null
        let duplicateEmailError = null
        if (this.props.auth) {
            redirectVar = <Redirect to="/dashboard" />
        }
        if (this.state.backendError) {
            duplicateEmailError = <div style={{ 'color': 'red' }}>Email ID already exists</div>
        }
        if (this.state.emailError) {
            emailError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
        }
        if (this.state.error) {
            renderError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
        }
        return (
            <div>
                {redirectVar}
                <div className="row" style={{ height: "100vh", "padding": "10%" }}>
                    <div className="col-5">
                        <img src={splitwiselogo} style={{ marginLeft: "360px", marginTop: "-50px" }} width="220" height="250" alt="" />
                    </div>
                    <div className="col-5" style={{ "paddingLeft": "10%" }}>
                        <div className='row' style={{ "height": "90%" }}>
                            <div className="col-12">
                                <h4 >Please Introduce Yourself</h4>
                                <form onSubmit={this.handleSubmit} style={{ "margin": "10px" }} id="Signup">
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="name" autoFocus required
                                            placeholder="Enter Name" onChange={this.handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="email" required
                                            placeholder="Enter Email" onChange={this.handleEmailChange} />
                                        {emailError}
                                        {duplicateEmailError}
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control" name="password" required
                                            placeholder="Enter Password" onChange={this.handlePasswordChange} />
                                    </div>
                                    <div className="form-group">
                                        {this.state.type === 'restaurants' ? <input type="text" className="form-control" name="address" required
                                            placeholder="Enter location" onChange={this.handleInputChange} /> : undefined}
                                    </div>
                                    <button type="submit" className="btn btn-success" onSubmit={this.handleSubmit}>Sign Up</button>
                                </form>
                                {renderError}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const matchStateToProps = (state) => {
    return {
        auth: state.SignUpReducer.auth,
        error: state.SignUpReducer.error,
        message: state.SignUpReducer.message
    }
}
const matchDispatchToProps = (dispatch) => {
    return {
        signUpAction: (data) => dispatch(signUpAction(data)),
    }
}
export default connect(matchStateToProps, matchDispatchToProps)(signup)
