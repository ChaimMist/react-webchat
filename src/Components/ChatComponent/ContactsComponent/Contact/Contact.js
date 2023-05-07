import {useSelector, useDispatch} from "react-redux";
import {removeNotifications} from "../../../../reduxFeatures/hasMessage";
import {setCurrentSession} from "../../../../reduxFeatures/currentSession";
import './Contact.css'

export function Contact(props) {
    const notifications = useSelector(state => state.notificationHash[props.chat.id])
    const dispatch = useDispatch()

    return (
        <div className={" contact-box d-flex flex-row border  mt-1 shadow-sm p-2"} onClick={() => {
            dispatch(removeNotifications({0: "main", 1: notifications}))
            dispatch(removeNotifications({0: props.chat.id, 1: notifications}))
            fetch("http://localhost:3000/get-messages", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({chatID: props.chat.id})
            }).then(res => res.json()).then(res => {
                dispatch(setCurrentSession({
                        chatID: props.chat.id,
                        chatName: props.chat.name,
                        image: props.chat.image,
                        updated_at: props.chat.updated_at,
                        messages: res
                    })
                )
            })
        }}>
            <div className={"d-flex flex-row w-70px"}>
                <img src={"https://chedvata.com/assets/profile.svg"} width={'50'} alt={"img"}/>
                <div style={{right: "12px"}}
                     className={"mb-1 position-relative  rounded-circle bg-danger flex-column d-flex justify-content-center text-center text-white notification   " + (notifications > 0 ? "" : " d-none")}>
                    <div>{notifications}</div>
                </div>
            </div>
            <div className={"p-2 d-flex flex-column align-items-center"}>
                <p>{props.chat.name}</p>
                <div className={"text-secondary fw-light contact-subtext position-relative"}>{props.chat.phone}</div>
            </div>
        </div>
    );
}