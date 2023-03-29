import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";



const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        sx={{ height: 140 }}
        src={product.image}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          ${product.cost}<br/>
          {/* ₹{product.cost*82.65} */}
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions>
        <Button className="button" id="" variant="contained" fullWidth={true} onClick={handleAddToCart}>
          <AddShoppingCartOutlined />
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
