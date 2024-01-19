import express from "express";

const router: express.Router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {

  res.status(201);
  res.json({
    msg: "Welcom to sign up page"
  });
});

export default router;
