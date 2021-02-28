import React from "react";
import { Table } from "semantic-ui-react";

const UserOrder = ({ adminOrders }) => {
  const totalArr = [];

  return (
    <>
      {JSON.parse(localStorage.getItem("user")).role === "admin" ? (
        <div style={{ paddingBottom: "19rem" }}>
          <Table celled >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order Number</Table.HeaderCell>
                <Table.HeaderCell>Cart Number</Table.HeaderCell>
                <Table.HeaderCell>User Id</Table.HeaderCell>
                <Table.HeaderCell>Cart</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {adminOrders.cartArr.map((cart) => {
                console.log("map cart", cart);
                return (
                  <Table.Row>
                    <Table.Cell>{cart.rows.id}</Table.Cell>
                    <Table.Cell>{cart.rows.cartId}</Table.Cell>
                    <Table.Cell>{cart.rows.userId}</Table.Cell>
                    <Table.Cell>
                      {cart.cart.products.map((product) => {
                        totalArr.push(parseFloat(product.price));
                        console.log("product", product);
                        return (
                          <div>
                            {product.name} - ${product.price} x {product.count}
                          </div>
                        );
                      })}
                    </Table.Cell>
                    <Table.Cell>${cart.total}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      ) : (
          ""
        )}

    </>
  );
};

export default UserOrder;
