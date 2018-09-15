import React, { Component } from 'react';

class UserListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <li className="usersListItem">
        <div> Name: {this.props.item.name} </div>
        <div>Price: {this.props.item.price} </div>
      </li>
    );
  }
}

export default UserListItem;