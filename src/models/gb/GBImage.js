import { types } from "mobx-state-tree";

export const GBImage = types.model("GBImage", {
  icon_url: types.maybe(types.string),
  medium_url: types.maybe(types.string),
  screen_url: types.maybe(types.string),
  screen_large_url: types.maybe(types.string),
  small_url: types.maybe(types.string),
  super_url: types.maybe(types.string),
  thumb_url: types.maybe(types.string),
  tiny_url: types.maybe(types.string),
  original_url: types.maybe(types.string),
  image_tags: types.maybe(types.string)
});
