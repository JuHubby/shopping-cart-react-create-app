import React from "react";
import axios from "axios";
import ReactBootstrap from "react-bootstrap";
import { Card, Accordion, Button, Container, Row, Col, Image, Table, Input, Stack, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// simulate getting products from DataBase
const products = [
    { name: 'Apples', country: 'Italy', cost: 3, instock: 10 },
    { name: 'Oranges', country: 'Spain', cost: 4, instock: 3 },
    { name: 'Beans', country: 'USA', cost: 2, instock: 5 },
    { name: 'Cabbage', country: 'USA', cost: 1, instock: 8 },
  ];
  //=========Cart=============
//   const Cart = (props) => {
//     // what is does this data var do?
//     let data = props.location.data ? props.location.data : products;
//     console.log(`data:${JSON.stringify(data)}`);
  
//     return <Accordion defaultActiveKey="0">{list}</Accordion>;
//   };
  
  const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);
  
    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData,
    });
    console.log(`useDataApi called`);
    useEffect(() => {
      console.log('useEffect Called');
      let didCancel = false;
      const fetchData = async () => {
        dispatch({ type: 'FETCH_INIT' });
        try {
          const result = await axios(url);
          console.log('FETCH FROM URl');
          if (!didCancel) {
            // result.data.data
            // first data is from axios object, second data is from strapi object
            dispatch({ type: 'FETCH_SUCCESS', payload: result.data.data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: 'FETCH_FAILURE' });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case 'FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };
  
  const Products = (props) => {
    const [items, setItems] = React.useState(products);
    const [cart, setCart] = React.useState([]);
    const [total, setTotal] = React.useState(0);
   
    
    //  Fetch Data
    const { Fragment, useState, useEffect, useReducer } = React;
    const [query, setQuery] = useState('http://localhost:1337/api/products');
    const [{ data, isLoading, isError }, doFetch] = useDataApi('http://localhost:1337/api/products', {
      data: [],
    });
    console.log(`Rendering Products ${JSON.stringify(data)}`);
    // Fetch Data
  
  
  
    
    const addToCart = (e) => {
      let name = e.target.name;
      let item = items.filter((item) => item.name == name);
      if (item[0].instock == 0) return;
      item[0].instock = item[0].instock - 1;
      console.log(`add to Cart ${JSON.stringify(item)}`);
      setCart([...cart, ...item]);
      
      //doFetch(query);
    };
    const deleteCartItem = (delIndex) => {
      //this index is diferent to index in product list
      let newCart = cart.filter((item, i) => delIndex != i);
      let target = cart.filter((item, index) => delIndex == index);
      let newItems = items.map((item, index) => {
        if(item.name == target[0].name) item.instock = item.instock + 1;
        return item;
      })
      setCart(newCart);
      setItems(newItems);
    };
    // const photos = ['apple.png', 'orange.png', 'beans.png', 'cabbage.png'];
  
    let list = items.map((item, index) => {
      let n = Math.floor(Math.random() * 49);
      let urlPhotos = "https://picsum.photos/id/" + n + "/90/90";
  
  
  
      return (
        <li key={index}>
          <br/>
          <Container>
            <Row>
              <Col >
                <Image src={urlPhotos} width={90}roundedCircle />
              </Col>          
              <Col >
                <h5>{item.name}</h5><p>${item.cost}</p>
                <Button variant="primary" size="sm"name={item.name} type="submit" onClick={addToCart}>Add Cart</Button>
              </Col>
              <Col>
                <p className="card-text">
                {item.instock} units left.
                </p>
                
              </Col>
              <br/>   
              </Row>                 
          </Container>       
        </li>
      );
    });
    let cartList = cart.map((item, index) => {
      return (
        <>
        <Accordion.Item key={1+index} eventKey={1 + index}>
          <Accordion.Header>{item.name}</Accordion.Header>
          <Accordion.Body>
            <div class="container text-center">
              <div class="row">
                <div class="col">
                $ {item.cost} from {item.country}
                </div>
                <div class="col">
                <Button onClick={() => deleteCartItem(index)}>Remove</Button>
                </div>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
        </>
        
      );
    });
  
    let finalList = () => {
      let total = checkOut();
      let final = cart.map((item, index) => {
        return (
          <>
            
            <Table striped bordered hover size="sm">
              <tbody>
                <tr>
                  <td key={index} index={index}></td>
                  <td>{item.name} </td>
                  <td>${item.cost}</td>
                </tr>
              </tbody>
            </Table>
            </>
            );
          }
        );
     
      return { final, total };
    };
  
    const checkOut = () => {
      let costs = cart.map((item) => item.cost);
      console.log(`costs: ${costs}`);
      const reducer = (accum, current) => accum + current;
      let newTotal = costs.reduce(reducer, 0 );
      console.log(`total updated to ${newTotal}`);
      return newTotal;
    };
    const restockProducts = (url) => {
      doFetch(url);
      
      let newItems = data.map((item) => {
        // let { Name, Country, Cost, Instock } = item;
        let { attributes:{Name: name, Country: country, Cost: cost, Instock: instock} } = item;
        console.log(`item: ${JSON.stringify(item.attributes.Name)}`);
        console.log(`just name of item strappi: ${JSON.stringify(name)}`);
        
        // return { Name, Country, Cost, Instock };
        return { name, country, cost, instock };
        
      });
      console.log(`Name of item from products: ${JSON.stringify(newItems)}`);    
      setItems([...items, ...newItems]);
      console.log(`Name of item from products: ${JSON.stringify(items)}`);   
  
    };
    return (
      <Container>
        <Row>
          <Col>
            <h2>Product List</h2>
            <ul style={{ listStyleType: 'none' }}>{list}</ul>
          </Col>
          <Col>
            <h2>Cart Contents</h2>
            <Accordion defaultActiveKey={['0']} alwaysOpen>{cartList}</Accordion>
          </Col>
          <Col>
            <h2>CheckOut </h2>
            <Button onClick={checkOut}>CheckOut $ {finalList().total}
            </Button>
            <br/>        
                {finalList().total > 0 && finalList().final}        
            </Col>
        </Row>
        <Row>
          <Form inline
            onSubmit={(event) => {
              restockProducts({query});
              console.log(`Restock called on ${query}`);
              event.preventDefault();
            }}>
            <Row>
              <Col xs="auto">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  className=" mr-sm-2"
                  value={query} 
                  onChange={(event) => setQuery(event.target.value)} 
                />
              </Col>
              <Col xs="auto">
                <Button type="submit">ReStock Products</Button>
              </Col>
            </Row>
          </Form>
        </Row>
      </Container>
     
    );
  };
  // ========================================
 export default Products;