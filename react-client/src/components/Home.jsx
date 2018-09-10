import React from 'react';
import Login from './LogIn.jsx';

const Home = (props) => {
  if (props.status) {
    return (
      <div>DASHBOARD</div>
    )
  } else {
    return (
      <div id="home">
        <h1 className="welcome">Welcome to <em style={{ color: '#7bc57d' }}>The Green Bean</em> </h1>
        <Login handleLogin={props.handleLogin} updateInfo={props.updateInfo}/>
      </div>
    )
  }
}

export default Home;