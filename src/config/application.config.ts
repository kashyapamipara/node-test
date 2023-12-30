import { Application } from "express";
import { propertyRoute } from "../components/property/property.routes";
import userRoute from "../components/user/user.routes";

export class ApplicationConfig {
  public static registerRoute(app: Application) {
    app.use('/user', userRoute);
    app.use("/property", propertyRoute);
  }
}
