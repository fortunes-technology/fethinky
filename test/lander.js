/*eslint-env node*/
import thinky , { type } from "./thinky";
import Business from './business';



var Lander = thinky.createModel("landers", {
  name: type.string(),
  url: type.string(),
});
Lander.belongsTo(Business, "business", "businessId", "id");

export default Lander;
