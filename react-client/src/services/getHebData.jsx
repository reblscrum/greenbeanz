import $ from 'jquery';


// data is hard coded to milk, needs a search input on front end then you can make the search dynamic
const getHebData = (searchTerm, cb) => {
  $.ajax({
    method: 'POST',
    url: '/api/heb',
    data: { query: searchTerm }
  })
    .then(results => {
      if (cb) {
        cb(results);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export default getHebData;