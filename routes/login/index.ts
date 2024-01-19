import express from "express";

const router: express.Router = express.Router();

/*
  @usage: To login a user
  @url: http://127.0.0.1:1204/login
  @access: PUBLIC
  @method: GET
*/
router.post("/", (req: express.Request, res: express.Response) => {

  res.status(200);
  res.send(`Welcome to login page!`);
});

export default router;
