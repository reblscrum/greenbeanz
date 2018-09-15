import React from 'react';
import ShoppingList from './ShoppingList.jsx';
import List from './List.jsx';

const Cart = (props) => {
  return (
    <div>
      <div className="container">
        <div id="mySidenav" className="sidenav">
          <div className="content">
            <em className="back" onClick={props.changeScreen} >  Back To Dash > </em>
            <ShoppingList shopList={props.shoppingList} saveList={props.saveList} changeScreen={props.changeScreen} reset={props.reset}
              wmTotal={props.wmTotal} hebTotal={props.hebTotal} wfTotal={props.wfTotal} calculator={props.calculator}
            />
          </div>
        </div>
      </div>
      <div id="main">
        <h1>The Green Bean <img src="logo.png" alt="logo" className="logo" /> </h1>
        <div className="formArea">
          <input type="text" value={props.query} onChange={props.handleInput} />
          <input type="button" value="Search" onClick={props.search} />
        </div>
        <div className="results">
          <div className="resLine">_________________________________________________</div>
          <div>
            {props.walmart.length > 0 ? (<h1 className="stores">Walmart</h1>) : ('')}
            <List className="walmart" store={'Walmart'} query={props.finalQuery} items={props.walmart} addItem={props.addItem} showItems={props.showItems} showMore={props.showMore} showLess={props.showLess} />
            {props.walmart.length > 0 ? <div id="show"> <em className="showMore" onClick={props.showMore} >Show More + </em> || <em className="showLess" onClick={props.showLess} > Show Less -</em>
              <div className="resLine">_________________________________________________</div> </div> : ('') }
          </div>
          <div>
            {props.heb.length > 0 ? (<h1 className="stores">HEB</h1>) : ('')}
            <List className="heb" store={'HEB'} query={props.finalQuery} items={props.heb} addItem={props.addItem} showItems={props.showItems} showMore={props.showMore} showLess={props.showLess} />
            {props.heb.length > 0 ? <div id="show"> <em className="showMore" onClick={props.showMore} >Show More + </em> || <em className="showLess" onClick={props.showLess} > Show Less -</em>
              <div className="resLine">_________________________________________________</div></div> : ('') }</div>
          <div>
            {props.wholeFoods.length > 0 ? (<h1 className="stores">Whole Foods</h1>) : ('')}
            <List className="wholeFoods" store={'Whole Foods'} query={props.finalQuery} items={props.wholeFoods} addItem={props.addItem} showItems={props.showItems} showMore={props.showMore} showLess={props.showLess} />
            {props.wholeFoods.length > 0 ? <div id="show"> <em className="showMore" onClick={props.showMore} >Show More + </em> || <em className="showLess" onClick={props.showLess} > Show Less -</em>
              <div className="resLine">_________________________________________________</div></div> : ('') }</div>
        </div>
      </div>
    </div>
  );
};

export default Cart;