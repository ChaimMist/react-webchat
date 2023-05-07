import "./TextComponent.css"

export function TextComponent(props) {
    let color = props.sender === "me" ? "me" : "sender"

    return (
        <div className={"text-component w-100 mb-4 d-flex flex-row justify-content-" + props.align}>

            <div
                className={"text-component-box p-4 d-flex flex-column justify-content-start rounded-4  shadow-sm bg-" + color}>
                <div className={"profileIconWrapper d-flex  flex-row justify-content-between text-center text-align-center"}>
                    <div className={"d-flex flex-row mb-2"}>
                        <img className={"userIcon"} width='32px' src={'https://chedvata.com/assets/profile.svg'}
                             alt={"Failed to load icon"}/>
                        <div className={"text-dark my-auto ms-2"}>{props.sender}</div>
                    </div>
                    <div className={"fw-light text-secondary"}>{new Date(props.date).toLocaleString()}</div>

                </div>
                {props.text}
            </div>
        </div>
    )
}