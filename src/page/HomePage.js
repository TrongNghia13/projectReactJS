import React, { useEffect, useState } from "react";

import ProductService from "../services/productService";

export default function HomePage({ item}) {


  const [counter, setCounter] = useState(0);
  const [products, setProducts] = useState([]);

  const handleLoading = () => {
    setCounter(0);
  };
  const handleSuccess = () => {
    setCounter(1);
  };
  useEffect(() => {
    ProductService.getPaged({ limit: 10, offset: 0 }).then((products) => {
      console.log(products);
      setProducts(products);
    });
  }, []);

  const handleAddToCart = (product, quantity) => {
    
    


  }



  return (
    <React.Fragment>
      <div>bai 1</div>
      <h1> {counter}</h1>
      <button onClick={handleLoading}>Loading</button>


      <button onClick={handleSuccess}>Success</button>
      <div>
        {
        counter === 0 ? <div>Loading...</div> : <div>Success</div>
        
        }
        {item}

        {products.map((product, index) => (
          <div key={index}>{product.title}</div>
        ))}
      </div>
    </React.Fragment>
  );
}
