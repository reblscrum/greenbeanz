import React from 'react';
// import ShoppingList from 'ShoppingList.jsx';
// import List from './List';
import Cart from '../components/Cart.jsx';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentScreen: 'dashboard',
    };
  }

  changeScreen() {
    this.state.currentScreen === 'dashboard' ? this.setState({ currentScreen: 'cart' }) : this.setState({ currentScreen: 'dashboard' });
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
              {this.props.existingLists.map((list, i) => {
                return (
                  <div key={i} className="savedList">
                    <div style={{fontWeight: 'bold'}} > <em> {list.name} </em> </div>
                    <a style={{ color: '#3fae42' }}> {list.items.length} </a> items.
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
      return <Cart shoppingList={this.props.shoppingList} item={this.props.item} items={this.props.items} changeScreen={this.changeScreen.bind(this)} 
        handleInput={this.props.handleInput} search={this.props.search} saveList={this.props.saveList} addItem={this.props.addItem}
      />;
    }
  }
}

export default Dashboard;