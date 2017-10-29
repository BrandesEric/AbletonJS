This is a work in progress.  Right now only some of the API surface area of Ableton is exposed.  

You can currently do the following:
- Create tracks
- List tracks
- Change tempo
- Insert clips
- Remove clips
- Insert midi patterns

The plumbing is all here for other things though, I just haven't needed to use them yet.

### How it works
In order to communicate with Ableton we use the Max4Live bridge.  This means you'll need a version of Ableton that supports Max4Live (Suite does for sure, maybe other versions?)

Basically we run a little UDP listener inside ableton, via a Max4Live device (`/device/device.mxd`).  We use TypeScript/Node to send OSC messages to this UDP listener, which will invoke the appropriate commands inside Live.

You don't really need to care about this, as a user you can just import the index file within `/dist` and start calling functions.
