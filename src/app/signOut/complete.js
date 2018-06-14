'use strict';

const complete = (req, res) => {
  res.render('signOut/views/complete', {
      hideNav: true,
  });
};

module.exports = complete;
