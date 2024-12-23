const User = require('../model/user');  

exports.searchUser = async (req, res) => {
  try {
    const { idNumber, lotteryNumber } = req.query;

    // Ensure at least one parameter is provided
    if (!idNumber && !lotteryNumber) {
      return res.status(400).json({ error: 'Please provide at least one search parameter ...' });
    }

    const query = {};
    if (idNumber) query.idNumber = idNumber;
    if (lotteryNumber) query.lotteryNumber = lotteryNumber;
    
    const users = await User.find(query);

    // Check if any users are found
    if (users.length === 0) {
      return res.status(404).json({ message: 'No user found' });
    }

    // Return the matching users
    return res.status(200).json(users);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ error: error.message });
  }
};
