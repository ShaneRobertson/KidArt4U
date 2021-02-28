// Require the Client constructor from the pg package
const { Client } = require("pg");
require("dotenv").config();
const { KEY, USER } = process.env;

// name of database
const DB_NAME = "react-test-db";

// connection with heroku or postgres credentials
const DB_URL =
  process.env.DATABASE_URL ||
  `postgres://${USER}:${KEY}@localhost:5432/${DB_NAME}`;

// Create the client
const client = new Client(DB_URL);

// grab all users
async function getUsers() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM users
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

// creates users
async function createUser({ username, email, role, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, email, role, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [username, email, role, password]
    );

    return user;
  } catch (error) {
    console.log("error in DB: ", error.message);
    throw error.message;
  }
}

async function updateUser(fieldsObject, userId) {
  console.log("parameters", fieldsObject, userId);
  try {
    const retrievedUser = await getUserById(userId);
    console.log("retrieved user", retrievedUser);
    if (retrievedUser === null) {
      throw new Error("User with that id does not exist.");
    }
    const setString = Object.keys(fieldsObject)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");
    console.log("setString in DB", setString);
    const {
      rows: [user],
    } = await client.query(
      `
        UPDATE users
        SET ${setString}
        WHERE id = ${userId}
        RETURNING *
    `,
      Object.values(fieldsObject)
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function promoteUser(userId, role) {
  try {
    role === "user"
      ? await client.query(
          `
      UPDATE users
      SET role='admin'
      WHERE id=$1;
    `,
          [userId]
        )
      : await client.query(
          `
      UPDATE users
      SET role='user'
      WHERE id=$1;
    `,
          [userId]
        );

    const { rows } = await client.query(`
      SELECT * FROM users
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

// select single user
async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT * FROM users
      WHERE id=${userId}
    `);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * FROM users
      WHERE username=$1
    `,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

// same as get users
async function getProducts() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM products
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

// get all orders
// ADMIN only
async function getOrders() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM orders
    `);

    const cartArr = [];
    for (let i = 0; i < rows.length; i++) {
      console.log("user id", rows[i].userId);
      const cart = await getCompletedCart({ userId: rows[i].cartId });
      console.log("cart", cart, cart.length);
      const totalArr = [];

      if (cart !== []) {
        cart.products.map((product) => {
          totalArr.push(parseFloat(product.price * product.count));
        });

        const total = totalArr.reduce((a, b) => a + b, 0).toFixed(2);
        console.log("total", totalArr);
        cartArr.push({ rows: rows[i], cart, total });
      }
    }
    console.log("cart array get orders", cartArr);
    return { cartArr };
  } catch (error) {
    throw error;
  }
}

async function getProductById(productId) {
  try {
    const {
      rows: [product],
    } = await client.query(`
      SELECT * FROM products
      WHERE id = ${productId}    
      `);
    if (!product) {
      return null;
    }
    return product;
  } catch (error) {
    throw error;
  }
}

async function createProduct({
  name,
  description,
  photoUrl,
  department,
  price,
  inStock,
  quantity,
  count,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
      INSERT INTO products(name, description, "photoUrl", quantity, price, department, "inStock",  count)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `,
      [name, description, photoUrl, quantity, price, department, inStock, count]
    );

    return product;
  } catch (error) {
    throw error;
  }
}

async function updateProduct(productId, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  console.log("this is the setString: ", setString);
  // update products table
  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      const {
        rows: [product],
      } = await client.query(
        `
          UPDATE products
          SET ${setString}
          WHERE id=${productId}
          RETURNING *;
        `,
        Object.values(fields)
      );

      return product;
    }
  } catch (error) {
    throw error;
  }
}

// cart created, products added = processing and checkout = completed
// cart for specific user
// productId pushed into products array
async function createCart({ userId, productId, status = "created" }) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
      INSERT INTO cart("userId", "productId", status)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [userId, productId, status]
    );

    return cart;
  } catch (error) {
    throw error;
  }
}

// not grabbing completed carts only created and processing.
// grab user specific cart
async function getCart({ userId }) {
  console.log("userId", userId);
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM cart
      WHERE "userId" = $1 AND NOT status = 'completed'
    `,
      [userId]
    );
    console.log("rows", rows);
    const cart = [];
    for (let i = 0; i < rows.length; i++) {
      rows[i].status === "processing" ? cart.push(rows[i]) : null;
    }
    if (rows.length > 0) {
      if (cart.length > 0) {
        console.log("inside processing cart", cart);
        const products = cart[0].productId;
        const productArr = [];
        for (i = 0; i < products.length; i++) {
          console.log("product Id", products[i]);
          const {
            rows: [product],
          } = await client.query(`
            SELECT * FROM products
            WHERE id = ${products[i]}
          `);
          productArr.push(product);
        }
        console.log("list of products", productArr);
        return { id: cart[0].id, products: productArr, status: cart[0].status };
      }
      console.log("inside cart", rows);
      const products = rows[0].productId;
      const productArr = [];
      for (i = 0; i < products.length; i++) {
        console.log("product Id", products[i]);
        const {
          rows: [product],
        } = await client.query(`
            SELECT * FROM products
            WHERE id = ${products[i]}
          `);
        productArr.push(product);
      }
      console.log("list of products", productArr);
      return { id: rows[0].id, products: productArr, status: rows[0].status };
    } else {
      console.log("outside cart", rows);
      return [];
    }
  } catch (error) {
    throw error;
  }
}

// user adds item to cart > status = processing
// result is all completed orders
// helper function - no need to export
async function getCompletedCart({ userId }) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM cart
      WHERE id = $1 AND status = 'completed'
    `,
      [userId]
    );
    if (rows.length > 0) {
      console.log("inside cart", rows);
      const products = rows[0].productId;
      const productArr = [];
      for (i = 0; i < products.length; i++) {
        console.log("product Id", products[i]);
        const {
          rows: [product],
        } = await client.query(`
            SELECT * FROM products
            WHERE id = ${products[i]}
          `);
        productArr.push(product);
      }
      console.log("list of products", productArr);
      return { id: rows[0].id, products: productArr, status: rows[0].status };
    } else {
      console.log("outside cart", rows);
      return [];
    }
  } catch (error) {
    throw error;
  }
}

// list of orders for users
async function getOrder(userId) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM orders
      WHERE "userId" = $1
    `,
      [userId]
    );

    const cartArr = [];
    for (let i = 0; i < rows.length; i++) {
      console.log("user id", rows[i].userId);
      const cart = await getCompletedCart({ userId: rows[i].cartId });
      console.log("cart", cart, cart.length);
      const totalArr = [];

      if (cart !== []) {
        cart.products.map((product) => {
          totalArr.push(parseFloat(product.price * product.count));
        });
        const total = totalArr.reduce((a, b) => a + b, 0).toFixed(2);
        console.log("total", totalArr);
        cartArr.push({ rows: rows[i], cart, total });
      }
    }
    console.log("cart array get orders", cartArr);
    return { cartArr };
  } catch (error) {
    throw error;
  }
}

