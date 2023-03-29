import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import "./Products.css";
import { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
//  */
//  let product={
//   "name":"Tan Leatherette Weekender Duffle",
//   "category":"Fashion",
//   "cost":150,
//   "rating":4,
//   "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
//   "_id":"PmInA797xJhMIPti"
//   }
const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [productsdata, setproductsdata] = useState([]);
  const [loading, setloading] = useState(false);
  const [debouncetimeout, setdebouncetimeout] = useState(null);
  const [cartitems,setcartitems]=useState([]);
 
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setloading(true);
    try {
      let response = await axios.get(config.endpoint + `/products`);
      setloading(false);
      setproductsdata(response.data);

      //console.log(response.data);
      return response.data;
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setloading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    // console.log("i am text from search",text);
    // console.log(config.endpoint+`/products/search?value=${text}`);
    try {
      let response = await axios.get(
        config.endpoint + `/products/search?value=${text}`
      );
      setloading(false);
      setproductsdata(response.data);
      return response.data;
    } catch (error) {
      if (error.response.status === 404) {
        setproductsdata(undefined);
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    let newtimeout = setTimeout(() => {
      performSearch(value);
    }, 500);
    setdebouncetimeout(newtimeout);
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let response = await axios.get(config.endpoint + `/cart`, {
        headers: { Authorization: `Bearer ${token}` },
        //console.log(reponse.data);
      });
      setcartitems(response.data);
      //let result=generateCartItemsFrom(cartitems,productsdata)
      //setcartitems(/*response.data*/result);
      return response.data;//result;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
   // console.log(items,productId);
    let result=null;
    result=items.find((i)=>(i.productId===productId));
   // console.log(result);
    return (result==undefined ?  false : true);
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log("add to cart function invoked");
    if(!token){
      enqueueSnackbar("Login to add an item to the Cart",{variant:"warning"});
      console.log("addto cart function exited" );
      return;
    }
    // console.log(token);
    // console.log(items);
    // console.log(products);
    // console.log(productId);
    // console.log(qty);
    // console.log("buttonclicked");
    console.log(isItemInCart(items,productId))
    console.log(options.preventDuplicate);
     console.log(options.preventDuplicate && isItemInCart(items,productId))
    if(options.preventDuplicate && isItemInCart(items,productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:"warning"})
      console.log(isItemInCart(items,productId))
      console.log("addto cart function exited" );
      return ;
    }
    try{
    let postdata=await axios.post(config.endpoint+`/cart`,{"productId":`${productId}`,"qty":qty},{headers:{'Authorization':`Bearer ${token}`,'Content-Type': 'application/json'}});
    //clearconsole.log(postdata);
    setcartitems(postdata.data);
    generateCartItemsFrom(cartitems,productsdata);
   // setcartitems(generateCartItemsFrom(cartitems,productsdata));


    console.log("addto cart function exited" );
    }
    catch(error){
      console.log("addto cart function exited" );

    }

    // isItemInCart(cartitems,productId){
    // enqueueSnackbar("Item already in procart. Use the cart sidebar to update quantity or remove item.",{variant:"warning"})
    // }

  };

  useEffect(() => {
     performAPICall();
    
    if (localStorage.getItem("token")) {
     fetchCart(localStorage.getItem("token"));
    }
    //console.log(cartitems);
    // setTimeout(()=>{
    //   setcartitems(generateCartItemsFrom(cartitems,productsdata))
    // },1000)
    // console.log(generateCartItemsFrom(cartitems,productsdata))
    // //console.log(cartitems);

    // console.log("cart items on load",cartitems);
    // console.log(productsdata);

    
    
    
  }, []);
  // useEffect(()=>{
  //   fetchCart(localStorage.getItem("token")).then((response)=>)

  // })
 // let productsarray = [...productsdata];
    //console.log("this is products array from products.js",productsarray);
    //let items=generateCartItemsFrom(cartitems,productsdata);
    //console.log("this is cart items from product.js",items);
  let items=generateCartItemsFrom(cartitems,productsdata);
 
  
  // let cartgrid;
  // if (localStorage.getItem("username") !== null) {
  //   cartgrid = (
      
  //   );
  // } else {
  //   cartgrid = (
  //     <Grid container>
  //       <Grid item p={2} spacing={2} className="product-grid">
  //         <Box className="hero">
  //           <p className="hero-heading">
  //             India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
  //             to your door step
  //           </p>
  //         </Box>
  //         <Grid container spacing={2} p={0.5}>
  //           {loading ? (
  //             <div>
  //               <CircularProgress />
  //               <h4>loading...</h4>
  //             </div>
  //           ) : productsdata === undefined ? (
  //             <div align="center">
  //               <SentimentDissatisfied />
  //               <br />
  //               <h1>No Products Found</h1>
  //             </div>
  //           ) : (
  //             productsdata.map((item) => {
  //               return (
  //                 <Grid item xs={6} md={3} key={item._id}>
  //                   <ProductCard product={item} />
  //                 </Grid>
  //               );
  //             })
  //           )}
  //         </Grid>
  //       </Grid>
  //     </Grid>
  //   );
  // }

  // }, []);
  // useEffect(()=>{
  //   let fetchfiltered=async ()=>{
  //     let newdata=await performSearch(searchtext);
  //   console.log(newdata);
  //   setproductsdata(newdata);

  //   }
  //   fetchfiltered();

  // },[searchtext]
  // );

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => {
            debounceSearch(e, debouncetimeout);
          }}
        />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => {
          debounceSearch(e, debouncetimeout);
        }}
      />
      <Grid container>
        <Grid item md={localStorage.getItem("token")&& productsdata.length?9:12} xs={12} className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          <Grid container spacing={2} p={0.5}>
            {loading ? (
              <div>
                <CircularProgress />
                <h4>loading...</h4>
              </div>
            ) : productsdata === undefined ? (
              <div align="center">
                <SentimentDissatisfied />
                <br />
                <h1>No Products Found</h1>
              </div>
            ) : (
              productsdata.map((item) => {
                return (
                  <Grid item xs={6} md={3} key={item._id}>
                    <ProductCard product={item} handleAddToCart={async()=>{await addToCart(
                      localStorage.getItem("token"),
                      cartitems,
                      productsdata,
                      item._id,
                      1,
                      {
                        preventDuplicate:true
                      }

                    )}} />
                  </Grid>
                );
              })
            )}
          </Grid>
        </Grid>
        {localStorage.getItem("token") &&(<Grid item md={3} xs={12}>
          {<Cart products={productsdata} items={items} handleQuantity={addToCart} />}
        </Grid>)}
      </Grid>
      {/*cartgrid*/}

      <Footer />
    </div>
  );
};

export default Products;
