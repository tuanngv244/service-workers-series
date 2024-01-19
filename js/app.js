const App = {
  SW: null,
  cacheName: "assetCache",
  init() {
    // if ("serviceWorker" in navigator) {
    //   // logic here
    //   navigator.serviceWorker
    //     .register("/sw.js", {
    //       scope: "/",
    //     })
    //     .then((registration) => {
    //       App.SW =
    //         registration.installing ||
    //         registration.waiting ||
    //         registration.active;
    //       console.log("service workers registered");
    //     });
    //   if (navigator.serviceWorker.controller) {
    //     console.log("we have a service worker installed");
    //   }
    //   // 3. Register a handle to detect when a new or
    //   // updated service worker is installed & activate.
    //   navigator.serviceWorker.oncontrollerchange = (ev) => {
    //     console.log("new service workers activate");
    //   };
    //   // 4. Remove/unregister service workers
    //   // navigator.serviceWorker.getRegistrations().then((registers) => {
    //   //   for (let register of registers) {
    //   //     register
    //   //       .unregister()
    //   //       .then((isUnRegister) => console.log(isUnRegister));
    //   //   }
    //   // });
    //   // 5. Listen for messages from the service workers
    // } else {
    //   console.log("Service workers are not defined!");
    // }
    App.startCaching();

    // Handle delete cache
    function handleCacheDelete() {
      const button = document.getElementById("btn-delete-cache");
      button.addEventListener("click", () => {
        App.deleteCache();
      });
    }

    handleCacheDelete();
  },
  startCaching() {
    //open a cache and save some responses
    return caches
      .open(App.cacheName)
      .then((cache) => {
        console.log(`Cache ${App.cacheName} opened!`);

        let urlString = "/img/img-room.jpg?id=one";
        cache.add(urlString); // add = fetch + put

        let url = new URL("http://127.0.0.1:5500/img/img-room.jpg?id=two");
        cache.add(url);

        let req = new Request("/img/img-room.jpg?id=three");
        cache.add(req);

        cache.keys().then((keys) => {
          keys.forEach((key, index) => {
            // console.log(index, key);
          });
        });

        return cache;
      })
      .then((cache) => {
        // check if a cache exists
        caches.has(App.cacheName).then((hasCache) => {
          // console.log(`${App.cacheName} ${hasCache}`);
        });

        // search for files in caches
        // cache.match() cache.matchAll()
        // caches.match() - look in all caches
        let urlString = "/img/img-room.jpg?id=one";
        caches
          .match(urlString)
          .then((cacheRes) => {
            if (
              cacheRes &&
              cacheRes.status <= 400 &&
              cacheRes.headers.get("content-type") &&
              cacheRes.headers.get("content-type").match(/^image\//i)
            ) {
              // not an error if not found
              console.log("cacheRes", cacheRes);
              return cacheRes;
            } else {
              // no match found
              console.log("no match cache");
              return fetch(urlString).then((fetchRes) => {
                if (!fetchRes.ok) throw fetchRes.statusText;

                //we have a valid fetch
                cache.put(urlString, fetchRes.clone());
                return fetchRes;
              });
            }
          })
          .then((res) => {
            console.log(res);
            const output = document.getElementById("img-output");
            output.innerText = res.url;
            return res.blob();
          })
          .then((blob) => {
            let url = URL.createObjectURL(blob);
            let img = document.createElement("img");
            img.src = url;
            img.style.width = 300 + "px";
            img.style.height = 400 + "px";
            img.style.marginTop = 50 + "px";
            document.getElementById("img-output").append(img);
          });
      });
  },
  deleteCache() {
    // delete single cache.
    caches.open(App.cacheName).then((cache) => {
      const input = document.getElementById("img-url");

      cache.delete(input.value).then((isGone) => {
        console.log(isGone);
      });
    });

    // delete all cache.
    caches.delete(App.cacheName).then((isGone) => {
      console.log(isGone);
    });
  },
};

document.addEventListener("DOMContentLoaded", App.init);
