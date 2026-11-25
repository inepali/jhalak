# Menu Display for Samsung TV (Tizen)

A small Tizen web app that puts the Menu Display menu board
(`https://jhalak.app/cast`) full screen on a Samsung Smart TV.

> Branch `Samsung`. The Fire TV / Android app (React Native) lives on
> `menu-display` and `main`.

## How it works

`app/index.html` + `app/js/main.js` run once at launch:

1. Turn the TV screensaver off (`webapis.appcommon.setScreenSaver`).
2. Check the site is reachable. If not, show a "Can't reach Menu Display"
   screen and retry (5 s, backing off to 60 s, and immediately when the
   network comes back).
3. Open `/cast` as the app's page. From there the site does everything:
   pairing (saved in localStorage), menu rotation, offline media cache, and
   background music through its own `<audio>` element.

The Fire TV app needed a native audio player because Android WebView blocks
autoplay. Tizen apps can autoplay, so that bridge (`window.backgroundAudioUrl`
+ `react-native-video`) is gone.

Remote: **Return** on the launcher screen exits the app; **Exit/Home** always
work.

## Layout

```
app/            the Tizen project (this folder is what gets packaged)
  config.xml    app ID, name, icon, privileges, allowed hosts
  index.html    launcher screen
  js/main.js    launch logic (ES5, runs on 2015+ TVs)
  css/style.css
  icon.png      512x512 launcher icon
scripts/
  check.sh      validate without the Tizen SDK
  package.sh    build + sign dist/MenuDisplay.wgt
  install.sh    install + launch on a TV
```

App ID `MnuDspTV01.MenuDisplay`. Keep the package ID `MnuDspTV01` for every
release so TVs update the app in place.

## One-time setup

1. Install **Tizen Studio** (with CLI) and, in Package Manager, the
   **Samsung TV Extensions** and **Samsung Certificate Extension**.
   Add `<tizen-studio>/tools/ide/bin` and `<tizen-studio>/tools` to `PATH`
   (for `tizen` and `sdb`).
2. In **Certificate Manager**, create a **Samsung** certificate profile named
   `MenuDisplay` (sign in with a Samsung account). Add your TV's DUID to the
   distributor certificate. A plain Tizen certificate won't install on retail
   TVs.
3. On the TV: **Apps** → press `1 2 3 4 5` on the remote → turn
   **Developer mode** on and enter your computer's IP → restart the TV.

## Build and install

```sh
npm run check                 # sanity checks, no SDK needed
npm run package               # -> dist/MenuDisplay.wgt (TIZEN_PROFILE=MenuDisplay)
npm run tv -- 192.168.1.50    # install + launch on the TV
```

You can also open `app/` in Tizen Studio (File → Import → Tizen → Tizen
Project) and Run As → Tizen Web Application.

## Changing the site URL

Edit `DISPLAY_URL` / `PING_URL` in `app/js/main.js` and the
`<tizen:allow-navigation>` host in `app/config.xml`.
