import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div className="searchRes">
    <h4> List Component </h4>
    {/* <h5>There are {props.items.length} items. </h5> */}
    <br />
    {Object.keys(props.items).map((store, idx) => {
      return (
        <div className={store} key={idx} >
          {props.items[store].length > 0 ? (<h1 className="stores">{props.titles[idx]}</h1>) : ('')}
          {props.items[store].slice(0, props.showItems).map((item, i) => {
            return <ListItem key={i} item={item} addItem={props.addItem} />;
          })}

          {props.items[store].length > 0 ? <div id="show"> <em className="showMore" onClick={props.showMore} >Show More +</em> || <em className="showLess" onClick={props.showLess} >Show Less -</em></div> : ('') }
        </div>
      );
    })
    }
  </div>
);

// {props.items.map((item, i) => <ListItem key={i} item={item} addItem={props.addItem}/>)}
export default List;