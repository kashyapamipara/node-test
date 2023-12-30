import { NextFunction, Request, Response } from "express";
import { getLogger } from "../../services/logger";
import { successCommonCode, SuccessResponse } from "../../utils/success-utils";
import axios from "axios";
import { createProperty, getAllProperty } from "./property.DAL";
const https = require("https");
const MODULE_NAME_FOR_LOG = "property.controller";
const log = getLogger(MODULE_NAME_FOR_LOG);

class PropertyController {
  /** set new property
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   */
  public async setProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const property = req.body;
      const geoURL=`https://api.geoapify.com/v1/geocode/search?text=${property.address}&apiKey=${process.env.GOE_ACCESS_KEY}`
      // const geoURL = `http://api.positionstack.com/v1/forward?access_key=${process.env.GOE_ACCESS_KEY}&query=${property.address}`;
      const instance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
      const addressLatandLong = await axios.get(geoURL);

      property.lat = addressLatandLong.data.features[0].geometry.coordinates[0];
      property.long = addressLatandLong.data.features[0].geometry.coordinates[1];
      const propertyData = await createProperty(property);
      log.info("property created successfully");
      const response = SuccessResponse.apiSuccess({
        code: successCommonCode.CREATED_SUCCESSFULLY,
        data: propertyData,
        message: "property set Successfully",
      });
      res.status(response.statusCode).json(response);
    } catch (err) {
      log.error(err);
      next(err);
    }
  }

  /** get all  property
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   */
  public async getAllProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filterPrams = req.query;
      let query = [];
      if (filterPrams.search) {
        query.push({
          $match: {
            name: { $regex: filterPrams.search, $options: "i" },
          },
        });
      }
      if (filterPrams.type) {
        query.push({
          $match: {
            type: filterPrams.type,
          },
        });
      }
      if (filterPrams.price) {
        query.push({
          $match: {
            price: filterPrams.price,
          },
        });
      }
      const propertyData = await getAllProperty(query);

      log.info("property fetched successfully");
      const response = SuccessResponse.apiSuccess({
        code: successCommonCode.FETCHED_SUCCESSFULLY,
        data: propertyData,
        message: "property get Successfully",
      });
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  }
}

export const propertyController = new PropertyController();
export default propertyController;