// add to cart function
// check if cart has products
async function addToCart({ userId, productId }) {
  // get cart for user
  const cart = await getCart({ userId });
  const cartId = cart.id;
  const oldProducts = cart.products;
  console.log("add to cart", cart);
  const newProducts = [];
  if (oldProducts.length > 0) {
    for (i = 0; i < oldProducts.length; i++) {
      newProducts.push(oldProducts[i].id);
    }
    console.log("productId", productId);
    newProducts.push(...productId);
  } else {
    newProducts.push(...productId);
  }
  console.log("new cart", newProducts);
  try {
    const {
      rows: [updatedCart],
    } = await client.query(
      `
      UPDATE cart
      SET "productId" = $1, status = $2
      WHERE "id" = $3
      RETURNING *;
    `,
      [newProducts, "processing", cartId]
    );
    console.log("updated cart", updatedCart);
    return updatedCart;
  } catch (error) {
    throw error;
  }
}

// still working on this bad boy...
async function removeFromCart({ userId, productId }) {
  console.log("userId, productId", userId, productId);
  const cart = await getCart({ userId });

  const oldProducts = cart.products;
  const idArr = [];
  try {
    if (oldProducts.length > 0) {
      const index = oldProducts.findIndex(
        (product) => product.id === productId
      );
      console.log("INDEX", index, oldProducts, productId);
      if (index !== -1) {
        oldProducts.splice(index, 1);
        console.log("ARRAY", oldProducts);
      }

      for (i = 0; i < oldProducts.length; i++) {
        idArr.push(oldProducts[i].id);
      }

      const {
        rows: [updatedCart],
      } = await client.query(
        `
        UPDATE cart 
        SET "productId" = $1, status = $2 
        WHERE "userId" = ${userId} 
        RETURNING *;
        `,
        [idArr, "processing"]
      );

      console.log("UPDATEDCART", updatedCart);

      return updatedCart;
    }
  } catch (error) {
    throw error;
  }
}

