import { types, applySnapshot } from "mobx-state-tree";
import { GBImage } from "./GBImage";
import {
  addShowToFavorites,
  removeShowFromFavorites,
  getFavoriteShows
} from "../../utils/DataStorage";

export const GBShow = types
  .model("GBShow", {
    deck: types.maybeNull(types.string),
    id: types.maybeNull(types.number),
    title: types.maybeNull(types.string),
    image: types.maybeNull(GBImage),
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
