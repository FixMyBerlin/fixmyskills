# Set up the Tailwind Plus workspace

One-time per machine. The skill looks in `$TAILWIND_PLUS_DIR`, falling back to
`~/Development/_tailwind`.

The workspace is the private repo
[tordans/tailwind-plus](https://github.com/tordans/tailwind-plus). It already
holds the downloaded and migrated catalog, so no Tailwind Plus login is needed.

1. Check access: `gh repo view tordans/tailwind-plus`. No access → stop and
   tell the user to ask Tobias for it.
2. Ask the user where to put it. Default: `~/Development/_tailwind`.
3. Clone:

   ```bash
   git clone https://github.com/tordans/tailwind-plus.git "$HOME/Development/_tailwind" # or the chosen path
   ```

4. Another location: tell the user to add this to their shell profile
   (`~/.zshrc`) and open a new shell:

   ```bash
   export TAILWIND_PLUS_DIR="/path/to/tailwind-plus"
   ```

Update later with `git -C "$TW_DIR" pull`. Downloading new components from
Tailwind Plus is the maintainer's job; see `docs/downloading.md` in the repo.
