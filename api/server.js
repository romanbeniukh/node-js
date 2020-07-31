import express from "express";
import cors from "cors";
import morgan from "morgan";
import { contactsRouter } from "./routes/contacts.router";
import { authRouter } from "./routes/auth.router";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8080;
const corsOptions = {
  orgign: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

export class Server {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddleware();
    await this.initDbConnect();
    this.initRoutes();
    this.controlError();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(express.static("public"));
    this.server.use(express.json());
    this.server.use(cors(corsOptions));
    this.server.use(morgan("combined"));
  }

  initRoutes() {
    this.server.use("/auth", authRouter);
    this.server.use("/api", contactsRouter);
  }

  async initDbConnect() {
    try {
      await mongoose.connect(process.env.MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connection successful");
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  controlError() {
    this.server.use((err, req, res, next) => {
      delete err.stack;
      console.log(err);
      return res.status(err.status).json(err.message);
    });
  }

  startListening() {
    this.server.listen(PORT, () => {
      console.log("Server started and listening on port: ", PORT);
    });
  }
}
