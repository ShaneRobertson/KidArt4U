// create endpoints/routes
// require Express
// create new instance of Router
const apiRouter = require("express").Router();

const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPEKEY);
console.log("env", process.env.STRIPEKEY);

// Google token confirmation
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.REACT_APP_CLIENTID);

const {
  getUsers,
  createUser,
  getUserByUsername,
  getProducts,
  //getUserById,
  promoteUser,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteUser,
  deleteOrdersAndCart,
  updateUser,
  getCart,
  createCart,
  addToCart,
  checkout,
  getOrder,
  getOrders,
  removeFromCart,
  addCount,
  subtractCount,
} = require("../db");

// verify headers in token
// middleware for token verification
// move on to next() function
function verifyToken(req, res, next) {
  //get Auth header
  const bearerHeader = req.headers["authorization"];
  console.log("bearerheader", bearerHeader);
  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    console.log("bearer", bearer);
    // get token on index 1 from array
    const bearerToken = bearer[1];
    console.log("bearertoken", bearerToken);
    // adding token to req object - set token
    req.token = bearerToken;
    next();
    // send forbidden error status code
  } else {
    res.sendStatus(403);
  }
}

// GET
// home route "/"
// using postman - when hitting route /api you get the message below.
apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
});

// takes in verify token middleware
// authData = user object
// ADMIN only
apiRouter.get("/users", verifyToken, async (req, res, next) => {
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else if (authData.user.role === "admin") {
        const allUsers = await getUsers();
        console.log("all the users: ", allUsers);
        console.log("authdata", authData);
        res.send({
          allUsers,
        });
      } else {
        res.send({ message: "User does not have admin privileges!" });
      }
    });
  } catch (error) {
    next(error);
  }
});

// no need to verify token
// show products to all users
apiRouter.get("/products", async (req, res, next) => {
  try {
    const allProducts = await getProducts();
    // console.log("all products", allProducts);
    res.send({
      allProducts,
    });
  } catch (error) {
    next(error);
  }
});

// retrieve product by Id
apiRouter.get("/products/:productId", async (req, res, next) => {
  const { productId } = req.params;
  console.log("productId", productId);
  try {
    const product = await getProductById(productId);
    console.log("product", product);
    res.send({
      product,
    });
  } catch (error) {
    next(error);
  }
});

// verify token - user is logged in
apiRouter.get("/cart", verifyToken, async (req, res, next) => {
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        console.log("auth data above", authData);
        const cart = await getCart({ userId: authData.user.id });
        console.log("auth data", authData);
        res.send({ cart });
      }
    });
  } catch (error) {
    next(error);
  }
});

// get order > user
apiRouter.get("/orders", verifyToken, async (req, res, next) => {
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        const order = await getOrder(authData.user.id);
        console.log("auth data", authData);
        res.send({ order });
      }
    });
  } catch (error) {
    next(error);
  }
});

