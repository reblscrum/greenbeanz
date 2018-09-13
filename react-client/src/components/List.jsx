import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div className="searchRes">
    <h4> List Component </h4>
    {/* <h5>There are {props.items.length} items. </h5> */}
    <br />
    {/* {console.log(props.items.walmart)} */}
    {/* <div className="hebResults"> */}
    {props.items.heb.map((item, i) => {
      // console.log(item);
      return <ListItem key={i} item={item} addItem={props.addItem}/>;
    })
    }
    {/* </div> */}
  

  </div>
);

// {props.items.map((item, i) => <ListItem key={i} item={item} addItem={props.addItem}/>)}
export default List;