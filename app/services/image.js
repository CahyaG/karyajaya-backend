const fs = require('fs');
const utils = require('./utils.js');

module.exports = {
  async uploadImage (path, image){
    image.mv(path, function(err) {
      if (err){
        console.log(err)
        return false
      }
      return true
    });
  },

  async deleteImage (path){
    fs.unlink(path, (err) => {
      if (err && err.code != 'ENOENT'){
        console.log(err)
        return false
      }
      return true
    });
  },

  makeUrl(publicPath, id, ext){
    return `${publicPath}/${utils.makeid()}${id}${ext}`;
  }
}