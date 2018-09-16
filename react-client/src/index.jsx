import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';
import ShoppingList from './components/ShoppingList.jsx';
import Dashboard from './components/Dashboard.jsx';
import getHebData from './services/getHebData.jsx';
import logoutService from './services/logoutService.jsx';
import './styles/style.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      walmart: [],
      wholeFoods: [],
      heb: [],
      query: '',
      finalQuery: '',
      existingLists: [],
      shoppingList: [],
      // shoppingList totals below
      'Walmart': 0,
      'HEB': 0,
      'Whole Foods': 0
    };
  }

  calculator() {
    let total = {
      'Walmart': 0,
      'HEB': 0,
      'Whole Foods': 0
    };
    this.state.shoppingList.map(obj => {
      total[obj.store_name] += Number(obj.price);
    });
    this.setState({ Walmart: total.Walmart });
    this.setState({ HEB: total.HEB });
    this.setState({ ['Whole Foods']: total['Whole Foods'] });
    // return total.toFixed(2);
  }

  addItem(e) {
    const options = JSON.parse(e.target.name);
    options.price = (options.price + '').replace(/[^\d.-]/g, '');
    let add = this.state.shoppingList;

    $.post('/db/items', options, (data) => {
      options.itemId = data.rows[0].id;
      add.push(options);
      this.setState({ shoppingList: add });
      this.calculator();
    });
  }

  handleInput(e) {
    this.setState({ query: e.target.value });
  }

  searchItem() {
    this.state.finalQuery = this.state.query;
    $.ajax({
      url: '/api/walmart',
      method: 'POST',
      data: {
        query: this.state.query
      },
      success: (res) => {
        this.setState({ walmart: res });
        this.setState({ query: '' });
      },
      error: (error) => {
        console.log(error);
      }
    });
    getHebData(this.state.query, (result) => {
      this.setState({heb: result});
    });
    $.ajax({
      url: '/api/wholeFoods',
      method: 'POST',
      data: {
        query: this.state.query
      },
      success: (res) => {
        this.setState({ wholeFoods: res });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  createNewList() {
    this.setState({shoppingList: []});
    this.setState({walmart: []});
    this.setState({wholeFoods: []});
    this.setState({heb: []});
  }

  handleLogout = () => {
    logoutService();
  }

  render() {
    return (
      <Dashboard walmart={this.state.walmart} heb={this.state.heb} wholeFoods={this.state.wholeFoods} finalQuery={this.state.finalQuery} query={this.state.query} shoppingList={this.state.shoppingList}
        existingLists={this.state.existingLists} logout={this.handleLogout}
        search={this.searchItem.bind(this)} addItem={this.addItem.bind(this)} handleInput={this.handleInput.bind(this)} wmTotal={this.state.Walmart} hebTotal={this.state.HEB} wfTotal={this.state['Whole Foods']}
        calculator={this.calculator.bind(this)} createNewList={this.createNewList.bind(this)}
      />);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));




//dark green 2c852f
//Lighter 3fae42
// lightest 7bc57d
//darker beige f8f3e1
//lighter beige fefdf9
// Dark BLUE 3b4e5e


// onClick={this.addItem.bind(this)}