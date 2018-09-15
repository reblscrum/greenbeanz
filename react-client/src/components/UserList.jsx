import React, { Component } from 'react';
import $ from 'jquery';

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
    $.post('/db/users/listItems', options, data => {
      console.log(data);
      this.setState({ items: data });
      console.log(this.state.items);
    });
  }

  handleClick() {
    this.setState({ clicked: !this.state.clicked });
  }

  getTotal() {
    const grandTotal = this.state.items.reduce((total, item) => {
      const number = Number(item.price);
      total += number;
      return total;
    }, 0);
    return Math.round(grandTotal * 100) / 100;
  }
  generateTable(items) {
    let row = [items[0].query, '---', '---', '---'];
    let rows = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].query !== row[0]) {
        rows.push(row.slice());
        row[0] = items[i].query;
        row[1] = '---';
        row[2] = '---';
        row[3] = '---';
      }
      if (items[i].store_name === 'Walmart') {
        row[1] = items[i].item_name + ': $' + items[i].price;
      } else if (items[i].store_name === 'HEB') {
        row[2] = items[i].item_name + ': $' + items[i].price;
      } else if (items[i].store_name === 'Whole Foods') {
        row[3] = items[i].item_name + ': $' + items[i].price;
      }
    }
    rows.push(row);
    return (
      <table>
        <tbody>
          <tr>
            <th>Item Name</th>
            <th>Walmart</th>
            <th>HEB</th>
            <th>Whole Foods</th>
          </tr>
          {rows.map((row, i) => (
            <tr key={row[0]}>
              <td>{row[0]}</td>
              <td>{row[1]}</td>
              <td>{row[2]}</td>
              <td>{row[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    if (!this.state.clicked) {
      return (
        <div className="savedList" onClick={this.handleClick}>
          <div style={{ fontWeight: 'bold' }}>
            {' '}
            <em> {this.props.list.name} </em>{' '}
          </div>
          <a style={{ color: '#3fae42' }}> {this.getTotal()} </a> Total.
          {/* <input type="button" value="Edit List" /> */}
        </div>
      );
    }
    if (this.state.clicked) {
      return (
        <div className="usersList">
          <div> Items </div>
          {this.generateTable(this.state.items)}
          <div>
            <button className="collapse" onClick={this.handleClick}>
              Hide
            </button>
          </div>
        </div>
      );
    }
  }
}

export default UserList;
