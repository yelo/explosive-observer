import { types, applySnapshot } from "mobx-state-tree";
import { GBImage } from "./GBImage";
import {
  addShowToFavorites,
  removeShowFromFavorites
} from "../../utils/DataStorage";

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
      if (self.isFavorite) {
        addShowToFavorites(self.id).then(() => {
          applySnapshot(self, self);
        });
      } else {
        removeShowFromFavorites(self.id).then(() => {
          applySnapshot(self, self);
        });
      }
    }
  }));
