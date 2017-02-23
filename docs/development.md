# Troubleshooting

## Error while starting mqtt-broker (which depends on robotjs)

```
Electron  A JavaScript error occurred in the main process
    Uncaught Exception:
    Error: Module version mismatch. Expected 50, got 48.
```

## Solution

Rebuild package with proper target

```bash
cd services/mqtt-broker/
npm rebuild --runtime=electron --target=1.4.15 --disturl=https://atom.io/download/atom-shell --abi=48
```

## References

* <https://github.com/octalmage/robotjs/wiki/Electron>
* <https://github.com/mapbox/node-pre-gyp/blob/master/lib/util/abi_crosswalk.json>
