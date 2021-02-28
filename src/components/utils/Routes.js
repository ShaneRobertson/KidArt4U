// import all components here
import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import Home from "../Home";
import DisplayAllUsers from "../DisplayAllUsers";
import Cart from "../Cart";
import VisitorCart from "../VisitorCart";
import UserPage from "../UserPage";
import PageHeader from "../PageHeader";
import PageFooter from "../PageFooter";

import { getProducts, getUsers, getOrders } from "../../api";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import UserOrder from "../UserOrder";

const Routes = () => {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  // const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("user")))
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const StripePromise = loadStripe(process.env.REACT_APP_STRIPEKEY);

  useEffect(() => {
    getProducts()
      .then((response) => {
        console.log("products are: ", response);
        setProducts(response.allProducts);
      })
      .catch((error) => {
        setProducts(error.message);
      });
    getUsers()
      .then((response) => {
        setUsers(response.allUsers);
      })
      .catch((error) => {
        setUsers(error.message);
      });
    getOrders()
      .then((response) => {
        setAdminOrders(response.allOrders);
      })
      .catch((error) => {
        setAdminOrders(error.message);
      });
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", JSON.stringify([]));
    }
    // if user exists then check for id
    // if admin role set state to admin
    if (
      JSON.parse(localStorage.getItem("user")) &&
      JSON.parse(localStorage.getItem("user")).id
    ) {
      JSON.parse(localStorage.getItem("user")).role === "admin"
        ? setIsAdmin(true)
        : setIsAdmin(false);
    }
  }, []);

  // console.log("adminOrders in Routes: ", adminOrders)

  return (
    <>
      <PageHeader
        isAdmin={isAdmin}
        filteredList={filteredList}
        setFilteredList={setFilteredList}
        products={products}
        setProducts={setProducts}
      />
      <Route exact path="/" className="app">
        <Home
          products={products}
          isAdmin={isAdmin}
          setProducts={setProducts}
          filteredList={filteredList}
          setFilteredList={setFilteredList}
        />
      </Route>
      {localStorage.getItem("token") ? (
        <Route path="/cart">
          <Elements stripe={StripePromise}>
            <Cart />
          </Elements>
        </Route>
      ) : (
        <Route path="/cart">
          <Elements stripe={StripePromise}>
            <VisitorCart />
          </Elements>
        </Route>
      )}
      <Route path="/user/orders">
        <UserOrder adminOrders={adminOrders} />
      </Route>{" "}
      <Route path="/users">
        <DisplayAllUsers
          users={users}
          setUsers={setUsers}
          products={products}
          isAdmin={isAdmin}
          setProducts={setProducts}
        />
      </Route>
      <Route path="/userinfo">
        <UserPage
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          isAdmin={isAdmin}
        />
      </Route>
      <PageFooter />
    </>
  );
};

export default Routes;
