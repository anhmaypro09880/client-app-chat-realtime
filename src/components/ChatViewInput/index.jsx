import { Button, Form, Input } from "antd";
import React, { useState, useEffect } from "react";
import Picker from "emoji-picker-react";
import styled from "styled-components";
import { DiDatabase } from "react-icons/di";
import axios from "axios";

import {
    LinkOutlined,
    PictureOutlined,
    SmileOutlined,
} from "@ant-design/icons";
// import Picker from "emoji-picker-react";
import "./style.css";
import { imageMessageSend } from "../../utils/APIRoutes";

export default function ChatViewInput({
    handleSendMsg,
    currentUser,
    currentChat,
    socket,
    messages,
    setMessages,
}) {
    const [msg, setMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [image, setImage] = React.useState(null);

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };
    const handleEmojiClick = (event, emojiObject) => {
        let message = msg;
        message += emojiObject.emoji;
        setMsg(message);
    };
    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("");
        }
    };
    const room = {
        displayName: "Enter your message",
    };
    const [form] = Form.useForm();

    //Handle Send Image
    const imageSend = async (e) => {
        e.preventDefault();
        if (e.target.files.length !== 0) {
            const imageName = e.target.files[0].name;
            const newImageName = Date.now() + imageName;
            const file = URL.createObjectURL(e.target.files[0]);

            const data = await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            );
            const formData = new FormData();
            formData.append("images", e.target.files[0]);
            formData.append("senderName", data._id);
            formData.append("imageName", newImageName);
            formData.append("reseverId", currentChat._id);
            formData.append("file", file);

            const msgs = [...messages];

            msgs.push({ fromSelf: true, message: "", image: file });

            setMessages(msgs);

            const response = await axios.post(imageMessageSend, formData);

            console.log(response.data.data);
            // setMessages(msgs);

            socket.current.emit("send-msg", {
                to: currentChat._id,
                from: data._id,
                message: "",
                image: response.data.data,
            });
        }
    };

    return (
        <div className="chat-view-input">
            <Form onSubmitCapture={sendChat} form={form}>
                <Form.Item name="message">
                    <Input
                        size="large"
                        autoSize
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        placeholder={room.displayName}
                        bordered={false}
                        autoComplete="off"
                    />
                    <span></span>
                </Form.Item>

                <div className="chat-view-input-btn">
                    {showEmojiPicker && (
                        <Picker onEmojiClick={handleEmojiClick} />
                    )}
                    <Button
                        className="btn-input"
                        icon={<LinkOutlined />}
                        type="text"
                        size="large"
                    ></Button>
                    <div className="file hover-image">
                        <input
                            onChange={imageSend}
                            type="file"
                            id="pic"
                            className="hide"
                        />
                        <label htmlFor="pic">
                            <DiDatabase />
                        </label>
                    </div>
                    {/* <Button
                        className="btn-input"
                        icon={<PictureOutlined />}
                        type="text"
                        size="large"
                        // onClick={}
                    ></Button> */}
                    <Button
                        className="emoji btn-input"
                        icon={<SmileOutlined />}
                        onClick={handleEmojiPickerhideShow}
                        type="text"
                        size="large"
                    ></Button>

                    <Button className="btn-submit" type="primary">
                        Gửi
                    </Button>
                </div>
            </Form>
        </div>
    );
}
