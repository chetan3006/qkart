import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack,Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {Link} from "react-router-dom";
import "./Cart.css";
import Products from "./Products";

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
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  //console.log("cartdata",cartData);
  //console.log("productsdata",productsData);
  let populatedcart=cartData.map((item)=>({...item,...productsData.find((products)=>(item.productId===products._id))


  }));
  //console.log("this is filtered products data from cart items",populatedcart);


  return populatedcart;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let totalvalue=0;
  items.map((i)=>(totalvalue+=(i.cost*i.qty)))
 //c console.log(items);
 // console.log(result);
  return totalvalue;

};
// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
 export const getTotalItems = (items = []) => {
  let totalitems=items.map((i)=>(i.qty)).reduce((resval,currval)=>resval+currval,0);
  return totalitems;
};




/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  Ro
}) => {
  return (
   <Stack direction="row" alignItems="center">
    {Ro ? <div><Box padding="0.5rem" data-testid="item-qty">
    Qty:{value}
  </Box></div>:
    <Stack direction="row" alignItems="center">
     <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>}
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * 
 */
const Cart = ({
  products=[],
  items = [],
  handleQuantity,
  isReadOnly
}) => {
  //console.log(items)
 //clear console.log(getTotalItems(items));
  const handleplus=(productid,quantity)=>{
  //   console.log(localStorage.getItem("token"));
  //   console.log(products);
  //   console.log(items);
  //  console.log(productid,typeof(quantity),quantity+1);
   handleQuantity(localStorage.getItem("token"),products,items,productid,quantity+1)
  }
  const handleminus=(productid,quantity)=>{
    handleQuantity(localStorage.getItem("token"),products,items,productid,quantity-1)
  }
//generateCartItemsFrom([...items],[...products]);
   // console.log(generateCartItemsFrom(items,productsarray));
  // {console.log("this is productsarrai in cart.js",products)}
  // {console.log("this is car item in cart.js",items)}
  // // {console.log(generateCartItemsFrom(cartitem,productsarray))}

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }
  

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */
          items.map((i)=>(
            <Box display="flex" alignItems="flex-start" padding="1rem" key={i._id}>
                <Box className="image-container">
                    <img
                        // Add product image
                        src={i.image}
                        // Add product name as alt eext
                        alt={i.name}
                        width="100%"
                        height="100%"
                    />
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    height="6rem"
                    paddingX="1rem"
                >
                    <div>{/* Add product name */i.name}</div>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                    {isReadOnly?<ItemQuantity
                    // Add required props by checking implementation
                    value={i.qty}
                    Ro

                    />:<ItemQuantity
                    // Add required props by checking implementation
                    value={i.qty}
                    handleAdd={()=>handleplus(i._id,i.qty)}
                    handleDelete={()=>{handleminus(i._id,i.qty)}}

                    />}
                    <Box padding="0.5rem" fontWeight="700">
                        ${/* Add product cost */i.cost}
                    </Box>
                    </Box>
                </Box>
            </Box>))
        }

        
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        

        {isReadOnly?null:<Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Link to="/checkout"><Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
          >
            Checkout
          </Button></Link>
        </Box>}
        
      </Box>
      {/* <Box className="cart" display="flex" align-items="flex-start">
  
      <Box><h3>Order details</h3></Box>
      <Box><h5>Products</h5>{getTotalItems(items)}</Box>
      <Box><h5>Subtotal</h5>{getTotalCartValue(items)}</Box>
      <Box><h5>Shipping Charges</h5></Box>
      <Box><h4>Total</h4>{getTotalCartValue(items)}</Box>
      </Box> */}
      <Box
      className="cart"
      >
        {isReadOnly?<div><Box align="center" padding="1rem"><h2>Order details</h2></Box>
        <Box display="flex" flexDirection="column" justifyContent="space-between" padding="1rem" >
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between"><h5>Products</h5><div>{getTotalItems(items)}</div></Box>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between"><h5>Subtotal</h5>{getTotalCartValue(items)}</Box>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between"><h5>Shipping Charges</h5><div>$0</div></Box>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between"><h3>Total</h3><h3>{getTotalCartValue(items)}</h3></Box>
        </Box></div>:null}

      </Box>
      {/* {isReadOnly?<Box display="flex" sx={{backgroundColor:"red"}} >hello</Box>:<h1>hello</h1>

        } */}
    </>
  );
};

export default Cart;
