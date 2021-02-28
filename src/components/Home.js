import React from "react";
import DisplayAllProducts from "./DisplayAllProducts";

const Home = ({
  products,
  isAdmin,
  setProducts,
  filteredList,
  setFilteredList,
}) => {
  return (
    <>
      {filteredList.length ? (
        <DisplayAllProducts
          products={filteredList}
          isAdmin={isAdmin}
          setProducts={setProducts}
          setFilteredList={setFilteredList}
        />
      ) : (
        <DisplayAllProducts
          products={products}
          isAdmin={isAdmin}
          setProducts={setProducts}
          setFilteredList={setFilteredList}
        />
      )}
    </>
  );
};
export default Home;
