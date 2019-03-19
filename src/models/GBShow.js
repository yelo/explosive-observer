import { types, applySnapshot } from "mobx-state-tree";
import { GBImage } from "./GBImage";

export const GBShow = types
  .model("GBShow", {
    deck: types.maybe(types.string),
    id: types.maybe(types.number),
    title: types.maybe(types.string),
    image: types.maybe(GBImage),
    isFavorite: false
  })
  .actions(self => ({
    toggleFavorite() {
      self.isFavorite = !self.isFavorite;
      applySnapshot(self, self);
    }
  }));
