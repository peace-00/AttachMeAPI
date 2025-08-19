const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  // etracts the authorization header
  const authHeader = req.headers.authorization;
  // get actual token
  const token = authHeader && authHeader.split(" ")[1];

  // check if we have a token
  if (!token) return res.status(404).json({ message: "No Token Provided" });
  try {
    // verify the token using thw secretKey
    const decode = jwt.verify(token, JWT_SECRET);
    // we attach the payload to the request
    //this is the logged in user
    req.user = decode;
    // proceed to the next route/function
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//middleware to authorize access based on the user role
// accepts any number of allowed roles(eg 'admin', 'teacher')
// ...params -accepts any number of arguments and automatically puts them into array

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access Denied: Insufficient Permissions..." });
    }
    next();
  };
};
module.exports = { auth, authorizeRoles };
