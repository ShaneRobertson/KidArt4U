import React, { useState } from "react";
import { Menu, Button } from "semantic-ui-react";
import SignIn from "./SignIn";
import FilterProducts from "./FilterProducts";
import { Link, useHistory } from "react-router-dom";
import AddProductModal from "./AddProductModal";

const Nav = ({
  isAdmin,
  setProducts,
  products,
  filteredList,
  setFilteredList,
}) => {
  const history = useHistory();
  const [activeItem, setActiveItem] = useState("home");

  //++++++++++++++

  /* let categoryList;
  {
    filteredList.length
      ? (categoryList = filteredList.map((product) => product.department))
      : (categoryList = products.map((product) => product.department));
  } */

  let categoryList = products.map((product) => product.department);
  let departmentList = Array.from(new Set(categoryList));
  //++++++++++++++

  const handleSignOut = async () => {
    await localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify({ role: "user" }));
    history.push("/");
    window.location.reload(false);
  };

  return (
    <Menu secondary /*className="headerNav"*/>
      <Menu.Item
        as={Link}
        to="/"
        name="home"
        active={activeItem === "home"}
        onClick={() => {
          setActiveItem("home");
        }}
      />
      {isAdmin ? (
        <>
          <Menu.Item
            as={Link}
            to="/users"
            name="Display Users"
            active={activeItem === "Display Users"}
            onClick={() => {
              setActiveItem("Display Users");
            }}
          />
          <Menu.Item>
            <AddProductModal
              setProducts={setProducts}
              products={products}
              setFilteredList={setFilteredList}
              filteredList={filteredList}
            />
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/user/orders"
            name="all orders"
            value={"orders"}
            active={activeItem === "orders"}
            onClick={() => {
              setActiveItem("orders");
            }}
          />
        </>
      ) : (
        ""
      )}
      {localStorage.getItem("token") ? (
        <>
          <Menu.Item
            as={Link}
            to="/userinfo"
            name="my account"
            active={activeItem === "my account"}
            onClick={() => {
              setActiveItem("my account");
            }}
          />
          <Menu.Item onClick={handleSignOut} name="sign out" />
        </>
      ) : (
        <>
          <Menu.Item>
            <SignIn />
          </Menu.Item>
        </>
      )}

      {isAdmin ? (
        ""
      ) : (
        <Menu.Item
          as={Link}
          to="/cart"
          name="cart"
          active={activeItem === "cart"}
          onClick={() => {
            setActiveItem("cart");
          }}
        />
      )}
      {activeItem === "home" ? (
        <FilterProducts
          products={products}
          list={departmentList}
          setFilteredList={setFilteredList}
        />
      ) : (
        ""
      )}
    </Menu>
  );
};

export default Nav;
