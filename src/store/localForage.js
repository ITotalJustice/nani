import localForage from "localforage";

export default {
  init() {
    try {
      let driver = [
        localForage.INDEXEDDB,
        localForage.WEBSQL,
        localForage.LOCALSTORAGE,
      ];
      localForage.config({
        driver,
      });
      return localForage;
    } catch (error) {
      console.error("localForage.config Error: ", error);
    }
  },
};
