
export const isAdmin = async (req, res, next) => {
  const { email } = req.user;
  // const adminUser = await User.findOne({ email });
  res.send(email)
  console.log(req.body.email)
}