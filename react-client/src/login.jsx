import React from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './components/LogInForm.jsx';
import loginService from './services/loginService.jsx';
import signupService from './services/signupService.jsx';
import './styles/style.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errorMsg: '' };
  }

  handleLogin = (username, password) => {
    loginService(username, password, () => {
      this.setState({ errorMsg: 'Sorry, your credentials are incorrect. Please try again.' });
    });
  }

  handleSignup = (username, password, cb) => {
    signupService(username, password, cb);
  }

  showMsg = (msg) => {
    this.setState({ errorMsg: msg });
  }


  render() {
    return (
      <div id="home">
        <div className="divider"></div>
        <div className="loginContainer">
          <h1 className="welcome">Welcome to <em style={{ color: '#7bc57d' }}>The Green Bean</em> <img src="GB-blue.png" alt="logo" className="loginLogo" /> </h1>
          <LoginForm handleLogin={this.handleLogin} handleSignup={this.handleSignup} errorMsg={this.state.errorMsg} showMsg={this.showMsg} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Login />, document.getElementById('login'));

