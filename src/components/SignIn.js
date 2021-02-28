import React, { useState } from "react";
import { Modal, Divider, Menu, Grid } from "semantic-ui-react";
import LogIn from "./LogIn";
import Register from "./Register";

function SignIn() {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      className="signInModal"
      size="large"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Menu.Item>Sign In</Menu.Item>}
    >
      <Modal.Header>Please sign in or register</Modal.Header>
      <div>
        <Grid columns={2}>
          <Grid.Column>
            <LogIn setOpen={setOpen} />
          </Grid.Column>

          <Grid.Column>
            <Register setOpen={setOpen} />
          </Grid.Column>
        </Grid>
        <Divider vertical style={{ marginTop: "25px", height: "135px" }}>
          Or
        </Divider>
      </div>
    </Modal>
  );
}

export default SignIn;
