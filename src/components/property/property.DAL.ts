import { pipeline } from "stream";
import { getLogger } from "../../services/logger";
import HttpException, { ERROR_CONST } from "../../utils/error-utils";
import { PROPERTY_ERROR_CODES } from "./property.errors";
import Property, { IProperty, IPropertyDocument } from "./property.model";

const MODULE_NAME_FOR_LOG = "property.DAL";
const log = getLogger(MODULE_NAME_FOR_LOG);

/** Create new property doc in database
 */
export const createProperty = async (
  propertyObject: IPropertyDocument
): Promise<IProperty | never> => {
  try {
    return await Property.create(propertyObject);
  } catch (err) {
    throw new HttpException({
      errorType: ERROR_CONST.DATABASE_ERROR,
      exceptionCode: "CREATE_PROPERTY_IN_DB",
      description: PROPERTY_ERROR_CODES.CREATE_PROPERTY_IN_DB,
      err,
      moduleName: MODULE_NAME_FOR_LOG,
    });
  }
};
/** Create new user doc in database
 */
export const getAllProperty = async (query): Promise<IProperty[] | never> => {
  try {
    if (query.length) return await Property.aggregate(query);
    return await Property.find();
  } catch (err) {
    throw new HttpException({
      errorType: ERROR_CONST.DATABASE_ERROR,
      exceptionCode: "FIND_PROPERTY_IN_DB",
      description: PROPERTY_ERROR_CODES.FIND_PROPERTY_IN_DB,
      err,
      moduleName: MODULE_NAME_FOR_LOG,
    });
  }
};
