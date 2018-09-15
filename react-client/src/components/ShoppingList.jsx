import React from 'react';
import $ from 'jquery';
class ShoppingList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      clicked: false,
      listName: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.saveItems = this.saveItems.bind(this);
    this.saveList = this.saveList.bind(this);
  }


  calculator() {
    let total = 0;
    this.props.shopList.map(obj => {
      total += Number(obj.price);
    });
    return total.toFixed(2);
  }

  editList() {
    let oppState = (!this.state.editMode);
    this.setState({ editMode: oppState });
  }
  remove(e) {
    const id = e.target.id;
    console.log('removing', e.target.id);
    const options = {
      id
    };
    $.post('/db/remove/items', options, (data) => {
      console.log('shopList before splice', this.props.shopList);
      this.props.shopList.splice(id, 1);
      console.log('shopList after splice', this.props.shopList);
      this.forceUpdate();
    });
  }

  handleChange(e) {
    // console.log('Handling Change', e.target.value);
    this.setState({ listName: e.target.value });
  }

  saveItems() {
    const options = {
      listName: this.state.listName,
      shoppingList: this.props.shopList
    };

    $.post('/db/list/save', options, (data) => {
      console.log('recieved some data', data);
    });
  }

  saveList() {
    //Saves list to DB pass in userId, currently set to 1
    const options = {
      listName: this.state.listName,
      budget: 500
      // shopList: this.props.shopList
    };
    $.post('/db/lists', options, (data) => {
      this.setState({editMode: false});
    });
  }

  render() {
    // console.log(this.props)
    return (
      <div className={this.state.listName}>
        {/* changes the name of the List as you enter */}
        <h2>{this.state.listName.length === 0 ? 'My List' : this.state.listName}</h2>
        {/* allows you to change the list name after pressing edit */}
        {this.state.editMode ? ( 
          <label> 
            <a className="label">Name your list: </a> 
            <input type="text" value={this.state.listName} onChange={this.handleChange} />
            <button type="submit" value="save name" onClick={this.saveList}>Save</button>
          </label>) : ('')}

        {this.props.shopList.map((stuff, i) => {
          return (
            <div className="indivItem" key={i}>
              {this.state.editMode ?
                (<input type="button" value=" Remove " id={i} onClick={this.remove.bind(this)} />) : ('')}
              <a className="itemName"> {stuff.name} </a>  <div className="price">Price:  ${Number((stuff.price)).toFixed(2)}</div>
              <div className="id">{stuff.store_name}</div>
              <br />
            </div>
          );
        })
        }

        <div className="calculator">
          <div className="line">_________________________________________________</div>
          <a className="total" >TOTAL : </a> <a className="totNum"> ${this.calculator()} </a>
        </div>

        {this.props.shopList.length > 0 ? (
          <div className="shoppingBtns" >
            <input type="button" value="Edit List" onClick={this.editList.bind(this)} />
            <input type="button" value="Save List" onClick={this.saveItems} />
          </div>
        ) : <br />}
      </div>
    );
  }
}

export default ShoppingList; 