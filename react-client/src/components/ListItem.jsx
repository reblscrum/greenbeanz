import React from 'react';

const ListItem = (props) => (
  <div className="indivRes" >
    <div><img src={props.item.image} /></div>
    <a>{ props.item.name }</a>
    <div>PRICE: ${props.item.price}</div>
      <input type="button" value="Add to list" name={`{"name": "${props.item.name}", "itemId": "${props.item.itemId}", "price": "${props.item.price}", "image": "${props.item.image}", "desc": "${props.item.desc}"}`} onClick={props.addItem}/>
  </div>
)

export default ListItem;