const reshapeItems = function (items, response = []) {
  items.map(obj => {
    const itemObj = {
      name: obj.name || "name not provided",
      price: obj.salePrice || "price not provided",
      image: obj.mediumImage || "image not provided",
      store_name: obj.store_name || "store_name not provided",
      query: obj.store_name || "query not provided",
      user_id: obj.store_name || "-1"
    };

    /* Leaving this here db call is still neccessary
      Currently just formats response data from walmart api
      Moved DB saving to onClick for each item */

    // db.insertOne(itemObj, (err, savedData) => {
    //   if (err) {
    //     console.log('Error adding item to DB', err);
    //   } else {
    //     console.log('Success adding item to DB');
    //   }
    // });
    response.push(itemObj);
  });
  return response;
};

module.exports = reshapeItems;