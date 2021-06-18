const apiRouter = require("express").Router();
const {
  getAllLinks,
  getLinksByTagname,
  createLink,
  updateCount,
} = require("../db");

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
});

apiRouter.get("/links", async (req, res, next) => {
  try {
    const links = await getAllLinks();
    res.send(links);
  } catch (error) {
    next(error);
  }
});

apiRouter.get("tags/:tagname/links", async (req, res, next) => {
  try {
    const { tagname } = req.params;
    const links = await getLinksByTagname({ tagname });
    res.send(links);
  } catch (error) {
    next(error);
  }
});

apiRouter.post("/links", async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, url, comments, tags } = req.body;
    const newLink = await createLink({ name, url, comments, tags });
    res.send(newLink);
  } catch (error) {
    next(error);
  }
});
apiRouter.patch("/links/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { count } = req.body;
    const link = await updateCount(id, count);
    res.send(link);
  } catch (error) {
    next(error);
  }
});
module.exports = apiRouter;
