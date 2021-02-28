import React, { useState } from "react";
import { Button, Input, Form, Message } from "semantic-ui-react";
import { createUser } from "../api";
import { validate } from 'react-email-validator'

const Register = ({ setOpen }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [badEmail, setBadEmail] = useState(false)
  const [badUsername, setBadUsername] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [missingValue, setMissingValue] = useState(false)


  const register = async () => {
    if (!credentials.email || !credentials.username || !credentials.password) {
      setMissingValue(true)
    } else

      if (validate(credentials.email)) {
        console.log("hey good email!")




        event.preventDefault();
        await createUser(
          credentials.username,
          credentials.email,
          "user",
          credentials.password
        )



          .then((response) => {

            if (response.name === "Bad Username") {
              console.log("bad username")
              setBadUsername(true)
              localStorage.removeItem("token")
              localStorage.setItem("user", JSON.stringify({ "role": "user" }))
            }
            else if (response.name === "Bad Email") {
              console.log("bad email")
              setBadEmail(true)
              localStorage.removeItem("token")
              localStorage.setItem("user", JSON.stringify({ "role": "user" }))
            }
            else {
              console.log("here we go")
              console.log(response);
              localStorage.setItem("token", response.token);
              localStorage.setItem("user", JSON.stringify(response.user));

              setOpen(false);
              window.location.reload(false);
            }
          })
          .catch((error) => {
            localStorage.removeItem("token")
            localStorage.setItem("user", { "role": "user" })
            console.log(error);

          })
      } else {
        console.log("email is bad")
        setOpen(true)
        setInvalidEmail(true)
      }

  }



  const handleChanges = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value })
      ;
    setInvalidEmail(false)
    setBadEmail(false)
    setBadUsername(false)

  };

  return (
    <>
      <Form className="register">
        <h2>Register</h2>

        <Input
          style={{ width: "50%", marginTop: "25px" }}
          name="email"
          value={credentials.email}
          onChange={handleChanges}
          placeholder="email"

        />


        <br></br>

        <Input

          style={{ width: "50%" }}
          name="username"
          value={credentials.username}
          onChange={handleChanges}
          placeholder="username"
        />

        <br></br>

        <Input
          style={{ width: "50%", marginBottom: "10px" }}
          autoComplete="new-password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChanges}
          placeholder="password"
        />
        <br></br>

        <Button
          style={{ width: "50%" }}
          content="Submit"
          onClick={register}
        ></Button>


        {badEmail ? (
          <Message negative size="mini" style={{ marginTop: "6px" }}>

            <p>This email already exists. Please use another email.</p>
          </Message>
        ) : (
            ""
          )}
        {invalidEmail ? (
          <Message negative size="mini" style={{ marginTop: "6px" }}>

            <p>Please use a valid email address.</p>
          </Message>
        ) : (
            ""
          )}
        {badUsername ? (
          <Message negative size="mini" style={{ marginTop: "6px" }}>

            <p>This username already exists. Please create another username.</p>
          </Message>
        ) : (
            ""
          )}
        {missingValue ? (
          <Message negative size="mini" style={{ marginTop: "6px" }}>

            <p>All fields are required to register.</p>
          </Message>
        ) : (
            ""
          )}


      </Form>
    </>
  );
};

export default Register;
