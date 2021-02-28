import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Menu } from "semantic-ui-react";
import { createProduct } from "../api";

export default function AddProductModal({ setProducts, filteredList, products, setFilteredList }) {

  const [open, setOpen] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true)
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    photoUrl: "",
    department: "",
    price: "",
  })
  //count: 1,

  useEffect(() => {
    setDisableSubmit((productDetails.name && productDetails.description && productDetails.photoUrl && productDetails.department && productDetails.price) ? false : true)
}, [productDetails.name, productDetails.description, productDetails.photoUrl, productDetails.department, productDetails.price])
//productDetails.count > 0
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => {
        setOpen(true);
      }}
      open={open}
      trigger={<Menu.Item>Add new Product</Menu.Item>}
      size="tiny"
    >
      <Modal.Header>Add a new Product!</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p style={{ margin: 0 }}>Name: </p>
          <Input
            fluid
            autoComplete="off"
            style={{ 
            marginBottom: "1rem" ,
            borderRadius: '.35rem', 
            border: productDetails.name ? '2px solid #3ef737' : '2px solid #f73737'
            }}
            name="name"
            value={productDetails.name}
            onChange={(event) => {
              setProductDetails({
                ...productDetails,
                [event.target.name]: event.target.value,
              });
            }}
            placeholder="Add the name of the product..."
          />
          <p style={{ margin: 0 }}>Description: </p>
          <Input
            fluid
            autoComplete="off"
           
            style={{ 
              marginBottom: "1rem" ,
              borderRadius: '.35rem', 
              border: productDetails.description ? '2px solid #3ef737' : '2px solid #f73737'
              }}
            name="description"
            type="textarea"
            value={productDetails.description}
            onChange={(event) => {
              setProductDetails({
                ...productDetails,
                [event.target.name]: event.target.value,
              });
            }}
            placeholder="Add the product description..."
          />
          <p style={{ margin: 0 }}>Photo Link: </p>
          <Input
            fluid
            autoComplete="off"
            style={{ 
              marginBottom: "1rem" ,
              borderRadius: '.35rem', 
              border: productDetails.photoUrl ? '2px solid #3ef737' : '2px solid #f73737'
              }}
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
            style={{ 
              marginBottom: "1rem" ,
              borderRadius: '.35rem', 
              border: productDetails.price ? '2px solid #3ef737' : '2px solid #f73737'
              }}
            type='number'
            name="price"
            value={productDetails.price}
            onChange={(event) => {
              setProductDetails({
                ...productDetails,
                [event.target.name]: event.target.value,
              });
            }}
            placeholder="Add the product price..."
          />
          <p style={{ margin: 0 }}>Department: </p>
          <Input
            fluid
            autoComplete="off"
            style={{ 
              marginBottom: "1rem" ,
              borderRadius: '.35rem', 
              border: productDetails.department ? '2px solid #3ef737' : '2px solid #f73737'
              }}
            name="department"
            value={productDetails.department}
            onChange={(event) => {
              setProductDetails({
                ...productDetails,
                [event.target.name]: event.target.value,
              });
            }}
            placeholder="Which department does this belong in?"
          />
          {/* <p style={{ margin: 0 }}>Count: </p>
          <Input
            fluid
            autoComplete="off"
            type="number"
            style={{ marginBottom: "1rem" }}
            name="count"
            value={productDetails.count}
            onChange={(event) => {
              setProductDetails({
                ...productDetails,
                [event.target.name]: Number(event.target.value),
              });
              console.log(typeof productDetails.count);
            }}
            placeholder="Count of the item?"
          /> */}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" icon="cancel" onClick={() => setOpen(false)} />

        <Button
          icon="checkmark"
          disabled={disableSubmit}
          style={{backgroundColor: disableSubmit ? '#f73737' : '#3ef737'}}
          onClick={async () => {
            const newProduct = await createProduct(
              productDetails.name,
              productDetails.description,
              productDetails.photoUrl,
              productDetails.department,
              productDetails.price,
              
            );
            console.log('the new product : ', newProduct)
            /* productDetails.count */
            if(newProduct) {
              let productsCopy = [...products]
              productsCopy.unshift(newProduct) 
              if(filteredList.length > 0) {
                let filteredCopy = [...filteredList]
                filteredCopy.unshift(newProduct)
                setFilteredList(filteredCopy)
              }            
              setProducts(productsCopy)              
                setProductDetails({
                name: "",
                description: "",
                photoUrl: "",
                department: "",
                price: "",
                
              })
              //count: 1
              setOpen(false)
            } else {
              setProductDetails({
                name: "",
                description: "",
                photoUrl: "",
                department: "",
                price: "",
            
              })
              //count: 1
              setOpen(false)
            }
    
        }}
       /*      newProducts.sort((a, b) => a.id - b.id);
            setProducts(newProducts);
            setProductDetails({
              name: "",
              description: "",
              photoUrl: "",
              department: "",
              price: "",
              count: 1,
            });
            setOpen(false);
          }} */
        />
      </Modal.Actions>
    </Modal>
  );
}
