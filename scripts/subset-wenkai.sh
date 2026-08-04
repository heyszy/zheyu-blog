#!/usr/bin/env bash

set -euo pipefail

project_root=$(cd "$(dirname "$0")/.." && pwd)
font_output="$project_root/src/app/fonts/lxgw-wenkai-zheyu.woff2"
font_source_url="https://raw.githubusercontent.com/lxgw/LxgwWenKai/v1.522/fonts/TTF/LXGWWenKai-Regular.ttf"
font_tmp_dir=$(mktemp -d)

cleanup() {
  rm -rf "$font_tmp_dir"
}

trap cleanup EXIT

if [[ "${1:-}" != "" && "${1:-}" != "--check" ]]; then
  echo "Usage: $0 [--check]" >&2
  exit 2
fi

{
  rg --files "$project_root/src" -g '*.ts' -g '*.tsx' -g '*.md' -g '*.mdx' -g '*.css' | LC_ALL=C sort |
    while IFS= read -r source_file; do
      sed -n 'p' "$source_file"
    done
} > "$font_tmp_dir/content.txt"

curl --fail --silent --show-error --location "$font_source_url" --output "$font_tmp_dir/LXGWWenKai-Regular.ttf"
python3 -m venv "$font_tmp_dir/venv"
"$font_tmp_dir/venv/bin/pip" --disable-pip-version-check --quiet install 'fonttools==4.63.0' 'brotli==1.2.0'
"$font_tmp_dir/venv/bin/pyftsubset" "$font_tmp_dir/LXGWWenKai-Regular.ttf" \
  --text-file="$font_tmp_dir/content.txt" \
  --output-file="$font_tmp_dir/lxgw-wenkai-zheyu.woff2" \
  --flavor=woff2 \
  --layout-features='*'

if [[ "${1:-}" == "--check" ]]; then
  if cmp -s "$font_tmp_dir/lxgw-wenkai-zheyu.woff2" "$font_output"; then
    echo "LXGW WenKai subset is current."
    exit 0
  fi

  echo "LXGW WenKai subset is stale. Run: pnpm font:subset" >&2
  exit 1
fi

mv "$font_tmp_dir/lxgw-wenkai-zheyu.woff2" "$font_output"
echo "Updated $font_output"
