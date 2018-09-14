import React, { Component } from 'react';
import $ from 'jquery';
import UserListItem from './UserListItem.jsx';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      items: []
    };
    this.getItems = this.getItems.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getTotal = this.getTotal.bind(this);
  }
  componentDidMount() {
    this.getItems();
  }

  getItems() {
    const options = {
      listId: this.props.list.id
    };
    $.post('/db/users/listItems', options, (data) => {
      this.setState({ items: data });
    });
  }

  handleClick() {
    this.setState({clicked: !this.state.clicked});
  }

  getTotal() {
    const total = this.state.items.reduce((total, item) => {
      const number = Number(item.price);
      total += number;
      return total;
    }, 0);
    console.log('Here is a total', total);

    return total;
  }

  render() {
    if (!this.state.clicked) {
      return (
        <div className="savedList" onClick={this.handleClick}>
          <div style={{fontWeight: 'bold'}} > <em> {this.props.list.name} </em> </div>
          <a style={{ color: '#3fae42' }}> {this.getTotal()} </a> Total.
          {/* <input type="button" value="Edit List" /> */}
        </div>
      );
    } 
    if (this.state.clicked) {
      return (
        <div className="usersList">
          <div> Items: </div>
          <ul>
            {this.state.items.map((item, i) => {
              return (
                <UserListItem key={i} item={item}/>
              );
            })
            }  
          </ul>
          <div>
            <button className="collapse" onClick={this.handleClick}>Hide</button>
          </div>
        </div>
      );
    }
  }
}




export default UserList;