import { Application } from "express";
import { propertyRoute } from "../components/property/property.routes";

export class ApplicationConfig {
  public static registerRoute(app: Application) {
    app.use("/property", propertyRoute);
  }
}
