import React, { useState } from "react";
import { Button, Input, Modal} from "semantic-ui-react";
import { updateProduct } from "../api";

export default function EditProductModal({ id, name, setProducts, setFilteredList, products }) {
  const [open, setOpen] = useState(false);

  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    photoUrl: "",
    price: "",
    department: ""
  });

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => {
        setOpen(true);
      }}
      open={open}
      trigger={<Button icon="edit" color="orange" />}
      size="tiny"
    >
      <Modal.Header>{name}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p style={{ margin: 0 }}>Name: </p>
          <Input
            fluid
            autoComplete="off"
            style={{ marginBottom: "1rem" }}
            name="name"
            value={productDetails.name}
            onChange={(event) => {
              setProductDetails({
                ...productDetails,
                [event.target.name]: event.target.value,
              });
            }}
            placeholder="Edit the product title..."
          />
          <p style={{ margin: 0 }}>Description: </p>
          <Input
            fluid
            autoComplete="off"
            style={{ marginBottom: "1rem" }}
            name="description"
            value={productDetails.description}
            onChange={(event) => {
              setProductDetails({
                ...productDetails,
                [event.target.name]: event.target.value,
              });
            }}
            placeholder="Edit the product description..."
          />
          <p style={{ margin: 0 }}>Photo Link: </p>
          <Input
            fluid
            autoComplete="off"
            style={{ marginBottom: "1rem" }}
            name="photoUrl"
            type="textarea"
            value={productDetails.photoUrl}
            onChange={(event) => {
              setProductDetails({
                ...productDetails,
                [event.target.name]: event.target.value,
              });
            }}
            placeholder="Add a link to the Photo..."
          />
          <p style={{ margin: 0 }}>Price: </p>
          <Input
            fluid
            autoComplete="off"
            style={{ marginBottom: "1rem" }}
            name="price"
            type="number"
            value={productDetails.price}
            onChange={(event) => {
              setProductDetails({
                ...productDetails,
                [event.target.name]: event.target.value,
              });
            }}
            placeholder="Edit the product price..."
          />
           <p style={{ margin: 0 }}>Department: </p>
          <Input
            fluid
            autoComplete="off"
            style={{ marginBottom: "1rem" }}
            name="department"
            type="text"
            value={productDetails.department}
            onChange={(event) => {
              setProductDetails({
                ...productDetails,
                [event.target.name]: event.target.value,
              });
            }}
            placeholder="Edit the product department..."
          />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" icon="cancel" onClick={() => setOpen(false)} />

        <Button
          icon="checkmark"
          onClick={async () => {
            const newProduct = await updateProduct(
              productDetails.name,
              productDetails.description,
              productDetails.photoUrl,
              productDetails.price,
              productDetails.department,
              id
            );
            if (newProduct) {
                let productsCopy = [...products]
                productsCopy.forEach((product) => {
                  if(newProduct.id === product.id){
                    productsCopy.splice(productsCopy.indexOf(product), 1, newProduct)
                    return 
                  }
                })
              setFilteredList(productsCopy)
              setProducts(productsCopy)
              setProductDetails({
                name: "",
                description: "",
                photoUrl: "",
                price: "",
                department: ""
              });
              setOpen(false);
            } else {
              setOpen(false);
            }
          }}
        />
      </Modal.Actions>
    </Modal>
  );
}
