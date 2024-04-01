const jwt = require("jsonwebtoken");
const secret = "jdf;kljhuihn0qhuewhfn-que";



const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const userToken = verifyToken(token, secret);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error(error);    
  }
};
function determineRoomId(senderUsername, recipientUsername) {  
  const rand = (Math.random()*1000000);
  const usernames = [senderUsername, recipientUsername];
  const roomId = usernames.join('-')+rand;
  return roomId;
}
module.exports = {verifyToken,determineRoomId};



