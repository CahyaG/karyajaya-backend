const fs = require('fs');

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

  makeid(length = 40) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
}