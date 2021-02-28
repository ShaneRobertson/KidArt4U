import React, { useState } from "react";
import { Button, Modal } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

function OrderSuccess({ total, charge }) {
  const history = useHistory();
  const home = () => {
    console.log("fired");
    history.push("/");
  };
  return (
    <div className="success-modal-size">
      <Modal size="small" className="success-modal" open={true}>
        <Modal.Header>
          Thank You For Your Order! Your total charges were $
          {charge && charge.amount / 100}.
        </Modal.Header>
        <Modal.Content>
          <Modal.Description /*className="signInModal"*/>
            <Button color="green" onClick={home}>
              Continue Shopping
            </Button>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default OrderSuccess;
