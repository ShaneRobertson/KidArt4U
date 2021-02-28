import React, { useState } from "react";
import { Card, Icon, Button } from "semantic-ui-react";
//import theGathering from "../theGathering.jpg";
import { removeFromCart, addCount, subtractCount } from "../api";

//returns product card
export default function CartCard({ products }) {
  const uniqueArr = [...new Set(products.map(JSON.stringify))].map(JSON.parse);

  console.log("products", products, uniqueArr);

  function increment(id) {
    addCount(id);
    window.location.reload(false);
  }

  function decrement(id) {
    subtractCount(id);
    window.location.reload(false);
  }

  return (
    <>
      {uniqueArr.map((product) => {
        let {
          id,
          department,
          inStock,
          description,
          name,
          photoUrl,
          price,
          count,
          quantity,
        } = product;

        const [showText, setShowText] = useState(true);
        let truncatedDesc = showText ? description.slice(0, 50) : description;

        const removeProduct = (productId) => {
          removeFromCart(
            JSON.parse(localStorage.getItem("user")).id,
            productId
          ).then((response) => {
            console.log(response);
          });
          window.location.reload(false);
        };

        return (
          <Card className="cart-card" style={{ width: "45rem" }} key={id}>
            <div className="flex">
              <div className="cart-card-image-container">
                <img
                  src={photoUrl}
                  className="cart-card-image" /*className="scale-down"
                  style={{ height: "20rem" }}*/
                />
              </div>
              <div className="cart-card-right">
                <Card.Content>
                  <Card.Header className="cart-header">{name}</Card.Header>
                  <div></div>
                  <Card.Meta className="cart-card-department">
                    <span>{department}</span>
                  </Card.Meta>
                  <Card.Description className="cart-card-description">
                    {truncatedDesc.length < 50 ? (
                      truncatedDesc
                    ) : (
                      <span
                        onClick={() => {
                          setShowText(!showText);
                        }}
                      >
                        {truncatedDesc}
                        <span id="showText">
                          ...Show {showText ? "more" : "less"}
                        </span>
                      </span>
                    )}
                  </Card.Description>
                </Card.Content>
                <Card.Content className="cart-card-price">
                  <>
                    <Icon name="dollar" />
                    <span className="cart-card-amount">{price}</span>
                  </>
                </Card.Content>
                <Card.Content className="cart-card-buttons-trash">
                  <Button
                    basic
                    color="red"
                    className="cart-card-minus-button"
                    onClick={count > 1 ? () => decrement(id) : null}
                  >
                    &#8722;
                  </Button>
                  <span className="cart-card-count">{count}</span>{" "}
                  <Button
                    basic
                    color="green"
                    className="cart-card-plus-button"
                    onClick={() => increment(id)}
                  >
                    &#43;
                  </Button>
                  <Icon
                    className="trash icon"
                    onClick={() => removeProduct(id)}
                  />
                </Card.Content>
              </div>
            </div>
          </Card>
        );
      })}
    </>
  );
}
