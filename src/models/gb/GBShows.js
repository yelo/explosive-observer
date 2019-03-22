import { types, flow, applySnapshot } from "mobx-state-tree";
import { getAuthData, getFavoriteShows } from "../../utils/DataStorage";
import { getApiEndpoint } from "../../utils/ApiEndpoints";
import { GBShow } from "./GBShow";

export const GBShows = types
  .model("GBShows", {
    error: types.maybe(types.string),
    limit: types.maybe(types.number),
    offset: 0,
    number_of_page_results: types.maybe(types.number),
    number_of_total_results: types.maybe(types.number),
    status_code: types.maybe(types.number),
    results: types.optional(types.array(GBShow), []),
    version: types.maybe(types.string)
  })
  .actions(self => ({
    load: flow(function* load(favs, offset = 0) {
      getAuthData().then(token => {
        const endpoint = getApiEndpoint(
          `/video_shows/?field_list=title,image,deck,id&sort=title:asc&offset=${offset}`,
          token.token
        );
        fetch(endpoint)
          .then(response => response.json())
          .then(shows => {
            shows.results.forEach(s => {
              s.isFavorite = favs.indexOf(s.id) >= 0;
            });
            applySnapshot(self, shows)
          });
      });
    }),
  }))
  .views(self => {
    function favorites(favs) {
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
