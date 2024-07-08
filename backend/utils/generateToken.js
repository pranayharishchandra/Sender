import jwt from "jsonwebtoken";

/**
if (newUser) {
	generateTokenAndSetCookie(newUser._id, res);
	await newUser.save();
	...
}
*/

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	// setting cookie in the browser
	res.cookie("jwt", token, {
		maxAge  : 15 * 24 * 60 * 60 * 1000, // MS
		httpOnly: true,                     // prevent XSS attacks cross-site scripting attacks (users can't access this via JSript )
		sameSite: "strict",                 // CSRF attacks cross-site request forgery attacks
		secure  : process.env.NODE_ENV !== "development",
	});
};

export default generateTokenAndSetCookie;

/* 
* 1. breakdown: jwt.sign(payload, secretOrPrivateKey, [options, callback])

* payload: { userId }
 - This is the payload of the token, which includes the data you want to encode. In this case, it's an object containing the userId. The payload can be accessed from the token by anyone who has the token, so it should not contain sensitive information unless it is encrypted.

* secretOrPrivateKey: process.env.JWT_SECRET 
- This is the secret key used to sign the token. It should be kept secure and not exposed publicly. The security of the JWT depends on the secrecy of this key.
* JWT encodes our data (header and payload) using our SECRETE_KEY
* KEY to generate DIGITAL SIGNATURE 


* options: { expiresIn: "15d" } 
- These are "additional" options for the token. expiresIn: "15d" sets the token to expire in 15 days. After this time, the token will no longer be valid.
* if someone gets our token it will use it forever resembling himself as you, so EXPIRATION IMPORTANT

* 2. Result - token: The result of this method is a string (token) that represents the JWT. 
This token can be sent to a client and used to make authenticated requests. 
The client typically sends this token in the Authorization header when making requests to the server.

The JWT itself is composed of three parts: header, payload, and signature, each part separated by dots (.). 

The header typically specifies the type of the token (JWT) and the signing algorithm. The payload contains the claims (data). The signature is used to verify that the message wasn't changed along the way.

*signature is hashed value, used verify if (header+payload) hashed value is equalt to hashed signature
This token is useful for maintaining user sessions or making API requests that require authentication, ensuring that the user has logged in and has permission to perform certain operations.
*/

/*
* JWT WORKING
JWT works we need to understand what JWT
is used for and JWT is just for
authorization not authentication 

they're slightly different with authentication

* authentication
what you're doing is you're taking in a
username and a password and
authenticating to make sure that
username and password is correct it's
like logging a user in 

* but authorization
is actually making sure that the user
that sends request to your server is the
same user that actually logged in during
the authentication process


it's authorizing that this user has
access to this particular system and the
way that this is normally done is by
using session so for example you have a
session ID 

* session ID 
that you send down in the
cookies of the browser and then every
time the client makes your request they
send that session ID sent to the server
and the server checks its memory says ok
what user has that session ID it finds
that user and then it does the
authorization to make sure the user has
access
but JWT instead of actually using these
cookies it uses a JSON web token which
is what JWT stands for to do the

* TRADITIONALLY "SESSION ID" USED, NOW JWT
* TRADITIONALLY: SERVER HAVE TO LOOKUP ABOUT THE USER USNING SESSION ID
* JWT: USER INFORMATION like. userId, is stored on the BROWSER, AND NOT ON THE SERVER
* so same JWT can be used accross devices and no concept of SESSION, so more logins can be done at the same time by same user and server can manage that very easily

 
 */