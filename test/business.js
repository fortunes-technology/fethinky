/*eslint-env node*/
import thinky , { type } from "./thinky";


const Business = thinky.createModel("businesses", {
  name: type.string(),
  website: type.string(),
});

export default Business;
