import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';
import ShoppingList from './components/ShoppingList.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      // currentScreen: 'Login',
      // isLoggedIn: false
      item: '',
      query: '',
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

    let newItem = JSON.parse(e.target.name);
    let add = this.state.shoppingList;
    add.push(newItem);
    this.setState({ shoppingList: add });
  }

  handleInput(e) {
    this.setState({ item: e.target.value });
  }

  searchItem() {
    $.ajax({
      url: '/api/items',
      method: 'POST',
      data: {
        item: this.state.item
      },
      success: (res) => {
        this.setState({ items: res });
        this.setState({ item: '' });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  removeItem() {

  }

  saveList() {
    $.ajax({
      url: '/db/items',
      method: 'POST',
      data: {
        item: this.state.shoppingList
      },
      success: (res) => {
        console.log('list has been added');
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          <div id="mySidenav" className="sidenav">
            <div className="content">
              <h2> My List</h2>
              <ShoppingList shopList={this.state.shoppingList} saveList={this.saveList.bind(this)} />
            </div>
          </div>
        </div>
        <div id="main">
          <h1>The Green Bean
            <img src="logo.png" alt="logo" className="logo" />
          </h1>
          <div className="formArea">
            <input type="text" value={this.state.item} onChange={this.handleInput.bind(this)} />
            <input type="button" value="Search" onClick={this.searchItem.bind(this)} />
          </div>
          <List items={this.state.items} addItem={this.addItem.bind(this)} />
        </div>
      </div>
    );
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