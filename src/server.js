import createApp from "./app.js";
import loaders from "./loaders/index.js";

const startServer = async () => {
  const app = createApp();

  await loaders({ app });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();