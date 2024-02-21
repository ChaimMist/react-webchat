import './MessagesComponent.css'
import {TextComponent} from "./TextComponent/TextComponent";
import {useSelector, useDispatch} from "react-redux";
import {dispatchEvent} from "../../../reduxFeatures/Socket";
import {addMessage, setMessage} from "../../../reduxFeatures/currentSession";
import {useEffect} from "react";


export function MessagesComponent() {
    const currentSession = useSelector(state => state.currentSession.obj)
    const socket = useSelector(state => state.socket.socket)
    const dispatch = useDispatch()
    const userInfo = useSelector(state => state.userInfo)

    


    let handleSendMessage = (currentSession) => {
        if (document.getElementById("sendMessageInput").value === "") return
        let message = document.getElementById("sendMessageInput").value

        fetch("/send-message", {
            method: "POST", headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                chatID: currentSession.chatID, userID: userInfo.id, message: message,
            })
        }).then(() => {
            dispatch(dispatchEvent(["notify", {
                id: currentSession.chatID, senderID: userInfo.id
            }]))
            dispatch(addMessage({
                user_id: userInfo.id,
                sender: userInfo.name,
                message: message,
                created_at: new Date(currentSession.updated_at).toLocaleString()
            }))
            document.getElementById("chat-body").scrollTo(0, document.getElementById("chat-body").scrollHeight,  {behavior: "smooth"})

        })
        document.getElementById("sendMessageInput").value = ""
    }

    useEffect(() => {
        socket.on('refetch', (data) => {
            console.log("refetch", data)
            if (data !== currentSession.chatID) return
            fetch("http://localhost:3000/get-messages", {
                method: "POST", headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({chatID: currentSession.chatID})
            }).then(res => res.json()).then(res => {
                dispatch(setMessage(res))

                //scgroll with smooth
                document.getElementById("chat-body").scrollTo(0, document.getElementById("chat-body").scrollHeight, {behavior: "smooth"})
            })
        })

        //scroll to bottom of chat-body smoothly
        document.getElementById("chat-body").scrollTo(0, document.getElementById("chat-body").scrollHeight)

        return () => {
            socket.off("refetch")
        }
    }, [currentSession, dispatch, socket])


    return (<div className={"chat-container h-100"}>
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

            <div id={"chat-body"} className={"chat-body p-5"}>
                {currentSession.messages.length > 0 ? currentSession.messages.map((message, index) => {
                    return <TextComponent key={index}
                                          sender={message.user_id.toString() === userInfo.id.toString() ? "me" : message.sender}
                                          align={message.user_id.toString() === userInfo.id.toString() ? "end" : "start"}
                                          text={message.message}
                                          date={message.created_at}
                    />
                }) : <div className={"d-flex justify-content-center w-100"}>
                    <h1>Start messaging</h1>
                </div>}
            </div>
            <div className={"chat-footer shadow-top-sm p-3 d-flex flex-row align-items-center"}>
                <div className={"w-100 "}>
                    <input id={"sendMessageInput"} onKeyPress={
                        (e) => {
                            if (e.key === "Enter") {
                                handleSendMessage(currentSession)
                                document.getElementById("chat-body").scrollTo(0, document.getElementById("chat-body").scrollHeight,  {behavior: "smooth"})
                            }
                        }
                    } type={"text"} className={"form-control"}
                           placeholder={"Type a message"}/>
                </div>
                <div className={"send-btn"}>
                    <button id={"sendMessageBtn"} className={"btn btn-primary"} onClick={
                        () => {
                            handleSendMessage(currentSession)
                            document.getElementById("chat-body").scrollTo(0, document.getElementById("chat-body").scrollHeight,  {behavior: "smooth"})
                        }
                    }>
                        <i className={"fas fa-paper-plane"}></i>
                    </button>
                </div>
            </div>
        </div>
    </div>)


}

