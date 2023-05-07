import {ContactsComponent} from './ContactsComponent/ContactsComponent'
import {MessagesComponent} from './MessagesComponent/MessagesComponent'
import {useSelector} from "react-redux";

export function ChatComponent(){
    const messages = useSelector(state => state.currentSession.messages)

    return(
        <div className={"d-flex flex-row w-100 vh-100"}>
            <ContactsComponent/>
            <MessagesComponent messages={messages}/>
        </div>
    )
}