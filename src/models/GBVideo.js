import { types } from "mobx-state-tree";
import { GBImage } from "./GBImage";

export const GBVideo = types.model("GBVideo", {
  api_detail_url: types.maybe(types.string),
  deck: types.maybe(types.string),
  hd_url: types.maybe(types.string),
  high_url: types.maybe(types.string),
  low_url: types.maybe(types.string),
  guid: types.maybe(types.string),
  id: types.maybe(types.number),
  length_seconds: types.maybe(types.number),
  name: types.maybe(types.string),
  premium: types.maybe(types.boolean),
  publish_date: types.maybe(types.string),
  site_detail_url: types.maybe(types.string),
  url: types.maybe(types.string),
  image: types.maybe(GBImage),
  user: types.maybe(types.string),
  video_type: types.maybe(types.string),  
  // saved_time: types.maybe(types.string),
});