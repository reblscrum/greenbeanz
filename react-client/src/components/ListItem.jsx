import React from 'react';

const ListItem = (props) => {
  let itemPrice = props.item.price;
  if (typeof itemPrice === 'string') {
    itemPrice = itemPrice.replace(/[^\d.]/gi, '');
  }
  return (
    <div className="indivRes" >

      <div><img src={props.item.image} /></div>
      <a>{props.item.name}</a>
      <div>PRICE: ${itemPrice}</div>
      <input type="button" value="Add to list" name={`{"name": "${props.item.name}","price": "${props.item.price}", "image": "${props.item.image}", "store_name": "${props.store}","query": "${props.query}"}`} onClick={props.addItem} />
    </div>
  );
};

export default ListItem;