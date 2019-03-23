import { types } from "mobx-state-tree";

export const GBImage = types.model("GBImage", {
  icon_url: types.maybeNull(types.string),
  medium_url: types.maybeNull(types.string),
  screen_url: types.maybeNull(types.string),
  screen_large_url: types.maybeNull(types.string),
  small_url: types.maybeNull(types.string),
  super_url: types.maybeNull(types.string),
  thumb_url: types.maybeNull(types.string),
  tiny_url: types.maybeNull(types.string),
  original_url: types.maybeNull(types.string),
  image_tags: types.maybeNull(types.string)
});
