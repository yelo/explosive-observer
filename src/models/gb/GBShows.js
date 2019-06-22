import { types, flow, applySnapshot } from "mobx-state-tree";
import { getAuthData, getFavoriteShows } from "../../utils/DataStorage";
import { getApiEndpoint } from "../../utils/ApiEndpoints";
import { GBShow } from "./GBShow";

export const GBShows = types
  .model("GBShows", {
    error: types.maybeNull(types.string),
    limit: types.maybeNull(types.number),
    offset: 0,
    number_of_page_results: types.maybeNull(types.number),
    number_of_total_results: types.maybeNull(types.number),
    status_code: types.maybeNull(types.number),
    results: types.optional(types.array(GBShow), []),
    version: types.maybeNull(types.string),
    page: 0,
  })
  .actions(self => ({
    load: flow(function* load() {
      getAuthData().then(token => {
        const endpoint = getApiEndpoint(
          `/video_shows/?field_list=title,image,deck,id&sort=title:asc&offset=0`,
          token.token
        );
        fetch(endpoint)
          .then(response => response.json())
          .then(shows => {
            getFavoriteShows().then(favorites => {
              if (favorites) {
                shows.results.forEach(s => {
                  s.isFavorite = favorites.indexOf(s.id) >= 0;
                });
              }
              applySnapshot(self, shows)
            });
          });
      });
    }),
  }))
  .views(self => {
    function favorites() {
      return self.results.filter(s => s.isFavorite);
    }
    function all() {
      return self.results.filter(s => !s.isFavorite);
    }

    return {
      get favorites() {
        return favorites();
      },
      get all() {
        return all();
      }
    };
  });
