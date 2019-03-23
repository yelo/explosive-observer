import { types, applySnapshot } from "mobx-state-tree";
import { GBVideo } from "./GBVideo";
import { flow } from "mobx";
import { getAuthData } from "../../utils/DataStorage";
import { getApiEndpoint } from "../../utils/ApiEndpoints";

export const GBVideos = types
  .model("GBVideos", {
    error: types.maybe(types.string),
    limit: types.maybe(types.number),
    offset: types.maybe(types.number),
    number_of_page_results: types.maybe(types.number),
    number_of_total_results: types.maybe(types.number),
    status_code: types.maybe(types.number),
    results: types.optional(types.array(GBVideo), []),
    version: types.maybe(types.string),
  })
  .actions(self => ({
    load: flow(function* load(id, offset = 0, limit = 15) {
      let endpoint = `/videos/?offset=${offset}&limit=${
        self.results.length > 0 ? self.results.length : limit
      }&sort=publish_date:desc&fieldList=name,deck,hd_url,high_url,low_url,guid,publish_date,image,user,length_seconds,url`;
      if (id !== null) {
        endpoint = `${endpoint}&filter=video_show:${id}`;
      }
      getAuthData().then(token => {
        endpoint = getApiEndpoint(endpoint, token.token);
        fetch(endpoint)
          .then(response => response.json())
          .then(videos => applySnapshot(self, videos));
      });
    }),
    fetchNext: flow(function* fetchNext(id, limit = 15) {
      let endpoint = `/videos/?offset=${
        self.results.length
      }&limit=${limit}&sort=publish_date:desc&fieldList=name,deck,hd_url,high_url,low_url,guid,publish_date,image,user,length_seconds,url`;
      if (id !== null) {
        endpoint = `${endpoint}&filter=video_show:${id}`;
      }
      getAuthData().then(token => {
        endpoint = getApiEndpoint(endpoint, token.token);
        fetch(endpoint)
          .then(response => response.json())
          .then(videos => {
            let oldVideos = self.results;
            videos.results = oldVideos.concat(videos.results);
            applySnapshot(self, videos);
          });
      });
    })
  }));
