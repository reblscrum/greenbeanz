import $ from 'jquery';

const logoutService = () => {
  $.ajax({
    url: '/users/logout',
    method: 'GET'
  })
    .then(res => {
      window.location = res;
    })
    .catch(err => {
      console.log(err);
    });
};

export default logoutService;