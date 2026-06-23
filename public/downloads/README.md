# App download artifacts

The `/download` page serves the Android APKs from this folder. The `.apk`
files are **gitignored** (they're large, per-release build artifacts) — only
this README is tracked so the folder exists in the repo.

On each app release, drop the freshly built, **release-signed** APKs here with
these exact names (the page links to them):

| File | ABI | Audience |
|------|-----|----------|
| `aplus-arm64-v8a.apk`   | arm64-v8a   | Most modern phones (recommended) |
| `aplus-armeabi-v7a.apk` | armeabi-v7a | Older 32-bit devices |
| `aplus-x86_64.apk`      | x86_64      | Emulators / x86 Chromebooks |

Build them with:

```bash
flutter build apk --release --split-per-abi
# then copy build/app/outputs/flutter-apk/app-<abi>-release.apk -> public/downloads/aplus-<abi>.apk
```

The Google Play link and "is the app live on Play yet" flag are configured in
`app/pages/download.vue` (`PLAY_URL` / `PLAY_LIVE`).
