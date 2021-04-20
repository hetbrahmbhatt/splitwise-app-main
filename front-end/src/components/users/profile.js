import React, { Component } from 'react'
import { Redirect } from 'react-router';
import { toast } from "react-toastify";
import cookie from 'react-cookies';
import axios from 'axios';
import BACKEND_URL from '../../config/config'
import Select from 'react-select'
import updateUserProfileAction from '../../actions/updateUserProfileAction';
import { connect } from "react-redux";

export class Profile extends Component {
    state = {
        userID: cookie.load('id'),
        name: "",
        email: "",
        phoneno: "",
        defaultcurrency: cookie.load('defaultcurrency'),
        timezone: cookie.load('timezone'),
        language: "",
        profileImageUpdate: false,
        updatedProfileImage: "",
        profileImagePath: "https://splitwise-app-main.s3.us-east-2.amazonaws.com/michael-photo.png",
        emailError: false,
        error: false
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
                errorMessage: "Please correct email",
                [inp.target.name]: ""
            })
        }
    }
    //handle input change
    handleInputChange = inp => {
        if (inp.target.value == "") {
            this.setState({
                error: true,
                errorMessage: "Please enter a username",
                [inp.target.name]: ""
            })
        }
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
                [inp.target.name]: inp.target.value
            })
        }

    }
    handleCurrencyChange = e => {
        this.setState({
            defaultcurrency: e.value
        })
    }
    handleTimezoneChange = e => {
        this.setState({
            timezone: e.value
        })
    }
    handleLanguageChange = e => {
        this.setState({
            language: e.value
        })
    }
    handleImageChange = e => {

        this.setState({
            updatedProfileImage: e.target.files[0],
            profileImageUpdate: true
        })
    }

    handleNumberChange = inp => {
        if (/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(inp.target.value)) {
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value,
                errorMessage: " "
            })
        } else {
            this.setState({
                error: true,
                errorMessage: "Please write in standard format",
                [inp.target.name]: ""
            })
        }
    }
    handleOnSubmit = e => {
        e.preventDefault();
        console.log(this.state);
        if (this.state.name == "") {
            this.setState({
                error: true,
                errorMessage: "Please enter a username",
            })
        }
        else if (this.state.email == "") {
            this.setState({
                error: true,
                errorMessage: "Please enter email",
            })
        }
        else if (!this.state.error) {
            if (this.state.profileImageUpdate) {
                const formData = new FormData();
                formData.append('profileImage', this.state.updatedProfileImage, this.state.updatedProfileImage.name + "," + this.state.userID)
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
                axios
                    .post(BACKEND_URL + '/users/uploadprofileimage', formData, config).then((response) => {
                        this.setState({
                            profileImagePath: BACKEND_URL + '/images/profilepics/' + cookie.load('id') + '/' + response.data.fileName

                        })
                    }).catch(err => {
                        toast.error("Error in image upload")
                    })
            }
            console.log(this.state);
            this.props.updateUserProfileAction(this.state).then(response => {

                console.log(this.props.user)
            });
        }

    }
    async componentDidMount() {
        try {
            console.log(this.props);
            const userID = cookie.load("id")
            console.log(userID);
            axios.defaults.headers.common["authorization"] = cookie.load('token')
            axios.defaults.withCredentials = true;
            const response = await axios.get(BACKEND_URL + "/users/userbyid/" + userID);
            console.log(response.data[0]);
            this.setState({
                userID: response.data[0]._id,
                name: response.data[0].name,
                email: response.data[0].email,
                defaultcurrency: response.data[0].defaultCurrency,
                phoneno: response.data[0].phoneno,
                timezone: response.data[0].timezone,
                language: response.data[0].language,

            })
            if (response.data[0].image == null) {
                this.setState({
                    profileImagePath: BACKEND_URL + '/images/avatar.png'
                })
            }
            else {
                this.setState({
                    profileImagePath: 'https://splitwise-app-main.s3.us-east-2.amazonaws.com/michael-photo.png_606f7da299771a0c293ac668'
                })
            }
        }
        catch (err) {
            console.log(err)
        }

    }

    render() {
        console.log(this.state);
        var redirectTo = null;
        var emailError = null;
        const currency = [
            { value: '$', label: 'USD($)' },
            { value: 'KWD', label: 'KWD(KWD)' },
            { value: 'BHD', label: 'BHD(BD)' },
            { value: '£', label: 'GBP(£)' },
            { value: '€', label: 'EUR(€)' },
            { value: 'CAD', label: 'CAD($)' }
        ]
        const timezone = [
            { value: 'Pacific/Niue', label: '(GMT -11:00) Midway Island, Samoa' },
            { value: 'Pacific/Rarotonga', label: '(GMT -10:00) Hawaii' },
            { value: 'Asia/Pyongyang', label: '(GMT -9:00) Alaska' },
            { value: 'American/Los_Angeles', label: '(GMT -8:00) Pacific Time (US &amp; Canada)' },
            { value: 'America/Halifax', label: '(GMT -7:00) Mountain Time (US &amp; Canada)' },
            { value: 'America/Winnipeg', label: '(GMT -6:00) Central Time (US &amp; Canada), Mexico City' },
            { value: 'America/Toronto', label: '(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima' },
            { value: 'America/Dominica', label: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz' },
            { value: 'Chile/Continental', label: '(GMT -3:00) Brazil, Buenos Aires, Georgetown' },
            { value: 'Atlantic/South_Georgia', label: '(GMT -2:00) Mid-Atlantic' },
            { value: 'Africa/Banjul', label: '(GMT) Western Europe Time, London, Lisbon, Casablanca' },
            { value: 'Europe/Gibraltar', label: '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris' },
            { value: 'Europe/Athens', label: '(GMT +2:00) Kaliningrad, South Africa' },
            { value: 'America/New_York', label: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg' },
            { value: 'Asia/Baku', label: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi' },
            { value: 'Asia/Kabul', label: '(GMT +4:30) Kabul' },
            { value: 'America/California', label: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent' },
            { value: 'America/New_York', label: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi' },
            { value: 'America/Austin', label: '(GMT +5:45) Kathmandu, Pokhara' },
            { value: 'Asia/Thimphu', label: '(GMT +6:00) Almaty, Dhaka, Colombo' },
            { value: 'Asia/Dhaka', label: '(GMT +7:00) Bangkok, Hanoi, Jakarta' },
            { value: 'Australia/West', label: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong' },
            { value: 'Australia/North', label: '(GMT +9:30) Adelaide, Darwin' },
            { value: 'Australia/Queensland', label: '(GMT +10:00) Eastern Australia, Guam, Vladivostok' },
            { value: 'Australia/Canberra', label: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia' },

        ]
        const language = [
            { value: 'English', label: 'English' },
            { value: 'Spanish', label: 'Spanish' },
            { value: 'Chinese', label: 'Chinese' },
            { value: 'Mandarin', label: 'Mandarin' },
            { value: 'French', label: 'French' },

        ]
        if (!(cookie.load("auth"))) {
            redirectTo = <Redirect to="/" />
        }
        if (this.state.emailError) {
            emailError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
        }
        let renderError = null
        if (this.state.error) {
            renderError = <div style={{ 'color': 'red', 'marginLeft': '-200px' }}>{this.state.errorMessage}</div>
        }
        return (
            <div>
                { redirectTo}
                <div class="container" style={{ "marginLeft": '250px', "marginTop": '20px' }}>
                    <div class="row">
                        <div class="col-sm">
                            <div className="row"><h2 style={{ "marginLeft": '20px' }}>
                                Your Account</h2></div>
                            <img src={this.state.profileImagePath} width="200" height="200" alt="" />

                            <div className="row"><p style={{ "margin-left": '20px' }}>Change your Avatar</p></div>
                            <div className="row">
                                <input style={{ "marginLeft": '20px' }} accept="image/x-png,image/gif,image/jpeg" type="file" name="profileImage" onChange={this.handleImageChange} />
                            </div>
                        </div>
                        <div class="col-sm">
                            <form onSubmit={this.handleOnSubmit}>
                                <div className="row" style={{ "marginLeft": '-300px', "marginTop": '30px' }}>
                                    <div className="col-3">
                                        <label>Your Name:</label>
                                        <input type="text" className="form-control" name="name"
                                            placeholder={this.state.name} onChange={this.handleInputChange} />
                                    </div>
                                    <div className="col-3" style={{ "marginTop": "30px" }}>
                                        <Select
                                            options={currency}
                                            placeholder={this.state.defaultcurrency}
                                            onChange={this.handleCurrencyChange} />
                                    </div>
                                </div>
                                <div className="row" style={{ "marginLeft": '-300px', "marginTop": '30px' }}>
                                    <div className="col-3">
                                        <label>Your Email:</label>
                                        <input type="text" className="form-control" name="email"
                                            placeholder={this.state.email} onChange={this.handleEmailChange} />
                                        {emailError}
                                    </div>
                                    <div className="col-3" style={{ "marginTop": "30px" }}>
                                        <Select
                                            options={timezone}
                                            placeholder={this.state.timezone}
                                            onChange={this.handleTimezoneChange} />
                                    </div>
                                </div>
                                <div className="row" style={{ "marginLeft": '-300px', "marginTop": '30px' }}>
                                    <div className="col-3">
                                        <label>Your Phone No:</label>
                                        <input type="text" className="form-control" name="phoneno"
                                            placeholder={this.state.phoneno} onChange={this.handleNumberChange} />
                                    </div>

                                    <div className="col-3" style={{ "marginTop": "30px" }}>
                                        <Select
                                            options={language}
                                            placeholder={this.state.language}
                                            onChange={this.handleLanguageChange} />
                                    </div>
                                </div>
                                {renderError}

                                <button type="submit" className="btn btn-success" style={{ "backgroundColor": "#FF8C00", "marginTop": "100px", "marginLeft": "-100px" }} onSubmit={this.handleSubmit}>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const matchStateToProps = (state) => {
    console.log("inside matchStatetoProps", state)
    return {
        user: state.getUserProfileReducer.userData,
        profileImagePath: state.getUserProfileReducer.profileImagePath,

    }

}
const matchDispatchToProps = (dispatch) => {
    // console.log(dispatch)
    return {
        updateUserProfileAction: (data) => dispatch(updateUserProfileAction(data)),
    }
}

export default connect(matchStateToProps, matchDispatchToProps)(Profile)