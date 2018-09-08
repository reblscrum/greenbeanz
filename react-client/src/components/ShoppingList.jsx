import React from "react";

class ShoppingList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      checked: false,
    };
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
    this.setState({ editMode: oppState })
  }


  render() {
    // console.log(this.props)
    return (
      <div className="shoppingList">
        {this.props.shopList.map((stuff, i) => {
          return (
            <div className="indivItem" key={i}>
              {this.state.editMode ?
                (<input type="checkbox" name={stuff.name} id="" />) : ('')
              }
              <a> {stuff.name}   <div className="price">Price:  ${Number((stuff.price)).toFixed(2)}</div>
              </a>
              <div className="id">{stuff.itemId}</div>
              <br />
            </div>
          )
        })
        }

        <div className="calculator">
          <div className="line">_________________________________________________</div>
          <a className="total" >TOTAL : </a> <a className="totNum"> ${this.calculator()} </a>
        </div>

        {this.props.shopList.length > 0 ? (
          <div>
            <input type="button" value="Edit List" onClick={this.editList.bind(this)} />
            <input type="button" value="Save List" onClick={this.props.saveList} />
          </div>
        ) : <br />}
      </div>
    )
  }
}

export default ShoppingList; 