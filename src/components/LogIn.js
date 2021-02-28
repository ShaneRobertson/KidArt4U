import React, { useState } from "react";
import { Button, Input, Form, Message } from "semantic-ui-react";
import { loginUser, sendGoogleData } from "../api";
// Google button
import GoogleLogin from "react-google-login";

const LogIn = ({ setOpen }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(false);

  const login = async () => {
    event.preventDefault();
    await loginUser(credentials.username, credentials.password)
      .then((response) => {
        console.log("the error from logging in : ", response);
        if (response.message) {
          console.log(response);

          setLoginError(true);
        } else {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          console.log("userObject upon login:", response);
          setOpen(false);
          window.location.reload(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChanges = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
    setLoginError(false);
  };

  // sends token that we get from login success
  // googleData is obj with token in it
  const handleLogin = async (googleData) => {
    console.log("google data", googleData);
    await sendGoogleData(googleData)
      .then((res) => {
        console.log("response", res);
        localStorage.setItem("token", res.token);

        //add info to my account fields...
        //
        if (res.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
        } else {
          localStorage.setItem("user", JSON.stringify(res.user));
        }
      })
      .catch((error) => {
        console.log(error);
      });

    window.location.reload(false);
  };

  return (
    <>
      <Form className="logIn">
        <h2>Log in</h2>
        <GoogleLogin
          style={{ marginBottom: "15px" }}
          clientId={process.env.REACT_APP_CLIENTID}
          buttonText="with Google"
          onSuccess={handleLogin}
          onFailure={handleLogin}
          cookiePolicy={"single_host_origin"}
        />
        <br></br>
        <div>or</div>
        <Input
          style={{ width: "50%", marginTop: "15px" }}
          name="username"
          value={credentials.username}
          onChange={handleChanges}
          placeholder="username"
        />
        <br></br>
        <Input
          style={{ width: "50%" }}
          autoComplete="current-password"
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
          onClick={login}
        ></Button>
        {loginError ? (
          <Message negative size="mini" style={{ marginTop: "6px" }}>
            <p>
              Login failed due to incorrect username or password. Please try
              again.
            </p>
          </Message>
        ) : (
          ""
        )}
      </Form>
    </>
  );
};

export default LogIn;
