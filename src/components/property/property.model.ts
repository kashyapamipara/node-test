import { Document, Model, model, Schema } from "mongoose";
import { getLogger } from "../../services/logger";

const MODULE_NAME_FOR_LOG = "property.model";
const log = getLogger(MODULE_NAME_FOR_LOG);

/**
 * -----------------------------
 * Interface for user Model
 * -----------------------------
 */

export interface IPropertyDocument extends Document {
  createdByName: string;
  createdContactNumber: string;
  name: string;
  type: string;
  price: string;
  imageURL: string;
  address: string;
  lat: string;
  long: string;
}

export interface IProperty extends IPropertyDocument {}

export interface IPropertyModel extends Model<IProperty> {}

/**
 * --------------------------------
 * user Schema for store in DB
 * --------------------------------
 */

export const propertySchema: Schema<IPropertyDocument> = new Schema(
  {
    createdByName: Schema.Types.String,
    createdContactNumber: Schema.Types.String,
    name: Schema.Types.String,
    type: Schema.Types.String,
    price: Schema.Types.String,
    imageURL: Schema.Types.String,
    address: Schema.Types.String,
    lat: Schema.Types.String,
    long: Schema.Types.String,
  },
  {
    timestamps: true,
  }
);
propertySchema.index({ name: 1 });
export const Property: IPropertyModel = model<IProperty, IPropertyModel>(
  "property",
  propertySchema
);

export default Property;
