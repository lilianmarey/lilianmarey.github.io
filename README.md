# lilianmarey.github.io

Personal academic website of Lilian Marey, served by GitHub Pages at <https://lilianmarey.github.io>.

Built with Jekyll from the [Academic Pages](https://github.com/academicpages/academicpages.github.io) template, itself a fork of the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme (MIT License, see `LICENSE`).

## Content

| What | Where |
|---|---|
| Home page | `_pages/about.md` |
| CV | `_pages/cv.md` |
| Sidebar, site settings, publication categories | `_config.yml` |
| Top menu | `_data/navigation.yml` |
| Publications | `_publications/*.md` (`category`: `preprints`, `manuscripts`, `conferences` or `workshops`) |
| Talks | `_talks/*.md` (only the year is displayed; talks dated after the last build are marked "upcoming") |
| Teaching | `_teaching/*.md` (`period` is displayed instead of the year when set) |
| Downloadable files (PDFs…) | `files/`, served at `/files/<name>` |

## Running locally

With [Docker](https://www.docker.com/):

```bash
docker compose up
```

Or with Ruby 3.3 (the macOS system Ruby is too old, and the `github-pages` gem does not support Ruby 4):

```bash
brew install ruby@3.3
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve -l -H localhost
```

The site is then available at <http://localhost:4000>.
