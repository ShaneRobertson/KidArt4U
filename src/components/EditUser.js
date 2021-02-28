import React, { useState } from "react";
import { Button, Input, Form, Label } from "semantic-ui-react";
import { updateUser } from "../api";
import { validate } from "react-email-validator";

const EditUser = ({ userInfo, setUserInfo }) => {
  const { id, username, email } = userInfo;

  const [newUsername, setNewusername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState(false);

  const newUserInfo = {
    username: newUsername,
    email: newEmail,
    password: newPassword,
  };

  const handleUserUpdate = async () => {
    if (validate(newEmail)) {
      console.log("email is good");
      setEmailErrorMsg(false);
      await updateUser(newUsername, newEmail, newPassword, id)
        .then((response) => {
          localStorage.setItem("user", JSON.stringify(response.user));

          setUserInfo(JSON.parse(localStorage.getItem("user")));
        })
        .catch((error) => {
          console.log("error in update user workflow:", error);
        });
      setNewPassword("");
    } else {
      console.log("email is bad");
      setEmailErrorMsg(true);
    }
  };

  console.log("New user object:", newUserInfo);

  return (
    <>
      <h2>Edit User Info</h2>
      <Form className="myUserInfo">
        <Input
          style={{ marginBottom: "7px", width: "250px" }}
          name="username"
          value={newUsername}
          onChange={(event) => {
            setNewusername(event.target.value);
          }}
          placeholder={newUsername}
        ></Input>
        <Input
          style={{ marginBottom: "7px", width: "250px" }}
          type="email"
          name="email"
          value={newEmail}
          onChange={(event) => {
            setNewEmail(event.target.value);
          }}
          placeholder={newEmail}
        ></Input>
        {emailErrorMsg ? (
          <Label basic color="red" pointing style={{ marginBottom: "7px" }}>
            Please enter a valid email address
          </Label>
        ) : (
          ""
        )}
        <Input
          style={{ marginBottom: "7px", width: "250px" }}
          name="new password"
          type="password"
          value={newPassword}
          onChange={(event) => {
            setNewPassword(event.target.value);
          }}
          placeholder="new password"
        ></Input>
      </Form>
      <Button onClick={handleUserUpdate}>Submit</Button>
    </>
  );
};

export default EditUser;
