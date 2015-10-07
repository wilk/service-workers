(function () {
    'use strict';

    var swRegistration;

    function sendMessage (message) {
        // This wraps the message posting/response in a promise, which will
        // resolve if the response doesn't contain an error, and reject with
        // the error if it does. If you'd prefer, it's possible to call
        // controller.postMessage() and set up the onmessage handler
        // independently of a promise, but this is a convenient wrapper.
        return new Promise(function(resolve, reject) {
            var messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = function(event) {
                if (event.data.error) reject(event.data.error);
                else resolve(event.data);

                swRegistration.unregister();
            };

            // This sends the message data as well as transferring
            // messageChannel.port2 to the service worker.
            // The service worker can then use the transferred port to reply
            // via postMessage(), which will in turn trigger the onmessage
            // handler on messageChannel.port1.
            // See
            // https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
            console.log(swRegistration, navigator.serviceWorker);
            swRegistration.active.postMessage(message, [messageChannel.port2]);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        navigator.serviceWorker.register('db.js')
            /*.then(function (registration) {
                if (registration.installing) {
                    console.log('db worker is installing');
                }
                else if (registration.waiting) {
                    console.log('db worker is installed and waiting');
                }
                else if (registration.active) {
                    console.log('db worker is active');
                }

                swRegistration = registration;

                return navigator.serviceWorker.ready;
            })*/
            //.then(navigator.serviceWorker.ready)
            .then(function (registration) {
                registration.installing.addEventListener('statechange', function (event) {
                    if (event.target.state === 'activated') {
                        sendMessage('a message from main')
                            .then(function (message) {
                                console.log('MAIN :: ', message);
                            })
                            .catch(function (err) {
                                console.error(err);
                                swRegistration.unregister();
                            });
                    }
                });

                console.log(registration);
                swRegistration = registration;
            })
            .catch(function (err) {
                console.error(err);
                swRegistration.unregister();
            });
    });
})();