import React from 'react';
import $ from 'jquery';
// import ShoppingList from 'ShoppingList.jsx';
// import List from './List';
import Cart from '../components/Cart.jsx';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentScreen: 'dashboard',
      showItems: 3,
      usersLists: []
    };
    this.getLists = this.getLists.bind(this);
  }

  componentDidMount() {
    this.getLists();
  }

  changeScreen() {
    this.state.currentScreen === 'dashboard' ? this.setState({ currentScreen: 'cart' }) : this.setState({ currentScreen: 'dashboard' });
    this.reset();
  }

  handleShowMore() {
    this.setState({showItems: this.state.showItems + 3 });
  }

  handleShowLess() {
    this.setState({showItems: this.state.showItems - 3 });
  }

  reset() {
    this.setState({showItems: 3});
  }
  
  getLists() {
    // console.log('Firing getLists');
    $.get('/db/users/lists', (data) => {
      console.log('Got some data back from getLists', data);
      this.setState({ usersLists: data.rows });
    });
  }

  render() {
    // console.log(this.props);
    if (this.state.currentScreen === 'dashboard') {
      return (
        <div>
          <div id="Dashboard">
            <div id="dashNav" className="sidenav">
              <div className="titles"><em >Dashboard</em></div>
              <a className="logout"> <input type="button" value="Logout" onClick={this.props.logout} /></a>
            </div>
            <div className="mainDash">
              <h3 style={{ color: '#7bc57d' }}>Saved Shopping Lists
                <em className="options" onClick={this.changeScreen.bind(this)}>Create A New List</em>
              </h3>
              {/* <em className="options" onClick={this.changeScreen.bind(this)}>Set Budget</em> */}
              {this.state.usersLists.map((list, i) => {
                return (
                  <div key={i} className="savedList">
                    <div style={{fontWeight: 'bold'}} > <em> {list.name} </em> </div>
                    <a style={{ color: '#3fae42' }}> {list.budget} </a> budget.
                    {/* <input type="button" value="Edit List" /> */}
                  </div>
                );
              })
              }
            </div>
          </div>
        </div>
      );
    } else if (this.state.currentScreen === 'cart') {
      return <Cart shoppingList={this.props.shoppingList} query={this.props.query} items={this.props.items} changeScreen={this.changeScreen.bind(this)} 
        handleInput={this.props.handleInput} search={this.props.search} saveList={this.props.saveList} addItem={this.props.addItem} showItems={this.state.showItems} showMore={this.handleShowMore.bind(this)}
        showLess={this.handleShowLess.bind(this)}
      />;
    }
  }
}

export default Dashboard;