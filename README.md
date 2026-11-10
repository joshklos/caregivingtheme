# Caregiving Edition

A caregiving-focused newsletter theme for [Ghost](https://github.com/TryGhost/Ghost), adapted from Ghost's [Edition](https://github.com/TryGhost/Edition) theme.

# Instructions

1. Build the theme zip with `pnpm zip` (see below)
2. Log into Ghost, and go to the `Design` settings area to upload `dist/caregiving-edition.zip`

# Development

Caregiving Edition styles are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [pnpm](https://pnpm.io/) and [Gulp](https://gulpjs.com) installed globally. After that, from the theme's root directory:

```bash
# Install
pnpm install

# Run build & watch for changes
pnpm dev
```

Now you can edit `/assets/css/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/caregiving-edition.zip`, which you can then upload to your site.

```bash
pnpm zip
```

## Theme translations

Please see the @Tryghost/Themes/theme-translations/README.md for how to edit or contribute translations.

# Copyright & License

Copyright (c) 2013-2026 Ghost Foundation - Released under the [MIT license](LICENSE).
