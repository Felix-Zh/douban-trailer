import mongoose from 'mongoose';


const User = mongoose.model('User');

export async function checkPassword(email, password) {
  const user = await User.findOne({ email });
  let match = false;
  
  if (user) {
    match = await user.compare(password, user.password);
  }

  return { match, user };
}
