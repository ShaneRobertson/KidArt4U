import React from "react";
import VisitorCard from "./VisitorCard";

export default function DisplayVisitorCart({ products }) {
  return (
    <div className="cart-section">
      <VisitorCard products={products} />
    </div>
  );
}
