// code to build and initialize DB
const {
  client,
  getUsers,
  getUserById,
  getUserByUsername,
  getProducts,
  getProductById,
  createProduct,
  createUser,
  getCart,
  createCart,
  addToCart,
  checkout,
  getOrder,
  // other db methods
} = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables");
    client.query(`
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users CASCADE;
      `);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error while dropping tables!");
    throw error;
  }
}

async function buildTables() {
  try {
    client.connect();

    // drop tables in correct order
    await dropTables();

    // build tables in correct order
    console.log("Starting to build tables");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar (255) NOT NULL UNIQUE,
        email varchar (255) NOT NULL UNIQUE,
        role TEXT NOT NULL,
        password varchar (255) NOT NULL
      );
  
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name varchar (255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        "photoUrl" TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL NOT NULL,
        department TEXT NOT NULL,
       "inStock" BOOLEAN, 
        count INTEGER NOT NULL
      );

        CREATE TABLE cart (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "productId" INTEGER[],
        status TEXT NOT NULL
      );

      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "cartId" INTEGER REFERENCES cart(id)
      );
      `);
    console.log("finished building tables");
  } catch (error) {
    throw error;
  }
}

async function createInitialUsers() {
  try {
    // create customers
    console.log("trying to create customers");
    const userOne = await createUser({
      username: "TestUser1",
      email: "testuser1@gmail.com",
      role: "user",
      password: "password123",
    });

    const userTwo = await createUser({
      username: "TestUser2",
      email: "testuser2@gmail.com",
      role: "user",
      password: "password456",
    });

    const userThree = await createUser({
      username: "TestUser3",
      email: "testuser3@gmail.com",
      role: "user",
      password: "password789",
    });

    const userFour = await createUser({
      username: "Admin",
      email: "admin@gmail.com",
      role: "admin",
      password: "admin",
    });

    console.log("Success creating users!");

    return [userOne, userTwo, userThree, userFour];
  } catch (error) {
    console.error("error while creating users");
    throw error;
  }
}

async function createInitialCarts() {
  try {
    // create customers
    console.log("trying to create carts");
    const cartOne = await createCart({
      userId: 1,
      productId: [1, 4, 5],
    });

    const cartTwo = await createCart({
      userId: 2,
      productId: [1, 3, 5],
    });

    const cartThree = await createCart({
      userId: 3,
      productId: [2, 4, 7],
    });

    const cartFour = await createCart({
      userId: 4,
      productId: [1, 4, 7],
    });

    console.log("Success creating carts!");

    return [cartOne, cartTwo, cartThree, cartFour];
  } catch (error) {
    console.error("error while creating carts");
    throw error;
  }
}

async function createInitialProducts() {
  try {
    console.log("Trying to create products...");

    const productOne = await createProduct({
      name: "My Family Reunion",
      description: "A festive family celebration.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3dk9OfK0v6-okyh4bkcVdxmDQROgAH7jYIQi74leC90kuhG6DQSkbfsDkk4bH7yZNhwbsBZIXQjf0bHfQyhTR6tC6fpk4ZNKMJ4-3a4PI6GVa_7dL62jIF6NXVahpXBSa0hwn-MWnU_AdMJLawTvKaH=w1344-h915-no?authuser=0",
      quantity: 5,
      price: 200,
      department: "Magic Markers",
      inStock: true,
      count: 1,
    });

    const productTwo = await createProduct({
      name: "The Gathering",
      description: "Happiness - when everyone comes together.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3fx7CbyF1XasVCcZN-r1EFGu5yBWc_5-L2gLwOmgBh9nM-MUbE7qVFBg8bleBpMtjxOezGmakXAzxbqtKsotGnU2p_YjAiGL4zVWItgcn9TDzk-rt4Qeap5ixTSdprPf25VFK-asYPbUZK_2bm3LzaagQ=w626-h830-no?authuser=0",
      quantity: 19,
      price: 250,
      department: "Oil and Canvas",
      inStock: true,
      count: 1,
    });

    const productThree = await createProduct({
      name: "Big Bird Replica",
      description: "Impressionist view of Sesame Street's beloved character.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3ejpuDcmS2FlVWiTnO7iKu0vg3zmWqB9_73FMqdIRC0R-NTZg6yYUbZlDeRMk6D1DkwbOOnr9BUiheJrG34ZoLuF5Zyp_2S68b78xkW0rBqY9eee5ILyGOuhTDU-Lwtm-l9B-LA0qlkJ1JueSyUap8z=w483-h837-no?authuser=0",
      quantity: 7,
      price: 300,
      department: "Sculptures",
      inStock: true,
      count: 1,
    });

    const productFour = await createProduct({
      name: "Smooth Sailing",
      description: "Living and sailing on a majestic clear sky day.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3eZejd574vc7Ioci3q5fio21i3zwM04JQE4SySU5vwJ5p_Dz-vhY8FlYque5HZ_gahwg88F5jnO-kFNny2lvJlI6KWnBGeyrHDzFB_cFnExQkXy_1KaUPCuGg01iP7fPr2U9H59UnrXFAqiOrHh7-Pn=w720-h915-no?authuser=0",
      quantity: 12,
      price: 500,
      department: "Crayons",
      inStock: true,
      count: 1,
    });

    const productFive = await createProduct({
      name: "Puffy-eyed Stick Figure",
      description:
        "Celebration of colors displayed in a plethora of materials.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3em3sE1ecrn1kazZ6eLyqWRxYG6DWg_clEg2BD2lTQMHCgDQkx3P48BkbdD5uJEVqEbDEBnVtnbQ2y47k6d8_RMUHZwmrmq3pKVhzD60dcsy3ew4C0iWWrGMuKmimiSaldQWM74uqfAGUQmJ-nm_Evc=w851-h923-no?authuser=0",
      quantity: 10,
      price: 75,
      department: "Sculptures",
      inStock: true,
      count: 1,
    });

    const productSix = await createProduct({
      name: "Wildlife and Nature",
      description: "Amazing wildlife in a gorgeous scenery.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3cT4mRzuSplz8BPwQAH-1UdYoduS-iYiYkwJG3PESLESnXo51fKaVNG7wqmRMqjRoIyo9bKpDQv_lO9Ckki88m3SLDGzR-QDb7lyklQLbGKyzEDfm2tv0xfh0Zb9K3U0pd8xoZMXB7WtKHrcfB3kMI4=w732-h923-no?authuser=0",
      quantity: 8,
      price: 140,
      department: "Construction Paper",
      inStock: true,
      count: 1,
    });

    const productSeven = await createProduct({
      name: "The Loving Chef",
      description:
        "A dedicated cooking professional embracing the environment.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3fbRHcrNV_QJ5sOaVwS9gO5OlUATDydn8nmzhrbTe6LZEAhqd3T2-T0FoIZGaANodBIQSIgfWCtjLsd58lAXiIXQgTqw4Jpl7DGqt6ZHFupmVs5yJDsqfoJxVmA069TY3CSGD_63Dc5IpwADIstDC8PdQ=w687-h915-no?authuser=0",
      quantity: 2,
      price: 100,
      department: "Construction Paper",
      inStock: true,
      count: 1,
    });

    const productEight = await createProduct({
      name: "The Scroll of Life",
      description: "Portable fine art paper embellished with colored strings.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3cPtbz5ZwOZUyvhTlxh9LGsSojtv75LdDmihOq4bB2892Aftlad91lENNoixr09HEU3GowWPl1FAx_Rmx_WVXojEyfY00eJ3qXKtrWpUbXjT3DhF0ZLkVXS660rCa-Ew5hYixkdvz7r8v9CjfmjbjL9dQ=w693-h923-no?authuser=0",
      quantity: 1,
      price: 225,
      department: "Fine Art Paper",
      inStock: true,
      count: 1,
    });

    const productNine = await createProduct({
      name: "Life Struggles & Successes",
      description: "Electric and colorful display of life lessons.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3drNolRSjehPT00C-s9eJnEvezFcYjCt50Zq6bW7NYqJatlGPTW_yxwVAeoSR26L9csZq6ROcWMWbDT5UVwHfX7NP1nGiZeVqmZIamsMvf0g5F-wCARy4s183R5Tqi0U0SZ5HpXZMQ6ZyRu8Wmb_Drq1Q=w687-h915-no?authuser=0",
      quantity: 6,
      price: 125,
      department: "Construction Paper",
      inStock: true,
      count: 1,
    });

    const productTen = await createProduct({
      name: "Cat Girl",
      description: "Cat looking aqua make-up illustration.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3fZg-GIW8MMbhvqWmEuE6rcRdEzYkXgYFILvtqeGsrh8LDPWWAF6F9gbg14J0_d0Z0PVYaZoyMKDiINPKEF1zE8xc4lmM3wzD7b7PXvibFYOM4mvtZBWOA9voJ55CaIN0P9fVAtnV6fcTKC86OK44HP=w640-h426-no?authuser=0",
      quantity: 4,
      price: 425,
      department: "Portrait",
      inStock: true,
      count: 1,
    });

    const productEleven = await createProduct({
      name: "Classroom Children",
      description:
        "Psychedelic drawing of children enjoying the learning process.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3eIcK8pN4gmaZZBoIRImKn5BewoiAl9WNAiode2VykmzhoOVP_w9RdsAB_AtjcK6iLvpnnPoQbTrWs7NqVVmKZxYlLQQfBUGAGl8QGO7C7pauuIaIdpOrpQ0f35miKHI4gsVPEl5AnI4p014t6mTzDD=w640-h467-no?authuser=0",
      quantity: 9,
      price: 150,
      department: "Fine Markers",
      inStock: true,
      count: 1,
    });

    const productTwelve = await createProduct({
      name: "Speak Your Mind",
      description:
        "Watercolor (black & white) painting of child expressing himself.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3cqY0MCIIGOjaMS0Meo08PGbnEsYOjVM8gHDpgZ2UAwd8bHVzENbcRfbyOOIbuS0ec5eXvuk4-MsGLbRGpxtIePXTUuk33157PNoReS_YaVnkZ_RLlL5PG_ImhhpCtlnlKBKJQhLbDWDJJ7JNrTweq4=w640-h426-no?authuser=0",
      quantity: 0,
      price: 325,
      department: "Painting",
      inStock: true,
      count: 1,
    });

    const productThirteen = await createProduct({
      name: "Steering The Ship",
      description: "Matte painting of boy on boat on a serene night.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3dsoi-pt7HRhKuZC7CkItsxf4Ip8E1QULl0CB6ZLm3LVIfnpEgeBiwy-gV0clsoIU0KWkFhOQRCrAqh10bYAIQI83Tcw9RQvMvnECAq6IU96m_G1Bxl2MXB8UIbXdFvN3S9M2ZYvGGaEEQWmbdlq_fI=w640-h360-no?authuser=0",
      quantity: 0,
      price: 175,
      department: "Painting",
      inStock: true,
      count: 1,
    });

    const productFourteen = await createProduct({
      name: "Princess, Roses & Sparkles",
      description: "Anonymous painting of a noble princess.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3eZ7wa1UB2nSfEX-lxs7dedInOqXkRF188NvKppKC_AgFHnYg25TAVHwhKh0vpLOZZZabvIVcApwahCvjDtNZsMbCPe1khWWy6-nbSO4RRrMZBKk-bTFcaGXHTeZ8MRWevnSWW39e04PAnO3unLs6LokA=w1104-h915-no?authuser=0",
      quantity: 11,
      price: 135,
      department: "Oil and Canvas",
      inStock: true,
      count: 1,
    });

    const productFifteen = await createProduct({
      name: "Madam Butterfly",
      description: "Fantasy girl perusing the colorful garden.",
      photoUrl:
        "https://lh3.googleusercontent.com/pw/ACtC-3dXB_V2cV1ojYiq89_QoW7ncA_S8sDlxCtaQPmCKBx1M1_gTOpmiD3q9F6X1nb1J3WdmQuIV5fGyv-_Pl7Uuz07nonkQWt1xx5p7LBV4VMTVLSGxz23P3rzquAMhkqb8JUmvGVuUAJL4Qe6f1NxfBai=w640-h452-no?authuser=0",
      quantity: 8,
      price: 255,
      department: "Oil and Canvas",
      inStock: true,
      count: 1,
    });

    console.log("Success creating products!");

    return [
      productOne,
      productTwo,
      productThree,
      productFour,
      productFive,
      productSix,
      productSeven,
      productEight,
      productNine,
      productTen,
      productEleven,
      productTwelve,
      productThirteen,
      productFourteen,
      productFifteen,
    ];
  } catch (error) {
    console.log("Failure creating products!");
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data
    console.log("filling DB with initial data");

    await createInitialUsers();
    await createInitialProducts();
    await createInitialCarts();

    /* These lines should always work */
    console.log("Getting all users:\n", await getUsers());
    const user1 = await getUserById(1);
    const user2 = await getUserByUsername("TestUser2");
    const product1 = await getProductById(1);

    //await addToCart({ userId: 1, productId: [2] });
    //await checkout({ userId: 1, cartId: 1 });
    const orders = await getOrder(1);
    const cart1 = await getCart({ userId: 2 });

    console.log("Getting user 1 and 2:\n", user1, user2);
    console.log("Getting product 1:\n", product1);

    console.log("Getting cart 1:\n", cart1);
    console.log("Getting order 1:\n", orders);
    console.log("Getting all products:\n", await getProducts());

    console.log("filled database and need to do testing");

    console.log("finished filling database");
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
