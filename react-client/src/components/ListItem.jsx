import React from 'react';

const ListItem = (props) => (
  <div className="indivRes" >
    <div><img src={props.item.image} /></div>
    <a>{props.item.name}</a>
    <div>PRICE: ${props.item.price}</div>
    <input type="button" value="Add to list" name={`{"name": "${props.item.name}","price": "${props.item.price}", "image": "${props.item.image}", "store_name": "Walmart","query": "Query2", "user_id": -1 }`} onClick={props.addItem} />
  </div>
); 

export default ListItem;