import React from 'react';
import ShoppingList from './ShoppingList.jsx';
import List from './List.jsx';

const Cart = (props) => {
  return (
    <div>
      <div className="container">
        <div id="mySidenav" className="sidenav">
          <div className="content">
            <em className="back" onClick={props.changeScreen} >Back To Dash ></em>
            <h2> My List</h2>
            <ShoppingList shopList={props.shoppingList} saveList={props.saveList} />
          </div>
        </div>
      </div>
      <div id="main">
        <h1>The Green Bean <img src="logo.png" alt="logo" className="logo" /> </h1>
        <div className="formArea">
          <input type="text" value={props.query} onChange={props.handleInput} />
          <input type="button" value="Search"onClick={props.search} />
        </div>
        <List items={props.items} addItem={props.addItem} showItems={props.showItems} showMore={props.showMore} />
      </div>
    </div>
  );
};

export default Cart;