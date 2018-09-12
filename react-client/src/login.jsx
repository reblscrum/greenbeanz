import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Home from './components/Home.jsx';
import LoginForm from './components/LogInForm.jsx';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: false,
      errorMsg: 'Sorry, there was an error logging in. Please try again.'
    };
  }

  updateUserInfo = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleLogin = (e) => {
    console.log(e.target.value);
    // console.log(this.state.username, this.state.password);

    $.ajax({
      url: '/db/users',
      method: 'POST',
      data: {
        type: e.target.value,
        username: this.state.username,
        password: this.state.password
      },
      success: (res) => {
        console.log('user: ', res);
        this.setState({ isLoggedIn: true });
        this.setState({ error: false });
      },
      error: (err) => {
        err.responseText.length === 0 ? '' : (this.setState({ error: true }, this.setState({ errorMsg: err.responseText })));
      }
    });
  }

  render() {
    return (
      <div id="home">
        <div className="divider"></div>
        <div className="loginContainer">
          <h1 className="welcome">Welcome to <em style={{ color: '#7bc57d' }}>The Green Bean</em> <img src="GB-blue.png" alt="logo" className="loginLogo" /> </h1>
          <LoginForm handleLogin={this.handleLogin} updateInfo={this.updateInfo} error={this.state.error} errMsg={this.state.errMsg} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Login />, document.getElementById('login'));

