import { Express } from "express";
import apiRouter from "./controllers/gpt/router";
import userOnboarding from "./controllers/user/onboardingRouter";
import userRouter from "./controllers/user/router";

import adminOnboarding from "./controllers/admin/onboardingRouter";
import adminRouter from './controllers/admin/router'
import adminAuthRoute from './middlewares/adminAuth'
import userAuthRoute from './middlewares/userAuth'



const initWebRoutes = (app:Express) => {
  app.use("/user", userOnboarding);
  app.use("/admin", adminOnboarding);
}

const initUserRoutes = (app: Express) => {
  app.use("/*", userAuthRoute);
  app.use("/user", userRouter);

  app.use("/api", apiRouter);
};



const initAdminRoutes = (app:Express) => {
  app.use("/*", adminAuthRoute);
  app.use("/admin", adminRouter);
}

export {
  initUserRoutes,
  initWebRoutes,
  initAdminRoutes
};
