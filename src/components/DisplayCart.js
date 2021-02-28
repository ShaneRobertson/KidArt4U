import React from "react";
import CartCard from "./CartCard";

export default function DisplayCart({ products }) {
  return (
    <div className="cart-section">
      <CartCard products={products} />
    </div>
  );
}
