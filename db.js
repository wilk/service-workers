(function () {
    'use strict';

    importScripts('./bower_components/pouchdb/dist/pouchdb.js');

    var db;

    self.addEventListener('install', function (event) {
        event.waitUntil(new Promise(function (resolve, reject) {
            db = new PouchDB('serviceWorker');
            db.on('error', function (err) {
                console.error(err);
            });

            resolve(db);
        }));
    });

    self.addEventListener('activate', function (event) {
        event.waitUntil(new Promise(function (resolve, reject) {
            db
                .post({
                    name: 'lol'
                })
                .then(function (result) {
                    console.log(result);
                    resolve(db);
                })
                .catch(function (err) {
                    reject(err);
                });
        }));
    });

    self.addEventListener('message', function (event) {
        console.log('[DB] :: ', event.data);

        /*event.target.clients.matchAll()
            .then(function (clients) {
                clients[0].postMessage('a message from main');
            });*/

        console.log(event.ports[0], event.ports[0].postMessage);

        db.get('B5BD5104-4DCA-F110-A81D-E3F6BBC07EE3')
            .then(function (doc) {
                event.ports[0].postMessage(doc);
            });
    });
})();