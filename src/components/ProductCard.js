import React from "react";
import { Card, Icon, Button, Popup } from "semantic-ui-react";
import theGathering from "../theGathering.jpg";
import EditProductModal from "./EditProductModal";
import ConfirmDeleteProduct from "./ConfirmDeleteProduct";

//returns product card

import { addToCart } from "../api";

//returns product card
export default function ProductCard({
  products,
  isAdmin,
  setProducts,
  cart,
  setFilteredList,
}) {
  // add products to db cart
  const addToDbCart = (userId, productId) => {
    console.log("adding to db");

    addToCart(userId, [productId]);
    window.location.reload(false);
  };

  const addToLocalCart = (product) => {
    const oldProducts = JSON.parse(localStorage.getItem("cart"));

    const newProducts = [];
    if (oldProducts.length > 0) {
      for (let i = 0; i < oldProducts.length; i++) {
        newProducts.push(oldProducts[i]);
      }
      for (let i = 0; i < product.count; i++) {
        newProducts.push(product);
      }
    } else {
      for (let i = 0; i < product.count; i++) {
        newProducts.push(product);
      }
    }
    localStorage.setItem("cart", JSON.stringify(newProducts));

    window.location.reload(false);
  };

  return (
    <>
      {products ? (
        products.map((product) => {
          const {
            id,
            department,
            inStock,
            description,
            name,
            photoUrl,
            price,
            quantity,
          } = product;

          let httpsImage;
          if (photoUrl) {
            if (photoUrl.includes("https")) {
              httpsImage = photoUrl;
            } else {
              httpsImage = photoUrl.replace("http", "https");
            }
          }

          return (
            <Card
              raised
              style={{ width: "20rem" }}
              className="product-card-text"
              key={id}
            >
              <Popup
                inverted
                content={description}
                trigger={
                  <img
                    src={httpsImage}
                    className="scale-down"
                    style={{ height: "20rem" }}
                  />
                }
              />

              <Card.Content>
                <Card.Header className="header-product-card">
                  {name}
                </Card.Header>
                <Card.Meta>
                  <span>{department}</span>
                </Card.Meta>
                <Card.Description></Card.Description>
              </Card.Content>

              {isAdmin ? (
                <div className="admin-edit-delete">
                  {" "}
                  <EditProductModal
                    id={id}
                    name={name}
                    products={products}
                    setProducts={setProducts}
                    setFilteredList={setFilteredList}
                  />
                  <ConfirmDeleteProduct
                    id={id}
                    name={name}
                    products={products}
                    setProducts={setProducts}
                    setFilteredList={setFilteredList}
                  />{" "}
                </div>
              ) : (
                ""
              )}

              <Card.Content className="product-price-cart">
                <Icon name="dollar">{price}</Icon>

                {isAdmin ? (
                  ""
                ) : localStorage.getItem("token") ? (
                  <Button
                    onClick={() =>
                      addToDbCart(
                        JSON.parse(localStorage.getItem("user")).id,
                        id
                      )
                    }
                    // cart was undefined on google logged in user
                    disabled={
                      cart.filter((product) => {
                        return product.name == name;
                      }).length > 0
                    }
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <Button
                    onClick={() => addToLocalCart(product)}
                    disabled={
                      JSON.parse(localStorage.getItem("cart")).filter(
                        (product) => {
                          return product.name === name;
                        }
                      ).length > 0
                    }
                  >
                    Add to cart
                  </Button>
                )}
              </Card.Content>
            </Card>
          );
        })
      ) : (
        <h1>Loading</h1>
      )}
    </>
  );
}
