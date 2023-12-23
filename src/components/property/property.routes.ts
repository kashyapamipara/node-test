import { Router } from "express";
import propertyController from "./property.controller";

export const propertyRoute = Router({ strict: false });

/**
 * to add property
 */
propertyRoute.post(`/`, propertyController.setProperty);

propertyRoute.get("/all", propertyController.getAllProperty);
