# fethinky



1. Create a service using Thinky Model


var thinky = require("thinky")({
  host: process.env.RETHINK_HOST || "docker",
  db: "tests"
});

const Business = thinky.createModel("businesses", {
  name: type.string(),
  website: type.string(),
});

import base from "./feathers-base";
import errors from "feathers-errors";
import service from "../src";
import Business from "./business";
import Lander from "./lander";

let _ids = {};
let business = service({
  model: Business
});

