import path         from "path";
import express      from "express";
import dotenv       from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes    from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes    from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server }  from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();
// PORT should be assigned after calling dotenv.config() because we need to access the env variables. Didn't realize while recording the video. Sorry for the confusion.
const PORT = process.env.PORT || 5001;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth",     authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users",    userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});

/*
* await
Using await makes asynchronous code appear synchronous in terms of readability and flow,
 but it does not make the operations themselves synchronous. 

* Appearance:
Code Readability: Using await makes asynchronous code easier to read and understand by making it look like synchronous code.
Linear Flow: The code executes in a linear, top-to-bottom fashion.

* Operation:
Still Asynchronous: The operations themselves are still asynchronous. 
The JavaScript "event loop continues" to handle other tasks while waiting for the promise to resolve.
!Non-Blocking: await does not block the entire execution of the program. It only pauses the execution of the async function in which it is used.
 */