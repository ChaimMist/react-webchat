import './MessagesComponent.css'
import {TextComponent} from "./TextComponent/TextComponent";
import {useSelector, useDispatch} from "react-redux";
import {dispatchEvent} from "../../../reduxFeatures/Socket";
import {addMessage} from "../../../reduxFeatures/currentSession";

export function MessagesComponent(props) {
    const currentSession = useSelector(state => state.currentSession.obj)
    const dispatch = useDispatch()
    const userInfo = useSelector(state => state.userInfo)
    console.log(currentSession)

    const sendMessage = () => {
        console.log(currentSession.chatID, "notify")
        dispatch(dispatchEvent(["notify", currentSession.chatID]))
        let message = document.getElementById("sendMessageInput").value
        fetch("http://localhost:3000/send-message", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatID: currentSession.chatID,
                userID: userInfo.id,
                message: message,
            })
        }).then(()=>{
            dispatch(dispatchEvent(["notify", currentSession.chatID]))
            dispatch(addMessage(message))
        })
    }

    return (
        <div className={"chat-container h-100"}>
            <div className={"w-100 h-100"}>
                <div className={"chat-header w-100 p-2 shadow sticky-top d-flex flex-row align-items-center"}>
                    <div className={"chat-header-user"}>
                        <div className={"chat-header-user-img hover-scale"}>
                            <img src={currentSession.image} width={45} alt={"user"}/>
                        </div>
                    </div>
                    <div className={"p-2 d-flex flex-column align-items-start"}>
                        <p>{currentSession.chatName}</p>
                        <div
                            className={"text-secondary fw-light contact-subtext position-relative"}>{new Date(currentSession.updated_at).toLocaleString()}</div>
                    </div>
                </div>

                <div className={"chat-body p-5"}>
                    {
                        currentSession.messages.length > 0 ? currentSession.messages.map((message, index) => {
                                return <TextComponent key={index}
                                                      sender={message.user_id == userInfo.id ? "me" : message.sender}
                                                      align={message.user_id == userInfo.id ? "end" : "start"}
                                                      text={message.message}
                                                      date={message.created_at}
                                />
                            }
                        ) : <div className={"d-flex justify-content-center w-100"}>
                            <h1>Start messaging</h1>
                        </div>
                    }
                </div>
                <div className={"chat-footer shadow-top-sm p-3 d-flex flex-row align-items-center"}>
                    <div className={"w-100 "}>
                        <input id={"sendMessageInput"} type={"text"} className={"form-control"}
                               placeholder={"Type a message"}/>
                    </div>
                    <div className={"send-btn"}>
                        <button className={"btn btn-primary"} onClick={
                            () => {
                                sendMessage()
                            }}>
                            <i className={"fas fa-paper-plane"}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>)


}
