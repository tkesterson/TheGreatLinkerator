const apiRouter = require("express").Router();
const {
  getAllLinks,
  getLinksByTagname,
  createLink,
  updateLink,
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
    const { url } = req.body;
    const newLink = await createLink({ url });
    res.send(newLink);
  } catch (error) {
    next(error);
  }
});
apiRouter.patch("/links/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment, tags, click } = req.body;
    const link = await updateLink({ id, comment, tags, click });
    res.send(link);
  } catch (error) {
    next(error);
  }
});
module.exports = apiRouter;
 