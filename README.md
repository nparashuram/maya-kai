# Maya-Kai ( மாய கை )

A way to mirror gestures and user interactions in ReactNative applications.
Useful for testing apps on devices with different screen sizes at the same time - just interact with one device and all other devices follow the interactions.
Can also be used for recording and then replaying user interactions.

ReactNative uses React's EventPluginHub and this module adds an additional plugin to listen to events and send them to a server. The server broadcasts these events to all other connected clients, enabling mirroring of gestures.

## Usage
1. Install the package using `npm install maya-kai` inside your ReactNative applications

2. _Server _- Start the server at port 8082 using `node_modules/.bin/maya-kai-server`.  Note that this server should be accessible to the device and you may need to do `adb reverse tcp:8082 tcp:8082` for Android.

3. _Client_ - Import and start this module in the ReactNative application's start file - like `index.ios.js` or `index.android.js` using
```javascript
import MK from 'maya-kai';
MK.start();
```

4. Start the ReactNative application on multiple devices. The application should now be able to connect to the server and start sending events.


### API / Options
__Server__

By default the server starts on __localhost__ on port __8082__, this can be changed by using the `-p|--port` and `-s|--server` options:

```
node_modules/.bin/maya-kai-server -s myserver.com -p 8088
```

__Client__

If the server is started on a different server or port, it can be passed to the ReactNative application using

```javascript
import MK from 'maya-kai';
MK.start('myserver.com:8088').then(successCallback, errorCallback)
```

## Troubleshooting
If you see a "_Yellow BOX_" warning on the ReactNative application, it means that the app was not able to connect to the Maya-Kai server. Check if you have run `adb reverse`, or are able to access the server URL from a browser on the device.

Note that gesture sync between iOS and Android may be buggy since the internal implementation may not always create the exact Object tree and elements may not be present on one of the platforms.

## Utilities
This modules comes with a set of utilities

### Record/Replay
This is a client that lets you record and play back the gestures at a later time. To run this, start the server, add the client code to as described in the usage section. Start the ReactNative app.
Then run `node_modules/src/clients/record.js [_actions.log]`. Perform actions on the ReactNative app and once you are done, hit `Ctrl+C` on the `record.js` process.

Then reload the ReactNative app and run `node_modules/src/clients/replay.js [_actions.log]`. The replay process will read the actions and send them back to the application.

### Delayed Echo
The echo client listens to events, and send them back to the same app after a 5 second delay. Can be used to test actions like counters, etc. Typically useful to see if the setup works.
