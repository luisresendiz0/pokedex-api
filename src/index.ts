import app from "./app"

const startServer = () => {
  const port = app.get("PORT") as number;
  app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
};

startServer();