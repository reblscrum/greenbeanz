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
    this.addList = this.addList.bind(this);
  }


  calculator() {
    let total = 0;
    this.props.shopList.map(obj => {
      total += Number(obj.price);
    });
    return total.toFixed(2);
  }

  checkBox() {

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
    console.log('Handling Change', e.target.value);
    this.setState({ listName: e.target.value});
  }

  addList() {
    // console.log('addList fired');
    //Saves list to DB pass in userId, currently set to 1
    const options = {
      listName: this.state.listName,
      budget: 500,
      shopList: this.props.shopList
    };
    $.post('/db/lists', options, (data) => {
      console.log('got data back', data);
    });
  }
  // <input type="checkbox" name={stuff.name} id="" />
  render() {
    // console.log(this.props)
    return (
      <div className={this.state.listName}>
        <label>
          Name your list
          <input type="text" value={this.state.listName} onChange={this.handleChange}/>
        </label>
        {this.props.shopList.map((stuff, i) => {
          return (
            <div className="indivItem" key={i}>
              {this.state.editMode ?
                (<input type="button" value="Remove From List" id={i} onClick={this.remove.bind(this)} />)
                : ('')
              }
              <a> {stuff.name}   <div className="price">Price:  ${Number((stuff.price)).toFixed(2)}</div>
              </a>
              <div className="id">{stuff.itemId}</div>
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
          <div>
            <input type="button" value="Edit List" onClick={this.editList.bind(this)} />
            <input type="button" value="Save List" onClick={this.addList} />
          </div>
        ) : <br />}
      </div>
    );
  }
}

export default ShoppingList; 