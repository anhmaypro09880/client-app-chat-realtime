import React, { useEffect } from "react";
import { Avatar, Typography } from "antd";
import { formatRelative } from "date-fns/esm";
import "./style.css";
import fi from "date-fns/esm/locale/fi/index.js";

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
    files,
}) {
    const checkFileTypesByName = (array) => {
        for (var i = 0; i < array.length; i++) {
            var endPoint = array[i].split(".");
            var ext = endPoint[endPoint.length - 1];
            switch (ext.toLowerCase()) {
                case "mp4":
                case "video":
                    //etc
                    return true;
            }
        }
        return false;
    };
    // console.log(image);
    const checkGroupImage = (image) => {
        if (image.length >= 2) {
            image.map((m, i) => {
                console.log(m);
            });
            return true;
        }

        return false;
    };
    const user = {
        uid: "123",
    };

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
                    {text === "" ? (
                        <div>
                            {files === null || files === "" ? (
                                <div>
                                    {checkGroupImage(image) === false ? (
                                        <img
                                            className="imgmess"
                                            src={image}
                                            alt="image"
                                        />
                                    ) : (
                                        <div>
                                            {image.map((m) => (
                                                <img
                                                    className="imgmess"
                                                    src={m}
                                                    alt="image"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {checkFileTypesByName(files) === false ? (
                                        <a href="files">{files}</a>
                                    ) : (
                                        <video
                                            autoplay="false"
                                            muted="true"
                                            src={files}
                                            width="300"
                                            height="200"
                                            controls="controls"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <h3>{text}</h3>
                    )}
                    <Typography.Text className="message-date">
                        {createdAt}
                    </Typography.Text>
                </div>
            </div>
        </div>
    );
}
