import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { getCart } from "../api";


export default function DisplayAllProducts({ products, role, isAdmin, setProducts, setFilteredList }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getCart()
      .then((response) => {
        setCart(response.cart.products);
      })
      .catch((error) => {
        setCart(error.message);
      });
  }, []);

  return (
    <div className="productSection">
      <ProductCard products={products} role={role} cart={cart} isAdmin={isAdmin} setProducts={setProducts} setFilteredList={setFilteredList} />
    </div>
  );
}
