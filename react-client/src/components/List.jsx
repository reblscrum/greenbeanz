import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div className="searchRes">
    <br />
    {props.items.slice(0, props.showItems).map((item, i) => {
      return <ListItem store={props.store} query={props.query} key={i} item={item} addItem={props.addItem} />;
    })}
  </div>
);

export default List;