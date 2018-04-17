const Account = require('./../../infrastructure/account');

const postCancelChangeEmail = async (req, res) => {
  const account = Account.fromContext(req.user);

  await account.deleteChangeEmailCode(req.id);

  return res.redirect('/');
};

module.exports = postCancelChangeEmail;
