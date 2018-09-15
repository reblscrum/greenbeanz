import React, { Component } from 'react';

class UserListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log('here is the item: ');
    console.log(this.props.item);
    return (
      <li className="usersListItem">
        <div> Name: {this.props.item.name} </div>
        <div>Price: {this.props.item.price} </div>
        <div>Image: {this.props.item.image} </div>
        <div>query: {this.props.item.query} </div>
        <div> store_name: {this.props.item.store_name} </div>
        <div>user_id: {this.props.item.user_id} </div>
      </li>
    );
  }
}

export default UserListItem;