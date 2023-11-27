import { Router } from "express";

const router = Router();

router.param("word", (req, res, next, word) => {
  const isValidParams = /^[a-zA-Z]+$/.test(word);
  if (!isValidParams)
    return res.status(400).send({ status: "error", error: "invalid word" });

  //Se buca la palabra y procesa
  req.word = word;
  next();
});

router.get("/:word", async (req, res) => {
  const { word } = req.params;
  res.send({ status: "success", payload: word });
});

router.get("*", (req, res) => {
  res.status(400).send({ status: "error", error: "invalid word" });
});

export default router;