// get all Orders > admin
apiRouter.get("/orders/admin", verifyToken, async (req, res, next) => {
  try {
    console.log("am i in the /orders route?");
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else if (authData.user.role === "admin") {
        const allOrders = await getOrders();
        console.log("all orders: ", allOrders);
        console.log("authdata", authData);
        res.send({
          allOrders,
        });
      } else {
        res.send({ message: "User does not have admin privileges!" });
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST
// send username and password
// gets user by username
// check if user exists
// check if db user password and user passwords match
apiRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    console.log("password", password);

    if (user) {
      if (user.password === password) {
        console.log("logged in", user);
        // encrypts user object, needs encrypting method
        // callback to handle error or send token in json
        jwt.sign({ user }, "secretkey", { expiresIn: "1day" }, (err, token) => {
          if (err) {
            console.log("jwt error", err);
            res.send({ error: err, status: 403 });
          } else {
            res.json({ user, token });
          }
        });
      } else {
        res.send({ message: "Username or password do not match." });
      }
    } else {
      res.send({ message: "User not found!" });
    }
  } catch (error) {
    next(error);
  }
});

// creates/registers user and adds to db
// required fields
// anybody can register as admin???
apiRouter.post("/register", async (req, res, next) => {
  // required fields from table
  const { username, email, role, password } = req.body;
  try {
    console.log("hello");
    const user = await createUser({ username, email, role, password });
    if (user) {
      console.log("created user", user);
      // encrypt user
      jwt.sign(
        { user },
        "secretkey",
        { expiresIn: "1day" },
        async (err, token) => {
          if (err) {
            console.log("jwt error", err);
            res.sendStatus(403);
          } else {
            res.json({ user, token });
            await createCart({ userId: user.id, productId: [] });
          }
        }
      );
    } else {
      res.send({ message: "Error creating user." });
    }
  } catch (error) {
    console.log("error in routes file:", error);
    // next(error);
    if (error.includes("users_email_key")) {
      next({
        name: "Bad Email",
        message: "Please supply another email",
      });
    } else if (error.includes("users_username_key")) {
      next({
        name: "Bad Username",
        message: "Please supply another username",
      });
    }
  }
});

/////////////// OAUTH //////////////////

apiRouter.post("/google-login", async (req, res, next) => {
  // grab token from body
  const { token } = req.body;
  console.log("token", token);
  try {
    // checks token and client id
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_CLIENTID,
    });
    console.log("ticket1", ticket);
    // grab fields from token object
    const { name, email } = ticket.getPayload();
    console.log("ticket payload", ticket.getPayload());
    const role = "user";
    const password = "password";
    // grab the user by username
    const user = await getUserByUsername(name);
    // check if user already exists
    if (user) {
      console.log("google name", name, user);
      // encrypt user with json webtoken
      jwt.sign(
        { user },
        "secretkey",
        { expiresIn: "1day" },
        async (err, token) => {
          if (err) {
            console.log("jwt error", err);
            res.sendStatus(403);
          } else {
            res.json({ user, token });
          }
        }
      );
    } else {
      // if user doesn't exist, create user
      const user = await createUser({
        username: name,
        email,
        role,
        password,
      });
      console.log("google name", name);
      // encrypt user
      jwt.sign(
        { user },
        "secretkey",
        { expiresIn: "1day" },
        async (err, token) => {
          if (err) {
            console.log("jwt error", err);
            res.sendStatus(403);
          } else {
            res.json({ user, token });
            await createCart({ userId: user.id, productId: [] });
          }
        }
      );
    }
  } catch (error) {
    console.log("error in routes file:", error);
    // next(error);
    if (error.includes("users_email_key")) {
      next({
        name: "Bad Email",
        message: "Please supply another email",
      });
    } else if (error.includes("users_username_key")) {
      next({
        name: "Bad Username",
        message: "Please supply another username",
      });
    }
  }
});

// creates product and adds to db
// ADMIN only
apiRouter.post("/products", verifyToken, async (req, res, next) => {
  // required fields from table
  const {
    name,
    description,
    photoUrl,
    department,
    price,
    count,
    quantity,
  } = req.body;
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else if (authData.user.role === "admin") {
        const product = await createProduct({
          name,
          description,
          photoUrl,
          department,
          price,
          count,
          quantity,
        });
        res.send(product);
      } else {
        res.send({ message: "User is not an admin!" });
      }
    });
  } catch (error) {
    next(error);
  }
});

// creates order and cart row
apiRouter.post("/checkout", async (req, res, next) => {
  // required fields from table
  const { userId, cartId } = req.body;
  try {
    // from index.js db
    const order = await checkout({
      userId,
      cartId,
    });
    if (order) {
      console.log("created order", order);
      res.json({ order });
    }
    await createCart({ userId, productId: [] });
  } catch (error) {
    next(error);
  }
});

apiRouter.post("/stripe", async (req, res, next) => {
  // required fields from table
  const { token, total } = req.body;
  try {
    console.log("total", parseFloat(total), Math.ceil(parseFloat(total)) * 100);
    const charge = await stripe.charges.create({
      amount: parseFloat(total) * 100,
      currency: "USD",
      source: token.id,
      description: "payment for Kid Art 4 U",
      metadata: {
        productId: token.id,
      },
    });
    res.json({ message: "payment was succesful", charge });
  } catch (error) {
    next(error);
  }
});

// DELETE users
// ADMIN only
apiRouter.delete("/users/:userId", verifyToken, async (req, res, next) => {
  const { userId } = req.params;
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else if (authData.user.role === "admin") {
        console.log("authData.user.id", typeof authData.user.id, typeof userId);
        if (authData.user.id == userId) {
          res.send({ message: "User is logged in and can't be deleted!" });
        } else {
          const deletedUser = await deleteUser(userId);
          console.log("authdata1", authData);
          res.send({
            deletedUser,
          });
        }
      } else {
        res.send({ message: "User is not an admin!" });
      }
    });
  } catch (error) {
    next(error);
  }
});

