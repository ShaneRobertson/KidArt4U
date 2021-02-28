import React, { useState, useEffect } from "react";
import { Card, Button } from "semantic-ui-react";
import { getCart, checkout, sendToken } from "../api";
import { useHistory } from "react-router-dom";
import CardDetails from "./CardDetails";
import { CardElement } from "@stripe/react-stripe-js";
import OrderSuccess from "./OrderSuccess";
import stripepng from "../stripe.png";

const OrderSummary = ({ stripe, elements }) => {
  const totalArr = [];
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState("");
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [charge, setCharge] = useState();

  const home = () => {
    console.log("fired");
    history.push("/");
  };

  useEffect(() => {
    getCart()
      .then((response) => {
        console.log("response", response);
        setCart(response.cart.products);
        setCartId(response.cart.id);
      })
      .catch((error) => {
        setCart(error.message);
      });
  }, []);
  console.log("cart id", cartId);

  // parsing string from local storage
  cart.map((product) => {
    for (let i = 0; i < product.count; i++) {
      totalArr.push(parseFloat(product.price));
    }
    console.log("product.count", product.count, product);
  });

  console.log("total arr", totalArr);
  const total = totalArr.reduce((a, b) => a + b, 0).toFixed(2);

  const Checkout = async (event) => {
    event.preventDefault(event);
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log(result.token);
      await sendToken(total, result.token).then((res) => {
        console.log("res", res);
        setCharge(res.charge);
      });
      console.log("cartId", cartId);
      checkout(JSON.parse(localStorage.getItem("user")).id, cartId);
      setOpen(true);
    }
  };
  console.log("modal", open);
  return (
    <>
      {open && <OrderSuccess charge={charge} />}
      <Card className="order-summary-card">
        <Card.Content className="order-summary-header-container">
          <p className="order-summary-header">Order Summary</p>{" "}
        </Card.Content>
        <Card.Content className="order-summary-content">
          <p className="order-summary-items-container">
            <span className="order-summary-total-items">Total Items:</span>{" "}
            &nbsp; {totalArr.length}
          </p>
          <p className="order-summary-total-container">
            <span className="order-summary-grand-total">Grand Total:</span>{" "}
            &nbsp;$
            {totalArr.reduce((a, b) => a + b, 0).toFixed(2)}
          </p>
        </Card.Content>
        <Card.Content className="order-summary-button-container">
          <p className="checkout-stripe">
            Checkout with <img src={stripepng} className="stripe-image" />
          </p>

          <div className="flex">
            <p className="card-number">Card number</p>
            <p className="expiration">Exp date & CVC</p>
          </div>
          <form onSubmit={Checkout} className="order-summary-form">
            <CardDetails className="card-details" />
            <Button color="red" className="order-summary-button">
              Checkout & Pay
            </Button>{" "}
          </form>
        </Card.Content>
      </Card>
      <div className="order-summary-shopping-button">
        <Button color="green" onClick={home}>
          Continue Shopping
        </Button>
      </div>
    </>
  );
};

export default OrderSummary;
