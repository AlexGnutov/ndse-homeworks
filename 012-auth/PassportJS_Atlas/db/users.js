const User = require('../models/users');

function verify(username, password, done) {
    findByUsername(username, function (err, user) {
      if (err) { return done(err) }
      if (!user) { return done(null, false) }
  
      if (!verifyPassword(user, password)) { return done(null, false) }
  
      // `user` будет сохранен в `req.user`
      return done(null, user)
    })
};

function findById (id, cb) {
  process.nextTick(async function () {
    
    try {
      const user = await User.findById(id);
      if (user) {
        cb(null, user)
      } else {
        cb(new Error('User ' + id + ' does not exist'))
      }
    } catch(e) {
      console.log(e.message);      
    }        

  });
};
  
function findByUsername (username, cb) {
  process.nextTick(async function () {
    
    try {
      const user = await User.findOne({username: username});      
      if (user) {
        return cb(null, user)
      }
    } catch (e) {
      console.log(e.message);
    }
    
    return cb(null, null)
  })
};

function verifyPassword (user, password) {  
  return user.password === password
}

module.exports = {verify, findById};