// delete product
// ADMIN only
apiRouter.delete(
  "/products/:productId",
  verifyToken,
  async (req, res, next) => {
    const { productId } = req.params;
    try {
      jwt.verify(req.token, "secretkey", async (err, authData) => {
        if (err) {
          res.send({ error: err, status: 403 });
        } else if (authData.user.role === "admin") {
          const deletedProduct = await deleteProduct(productId);
          res.send(deletedProduct);
        } else {
          res.send({ message: "User is not an admin!" });
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH
apiRouter.patch("/users/:userId/role", async (req, res, next) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const updatedUserList = await promoteUser(userId, role);
    res.send(updatedUserList);
  } catch (error) {
    next(error);
  }
});

// update user
// update role status > admin???
apiRouter.patch(
  "/users/:userId/update",
  verifyToken,
  async (req, res, next) => {
    const { username, email, password } = req.body;
    const { userId } = req.params;
    const fieldsObject = {};
    if (username) {
      fieldsObject.username = username;
    }
    if (email) {
      fieldsObject.email = email;
    }
    if (password) {
      fieldsObject.password = password;
    }
    console.log("patch params", req.params.userId);
    try {
      console.log("patch params", req.params.userId);
      const user = await updateUser(fieldsObject, userId);
      jwt.verify(req.token, "secretkey", async (err, authData) => {
        if (err) {
          res.send({ error: err, status: 403 });
        } else if (authData.user.id == userId) {
          console.log("updated user", user);
          res.send({ user });
        } else {
          res.send({ message: "User can't update other users!" });
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// update product
// ADMIN only
/* apiRouter.patch(
  "/products/:productId/update",
  verifyToken,
  async (req, res, next) => {
    const {
      name,
      description,
      photoUrl,
      quantity,
      price,
      department,
      inStock,
    } = req.body;
    const { productId } = req.params;
    console.log("patch params", req.params.productId);
    try {
      console.log("patch params", req.params.productId);
      const product = await updateProduct({
        name,
        description,
        photoUrl,
        quantity,
        price,
        department,
        inStock,
        productId,
      });
      jwt.verify(req.token, "secretkey", async (err, authData) => {
        if (err) {
          res.send({ error: err, status: 403 });
        } else if (authData.user.role === "admin") {
          console.log("updated product", product);
          res.send({ product });
        } else {
          res.send({ message: "User does not have admin privileges!" });
        }
      });
    } catch (error) {
      next(error);
    }
  }
); */

apiRouter.patch("/products/:productId/update", async (req, res, next) => {
  const updateFields = {};
  const { name, description, photoUrl, price, department } = req.body;

  if (name) {
    updateFields.name = name;
  }
  if (description) {
    updateFields.description = description;
  }
  if (photoUrl) {
    updateFields.photoUrl = photoUrl;
  }
  if (price) {
    updateFields.price = price;
  }
  if (department) {
    updateFields.department = department;
  }

  const { productId } = req.params;
  console.log("in the routes updateFields: ", updateFields);
  try {
    const product = await updateProduct(productId, updateFields);
    res.send(product);
  } catch (error) {
    next(error);
  }
});

// updates cart
apiRouter.patch("/cart", verifyToken, async (req, res, next) => {
  const { userId, productId } = req.body;
  console.log("user id and product id", userId, productId);
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        const updatedCart = await addToCart({ userId, productId });
        console.log("updated cart", updatedCart);
        res.send({ updatedCart });
      }
    });
  } catch (error) {
    next(error);
  }
});

// remove from cart
// still working on this one... db index
apiRouter.patch("/cart/remove", verifyToken, async (req, res, next) => {
  const { userId, productId } = req.body;
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        const updatedCart = await removeFromCart({ userId, productId });
        console.log("updated cart", updatedCart);
        res.send({ updatedCart });
      }
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.patch("/count", verifyToken, async (req, res, next) => {
  const { id } = req.body;
  console.log("product id", id);
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        const updatedCount = await addCount(id);
        console.log("updated cart", updatedCount);
        res.send({ updatedCount });
      }
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.patch("/count/subtract", verifyToken, async (req, res, next) => {
  const { id } = req.body;
  console.log("product id", id);
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        const updatedCount = await subtractCount(id);
        console.log("updated cart", updatedCount);
        res.send({ updatedCount });
      }
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.get("/orders/:userId", verifyToken, async (req, res, next) => {
  const { userId } = req.params;
  console.log("the userid in the routes: ", userId);
  try {
    jwt.verify(req.token, "secretkey", async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        const orders = await deleteOrdersAndCart(userId);
        console.log("deleted orders", orders);
        res.send(orders);
      }
    });
  } catch (error) {
    next(error);
  }
});

//export router
module.exports = apiRouter;
