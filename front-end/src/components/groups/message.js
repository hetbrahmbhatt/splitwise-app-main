import React, { Component } from 'react'
import { connect } from "react-redux";
import groupSummaryByIDAction from '../../actions/getGroupSummaryByGroupID'
import userMessageAction from '../../actions/userMessageAction'
import axios from 'axios';
import BACKEND_URL from '../../config/config'
import cookie from "react-cookies";
import './message.css'
import moment from 'moment-timezone';

export class Messages extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messagesPopUp: false,
            reply: "",
            conversations: this.props.groupSumData.messages,
            groupSummaryID: this.props.groupSumData._id,
            groupName: this.props.groupSumData.groupName
        }
    }
    handleReplyChange = (e) => {
        this.setState({
            reply: e.target.value
        })
    }

    // delete message 
    handDeleteMessage = (e) => {
        var answer = window.confirm("Are you sure you want to delete this comment?");
        if (answer) {
            axios.defaults.headers.common["authorization"] = cookie.load('token')
            axios.defaults.withCredentials = true;
            var obj = {
                groupSummaryID: this.state.groupSummaryID,
                messageID: e.target.value
            }
            return axios.put(BACKEND_URL + '/groups/removemessage', obj).then(response => {
                this.setState({
                    conversations: response.data.messages
                })
                this.someText.value = "";
            }).catch(err => {
            })
        }
        else {
        }
    }

    // handle the reply 
    handleReply = () => {
        var data = {
            groupSummaryID: this.props.groupSumData._id,
            userID: cookie.load('id'),
            userName: cookie.load('name'),
            groupSummaryDescription: this.props.groupSumData.description,
            messageString: this.state.reply,
            groupName: this.state.groupName,
            groupID: this.props.groupSumData.groupID
        }
        this.props.userMessageAction(data).then(response =>{
            this.setState({
                conversations : this.props.messageData.messages
            })
            this.refs.someText.value = ""; // remove the value from the input 
        });
    }
    toggleMessagesPopUp = (e) => {
        this.setState({
            messagesPopUp: !this.state.messagesPopUp

        })
    }
    render() {
        let displayConversation = null
        let button = null;
        // Display conversation accordingly
        displayConversation = this.state.conversations.map(conversation => {
            if (conversation.name == cookie.load('name')) {
                button = <button onClick={this.handDeleteMessage} value={conversation._id} className="close"></button>
            }
            else {
                button = null
            }
            return (
                <div className="col-10 m-4" style={{ border: "1px solid #222", backgroundColor: "whitesmoke", borderRadius: '10px', marginLeft: "20px" }} >
                    <div style={{ backgroundColor: "whitesmoke" }}>
                        <h5><strong>{conversation.name} {' '}{''}</strong>                            <small>                        {moment(conversation.createdAt).tz(cookie.load("timezone")).format("MMM")}
                            {' '}
                            {moment(conversation.createdAt).tz(cookie.load("timezone")).format("D")}
                        </small></h5>
                        <div style={{ height: "10px" }}>
                        </div>
                        {conversation.message}
                        {button}
                    </div>
                </div>
            )
        })
        return (
            <div>
                <div className="row">
                    <div className="col-7">  <div className="view-messages" >
                    </div>
                        <div class="box" style={{ margin: "20px" }}>
                            <div style={{ marginLeft: "50px" }}>
                                NOTES AND COMMENTS
                            </div>
                            <div className="row">
                                {displayConversation}
                            </div>
                        </div>
                        <div className="col-4">
                            <input type="textbox" ref="someText" placeholder="Add a comment" style={{ border: "1px solid #222", borderRadius: '10px', height: "50px", marginLeft: "10px", width: "300px" }} onChange={this.handleReplyChange} />
                            <button className="btn btn-danger" style={{ backgroundColor: "#20BF9F", padding: "10px", marginLeft: "10px", marginTop: "10px" }} onClick={this.handleReply}>Add a comment</button>

                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

const matchStateToProps = (state) => {
    return {
        error: state.groupSummaryByIDReducer.error,
        groupSummaryData: state.groupSummaryByIDReducer.groupSummaryData,
        messageData : state.userMessageReducer.userMessageData
    }

}

const matchDispatchToProps = (dispatch) => {
    return {
        groupSummaryByIDAction: (data) => dispatch(groupSummaryByIDAction(data)),
        userMessageAction: (data) => dispatch(userMessageAction(data)),

    }
}

export default connect(matchStateToProps, matchDispatchToProps)(Messages)