// who is checking out and which cart
async function checkout({ userId, cartId }) {
  console.log("checkout user cart id", userId, cartId);
  try {
    const {
      rows: [updatedCart],
    } = await client.query(
      `
      UPDATE cart
      SET status = $1
      WHERE "userId" = $2
    `,
      ["completed", userId]
    );
    const {
      rows: [order],
    } = await client.query(
      `
      INSERT INTO orders("userId", "cartId")
      VALUES ($1, $2)
      RETURNING *
    `,
      [userId, cartId]
    );

    console.log("created order", order);
    return order;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(userId) {
  console.log("userId", userId);
  try {
    const {
      rows: [order],
    } = await client.query(
      `
      DELETE FROM orders
      WHERE id = $1
      RETURNING *
    `,
      [userId]
    );

    const {
      rows: [cart],
    } = await client.query(
      `
      DELETE FROM cart
      WHERE id = $1
      RETURNING *
    `,
      [userId]
    );
    const {
      rows: [user],
    } = await client.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING *
    `,
      [userId]
    );

    console.log("user", user);
    return { order, cart, user };
  } catch (error) {
    throw error;
  }
}

async function deleteProduct(productId) {
  try {

    //===================
    const { rows: carts } = await client.query(`
    SELECT * FROM cart;
    `);
  carts.forEach( async (cart) => {
  let newArr = []
    for (let product of cart.productId) {
      if(productId != product){
        newArr.push(product)
      }
    }
    await client.query(`
    UPDATE cart
    SET "productId" = $1
    WHERE "userId" = $2;
  `, [newArr, cart.userId])
  });
//==========
    const {
      rows: [product],
    } = await client.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING *
    `,
      [productId]
    );
    console.log("product", product);



    return product;
  } catch (error) {
    throw error;
  }
}

async function addCount(id) {
  const product = await getProductById(id);
  console.log("product count", product);
  try {
    const { rows } = await client.query(
      `
    UPDATE products
    SET count = $1
    WHERE id = $2
    RETURNING *
    `,
      [product.count + 1, id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

async function subtractCount(id) {
  const product = await getProductById(id);
  console.log("product count", product);
  try {
    const { rows } = await client.query(
      `
    UPDATE products
    SET count = $1
    WHERE id = $2
    RETURNING *
    `,
      [product.count - 1, id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

async function deleteOrdersAndCart(userId) {
  try {
    await client.query(
      `
    DELETE FROM orders
    WHERE "userId"=$1;
    `,
      [userId]
    );

    const { rows } = await client.query(
      `
    DELETE FROM cart
    WHERE "userId"=$1
    RETURNING *;
    `,
      [userId]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

// export db functions
module.exports = {
  client,
  // db methods
  getUsers,
  createUser,
  getUserById,
  getUserByUsername,
  getProducts,
  createProduct,
  getProductById,
  updateUser,
  promoteUser,
  updateProduct,
  deleteUser,
  deleteProduct,
  deleteOrdersAndCart,
  getCart,
  createCart,
  addToCart,
  checkout,
  getOrder,
  getOrders,
  removeFromCart,
  addCount,
  subtractCount,
};
