import { types, applySnapshot } from "mobx-state-tree";
import { GBImage } from "./GBImage";

export const GBVideo = types
  .model("GBVideo", {
    api_detail_url: types.maybeNull(types.string),
    deck: types.maybeNull(types.string),
    hd_url: types.maybeNull(types.string),
    high_url: types.maybeNull(types.string),
    low_url: types.maybeNull(types.string),
    guid: types.maybeNull(types.string),
    id: types.maybeNull(types.number),
    length_seconds: types.maybeNull(types.number),
    name: types.maybeNull(types.string),
    premium: types.maybeNull(types.boolean),
    publish_date: types.maybeNull(types.string),
    site_detail_url: types.maybeNull(types.string),
    url: types.maybeNull(types.string),
    image: types.maybeNull(GBImage),
    user: types.maybeNull(types.string),
    video_type: types.maybeNull(types.string),
    saved_time: types.maybeNull(types.string)
  })
  .actions(self => ({
    updateSavedTime(time) {
      self.saved_time = time.toString();
      applySnapshot(self, self);
    }
  }));
