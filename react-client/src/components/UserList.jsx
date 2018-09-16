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
      this.setState({ items: data });
      // console.log(this.state.items);
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

  listTotal(store, list) {
    let total = 0;
    list.map((item) => {
      if (item.store_name === store) {
        total += Number(item.price);
      }
    });
    return total.toFixed(2);
  }

  generateTable(items) {
    console.log(items);
    let row = [items[0].query, '---', '---', '---'];
    let rows = [];
    let wmTotal = 0;
    let hebTotal = 0;
    let wfTotal = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].query !== row[0]) {
        rows.push(row.slice());
        row[0] = items[i].query;
        row[1] = '---';
        row[2] = '---';
        row[3] = '---';
      }
      if (items[i].store_name === 'Walmart') {
        wmTotal += items[i].price * 1;
        row[1] = items[i].name + ': $' + items[i].price;
      } else if (items[i].store_name === 'HEB') {
        hebTotal += items[i].price * 1;
        row[2] = items[i].name + ': $' + items[i].price;
      } else if (items[i].store_name === 'Whole Foods') {
        wfTotal += items[i].price * 1;
        row[3] = items[i].name + ': $' + items[i].price;
      }
    }
    rows.push(row);
    rows.push(['total', wmTotal, hebTotal, wfTotal]);
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
            <tr key={i}>
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
    // console.log('Here are props in Userlist', this.props);
    // console.log('here is this.state.items', this.state.items);
    if (!this.state.clicked) {
      return (
        <div className="savedList" onClick={this.handleClick}>
          <div style={{ fontWeight: 'bold' }}>
            {' '}
            <em> {this.props.list.name} </em>{' '}
          </div>
          <div className="listTotals">
            <a className="listWalmart" >Walmart: ${this.listTotal('Walmart', this.state.items)}</a>
            <a className="listHEB" >HEB: ${this.listTotal('HEB', this.state.items)}</a>
            <a className="listWholeFoods" >Whole Foods: ${this.listTotal('Whole Foods', this.state.items)}</a>
          </div>
          {/* <a style={{ color: '#3fae42' }}> {this.getTotal()} </a> Total. */}
          {/* <input type="button" value="Edit List" /> */}
        </div>
      );
    }
    if (this.state.clicked) {
      return (
        <div className="usersList">
          <div className="shownListName"> {this.props.list.name}: </div>
          {this.generateTable(this.state.items)}
          <div>
            <div className="collapse">
              <button onClick={this.handleClick}> Hide </button>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default UserList;
