import React, { Component } from 'react'
import Modal from 'react-modal';
// import userMessageAction from '../../../actions/userMessageAction'
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
        console.log(this.props.groupSumData)

    }

    handleReplyChange = (e) => {
        this.setState({
            reply: e.target.value
        })
    }

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
                console.log(response.data);
                // dispatch(success(response, data))
                this.setState({
                    conversations: response.data.messages
                })
                this.someText.value = "";
            }).catch(err => {
                // dispatch(error(err))
            })
        }
        else {
        }
        console.log(e.target.value)
    }

    handleReply = () => {
        console.log(this.props.groupSummaryData)
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
            // console.log(this.props.messageData);
            this.setState({
                conversations : this.props.messageData.messages
            })
            this.refs.someText.value = "";
        });
    }

    toggleMessagesPopUp = (e) => {
        this.setState({
            messagesPopUp: !this.state.messagesPopUp

        })
    }

    render() {
        console.log(this.props);

        let displayConversation = null
        let button = null;


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
                        {/* <Modal isOpen={this.state.messagesPopUp} style={{
                            overlay: {
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.25)'
                            },
                            content: {
                                top: '50%',
                                left: '50%',
                                right: '50%',
                                bottom: '50%',
                                marginRight: '-50%',
                                transform: 'translate(-50%, -50%)',
                                height: '500px', // <-- This sets the height
                                overlfow: 'scroll' // <-- This tells the modal to scroll
                            }
                        }} > */}
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
                        {/* </Modal> */}
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

