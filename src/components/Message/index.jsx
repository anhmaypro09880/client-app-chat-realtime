import React, { useEffect } from "react";
import { Avatar, Typography } from "antd";
import { formatRelative } from "date-fns/esm";
import "./style.css";

function formatDate(seconds) {
    let formattedDate = "";

    if (seconds) {
        formattedDate = formatRelative(new Date(seconds * 1000), new Date());

        formattedDate =
            formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }

    return formattedDate;
}

export default function Message({
    text,
    displayName,
    createdAt,
    photoURL,
    mesUid,
    messages,
    image,
    fromSelf,
}) {
    const user = {
        uid: "123",
    };

    // const { myInfo } = useSelector((state) => state.auth);
    // console.log(fromSelf);

    const handlePreviewImage = (e) => {
        const image = URL.createObjectURL();
    };
    return (
        <div className="message">
            <div className={`${user.uid === mesUid ? "m-msg" : "msg"}`}>
                {fromSelf === false ? (
                    <Avatar className="avatar" size="large" src={photoURL}>
                        {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                ) : (
                    <></>
                )}

                <div className="content">
                    {/* <Typography.Text className="message-author">
                        {displayName}
                    </Typography.Text> */}

                    {/* <Typography.Text className="message-text"> */}
                    {text === "" ? (
                        <div>
                            {/* <img src="blob:http://localhost:3000/3b86edce-11c4-4807-880c-9d9f5454684c"></img> */}
                            <img className="imgmess" src={image} alt="image" />
                            {/* <p>{image}</p> */}
                        </div>
                    ) : (
                        <h3>{text}</h3>
                    )}
                    {/* </Typography.Text> */}

                    <Typography.Text className="message-date">
                        {createdAt}
                    </Typography.Text>
                </div>
            </div>
        </div>
    );
}
