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
      existingLists: [
        { name: 'list1', items: [1, 2, 3, 4] },
        { name: 'list2', items: [2, 5, 7] },
        { name: 'list3', items: [2, 5, 7, 2, 5, 8, 3] }
      ],
      shoppingList: [
        { name: 'Green Beans', price: 1, itemId: 'GB Co.', image: 'blah.png', desc: 'stuff' },
        { name: 'Organic Green Beans', price: 3, itemId: 'Organico', image: 'blah.png', desc: 'stuff' },
        { name: 'Minced Green Beans', price: 2.5, itemId: 'Minced Co', image: 'blah.png', desc: 'stuff' },
        { name: 'Mashed Green Beans', price: 4, itemId: 'Mush Much', image: 'blah.png', desc: 'stuff' }
      ],
    };
  }

  componentDidMount() {

    // $.ajax({
    //   url: '/items', 
    //   success: (data) => {
    //     this.setState({
    //       items: data
    //     })
    //   },
    //   error: (err) => {
    //     console.log('err', err);
    //   }
    // });

  }


  addItem(e) {
    //send this.state.item to server
    // console.log('Inside addItem', this.state.item);
    // let newItem = JSON.parse(e.target.name);
    const options = JSON.parse(e.target.name);
    console.log('e.target.name', options);
    options.price = (options.price + '').replace(/[^\d.-]/g, '');
    let add = this.state.shoppingList;

    $.post('/db/items', options, (data) => {
      add.push(options);
      this.setState({ shoppingList: add });
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
        console.log(res);
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
        console.log(res);
        this.setState({ wholeFoods: res });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  removeItem() {

  }

  saveList(e) {
    /*_____________________________________ 
    moved this function to shoppingList.jsx 
    _______________________________________*/
    // console.log('event.target inside save list', e.target);
    // console.log('Before hitting server', this.state.shoppingList);
    // $.ajax({
    //   url: '/db/items',
    //   method: 'POST',
    //   data: {
    //     item: this.state.shoppingList
    //   },
    //   success: (res) => {
    //     console.log('list has been added');
    //   },
    //   error: (err) => {
    //     console.error(err);
    //   }
    // });
  }

  handleLogout = () => {
    logoutService();
  }

  render() {
    return (
      <Dashboard walmart={this.state.walmart} heb={this.state.heb} wholeFoods={this.state.wholeFoods} finalQuery={this.state.finalQuery} query={this.state.query} shoppingList={this.state.shoppingList}
        existingLists={this.state.existingLists} logout={this.handleLogout}
        search={this.searchItem.bind(this)} addItem={this.addItem.bind(this)} handleInput={this.handleInput.bind(this)} saveList={this.saveList.bind(this)}
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