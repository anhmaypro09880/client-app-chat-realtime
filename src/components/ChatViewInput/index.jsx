import { Button, Form, Input } from "antd";
import React, { useState, useEffect } from "react";
import Picker from "emoji-picker-react";
import styled from "styled-components";
import { DiDatabase } from "react-icons/di";
import axios from "axios";
import { videoTagString, VideoTag } from "react-video-tag";

import {
    LinkOutlined,
    PictureOutlined,
    SmileOutlined,
} from "@ant-design/icons";
// import Picker from "emoji-picker-react";
import "./style.css";
import { imageMessageSend, fileMessageSend } from "../../utils/APIRoutes";

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
            let fileArray = e.target.files;
            const formData = new FormData();

            const imagesArray = [];
            for (let i = 0; i < fileArray.length; i++) {
                imagesArray.push(fileArray[i]);
                formData.append("images", fileArray[i]);
            }

            const imageName = e.target.files[0].name;
            const newImageName = Date.now() + imageName;
            const file = URL.createObjectURL(e.target.files[0]);

            const data = await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            );

            formData.append("senderName", data._id);
            formData.append("imageName", newImageName);
            formData.append("reseverId", currentChat._id);
            formData.append("file", file);

            const response = await axios.post(imageMessageSend, formData);

            socket.current.emit("send-msg", {
                to: currentChat._id,
                from: data._id,
                message: "",
                image: response.data.data,
                files: "",
            });

            const msgs = [...messages];

            msgs.push({
                fromSelf: true,
                message: "",
                image: response.data.data,
                files: "",
            });

            setMessages(msgs);
        }
    };

    const fileSend = async (e) => {
        e.preventDefault();
        if (e.target.files.length !== 0) {
            let fileArray = e.target.files;
            const formData = new FormData();
            const imagesArray = [];
            for (let i = 0; i < fileArray.length; i++) {
                imagesArray.push(fileArray[i]);
                formData.append("images", fileArray[i]);
            }

            const imageName = e.target.files[0].name;
            const newImageName = Date.now() + imageName;
            const file = URL.createObjectURL(e.target.files[0]);

            const data = await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            );

            formData.append("senderName", data._id);
            formData.append("imageName", newImageName);
            formData.append("reseverId", currentChat._id);
            formData.append("file", file);

            const response = await axios.post(fileMessageSend, formData);

            const msgs = [...messages];

            msgs.push({
                fromSelf: true,
                message: "",
                image: "",
                files: response.data.data,
            });

            setMessages(msgs);

            socket.current.emit("send-msg", {
                to: currentChat._id,
                from: data._id,
                message: "",
                image: "",
                files: response.data.data,
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

                    {/* <video
                        src="https://appchat-picture-profile.s3.us-west-1.amazonaws.com/Our+complete+Apple+iPhone+XS+Max+review_1.mp4"
                        width="600"
                        height="300"
                        controls="controls"
                        autoplay="true"
                    /> */}

                    <input
                        accept=".mp4,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        multiple="multiple"
                        onChange={fileSend}
                        type="file"
                        id="picFile"
                        className="hide"
                    ></input>
                    <label htmlFor="picFile" className="btn-input">
                        <LinkOutlined />
                    </label>

                    <div className="file hover-image">
                        <input
                            accept="image/x-png,image/gif,image/jpeg"
                            multiple="multiple"
                            onChange={imageSend}
                            type="file"
                            id="pic"
                        ></input>

                        <label htmlFor="pic">
                            <PictureOutlined />
                        </label>
                    </div>

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
