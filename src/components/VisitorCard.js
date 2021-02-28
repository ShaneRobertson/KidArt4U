import React, { useState } from "react";
import { Card, Icon, Button } from "semantic-ui-react";
//import theGathering from "../theGathering.jpg";

//returns product card
export default function VisitorCard({ products }) {
  const uniqueArr = [...new Set(products.map(JSON.stringify))].map(JSON.parse);

  console.log("products", products, uniqueArr);
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
          quantity,
          count,
        } = product;

        console.log("count", count);
        const [showText, setShowText] = useState(true);
        let truncatedDesc = showText ? description.slice(0, 50) : description;

        const removeProduct = (productId) => {
          const index = products.findIndex(
            (product) => product.id === productId
          );
          console.log("index", index, products, productId);
          const newProducts = [];
          if (index !== -1) {
            products.splice(index, 1);
          }
          for (let i = 0; i < product.length; i++) {
            newProducts.push(oldProducts[i]);
          }
          console.log("cart card new", products);
          localStorage.setItem("cart", JSON.stringify(products));
          window.location.reload(false);
        };

        function increment(id) {
          //console.log("id", id);
          const product = uniqueArr.find((product) => {
            //console.log("product.id", product.id);
            return product.id === id;
          });
          product.count++;
          console.log("increment", product);
          const remove = uniqueArr.filter((product) => {
            return product.id !== id;
          });
          const newCart = [product, ...remove];
          console.log("new cart", newCart);
          localStorage.setItem("cart", JSON.stringify(newCart));
          window.location.reload(false);
          // console.log("uniqueArr", product);
        }

        function decrement(id) {
          //console.log("id", id);
          const product = uniqueArr.find((product) => {
            //console.log("product.id", product.id);
            return product.id === id;
          });
          product.count--;
          console.log("decrement", product);
          const remove = uniqueArr.filter((product) => {
            return product.id !== id;
          });
          const newCart = [product, ...remove];
          console.log("new cart", newCart);
          localStorage.setItem("cart", JSON.stringify(newCart));
          window.location.reload(false);
          // console.log("uniqueArr", product);
        }

        return (
          <Card className="cart-card" style={{ width: "45rem" }} key={id}>
            <div className="flex">
              <div className="cart-card-image-container">
                <img src={photoUrl} className="cart-card-image" />
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
                    <Icon name="dollar" className="visitor-card-dollar" />
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
                  <span>{count}</span>{" "}
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
