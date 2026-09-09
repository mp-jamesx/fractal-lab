# Fractal Lab

A local visual workspace with a left sidebar for **Moodboards** and **Experiments**. Moodboards includes image galleries, clipboard and drag-and-drop imports, and agent-readable image tags. Personal boards stay on your computer; the repository contains only the reusable app and documentation.

## Run locally

```sh
cd fractal-lab
npm ci
npm run dev
```

Run these commands from your cloned project directory. Use Node.js 22.12+ (or a newer supported LTS release) and npm. Open http://127.0.0.1:8765. Stop with Ctrl+C.

On first startup, the app creates an empty `catalog.json` and `images/inbox/`. Existing libraries are preserved. Click the + tile to create your first board. After installing dependencies, normally just run `npm run dev`.

Click a moodboard to see its images, then click an image to enlarge it. Use Previous/Next or arrow keys to move between images; Escape closes the viewer. Open original shows the full-resolution file.

## Add boards and images

- Click the **+ New moodboard** tile on the home page, enter a name, and click **Create moodboard**. This creates a folder under `images/` and updates `catalog.json`.
- Open a moodboard and press **Cmd+V** with an image on the clipboard, or drag one or more image files anywhere onto the board. Files save automatically to that board's folder; the gallery updates immediately.
- Supported formats: PNG, JPEG, WebP, GIF, and AVIF, up to 50 MB per image. Clipboard image data is supported; pasting an image URL alone does not download it.
- Unique filenames prevent overwriting existing images. Failures appear above the images; successful clipboard and library actions are silent.
- Press **Cmd+Z** (or Ctrl+Z) to undo the most recent successful paste/drop batch on the current board. Undo removes those added files from disk. The last 50 addition batches per board are tracked in the current tab until reload; native undo still works in text fields.
- Right-click an image and choose **Delete**, or use the trash icon in its top-right corner on hover. Keyboard focus also reveals the trash button; Shift+F10 opens the menu. Touch devices always show the trash button.
- Delete removes the original file, its tags, and all catalog references, including membership in other boards sharing the same file. Deletions are permanent; Cmd+Z currently undoes additions, not deletions.
- Edit `catalog.json` for descriptions, source URLs, and board membership; edit the image folder’s `tags.json` for tags. Refresh or return focus to the app after manual edits.

## Select and transfer images

- Hold **Shift** and click images to select them; Shift-click again to deselect. Selections stay active as you navigate between moodboards, so one selection can include images from several boards.
- The bottom toolbar shows the selected count, a scrollable thumbnail for every selected image, and **Delete**, **Copy**, and **Cut** actions. Clear it with **Escape** or the × button.
- **Cmd+Shift+C** prepares a copy; **Cmd+Shift+X** prepares a cut. Open the destination moodboard and press **Cmd+Shift+V** to paste. Successful paste clears the selection and toolbar. Ctrl works instead of Cmd on other platforms.
- Copies create independent image files and preserve their tags and metadata. Cuts move files only when pasted, removing membership from the source boards you selected while preserving any other shared memberships. Changing the selection cancels the prepared transfer.
- **Cmd+Delete** deletes the entire selection from disk and all boards sharing those originals. Copy/cut selections are internal to the current browser tab and do not survive a reload. Copied additions support Cmd+Z; cuts and deletions do not.

## Implementation

- React and Vite, with the npm package `@mirror-physics/fractal-ui` (currently 0.1.2).
- Fractal's shipped components, tokens, and locally bundled fonts; monochrome UI accents. Images retain their original colors.
- Image-rich board tiles compose `Card` with a destination link because the published `FolderCard` does not accept a preview slot and labels counts as sessions. The viewer uses `Modal`, augmented with dialog semantics, focus trapping, focus restoration, and background inertness because v0.1.2 does not provide those behaviors.
- The installed Fractal 0.1.2 dropdown has no controlled context-menu API. `src/ImageContextMenu.jsx` supplies a portal menu with Fractal styling and the Fractal Trash icon, keyboard focus, Escape/outside dismissal, and viewport positioning.
- `src/`: gallery source. `vite.config.js`: serves the catalog and original images directly, keeping them out of build output. `server/library.js`: local write API shared by development and preview servers, with serialized catalog updates and atomic file replacement.
- `images/`, `cache/`, `node_modules/`, and build output are excluded from Git.

## Build

```sh
npm run build
npm run preview
```

Preview includes the same local save API. The optional `python3 serve.py` launcher also starts this preview server. Stop the dev server first. Pass `--port 8766` to the Python server to use another port.

Both servers listen only on your computer. No cloud storage or image uploads are configured. Include images in your normal backup: GitHub will not contain your catalog, tags, or images.

## Validation

`npm test` checks local folder creation, concurrent uploads, byte preservation, duplicate names, deletion, cross-board copy/cut, tag and membership preservation, and invalid requests in temporary folders.

## Tagging references (for agents)

Each moodboard folder contains `tags.json`, the authoritative map from **image filename** to **an array of tags**:

```json
{
  "01-molecular-contours.png": ["molecular", "3d rendering", "palette: orange", "palette: black", "signal: scientific", "structure: contour lines"]
}
```

- Read images before tagging. Use concise lowercase phrases describing visible subjects, medium, palette, composition, texture, typography, and useful reference qualities. Avoid claims about creators or provenance unless known.
- Use the exact filename as the key. Preserve other entries when editing. Empty arrays mean **not tagged yet**.
- New boards start with `{}`. Pasting or dropping an image adds its filename with `[]`; automatic AI tagging is not configured. Ask the agent to review and tag new references.
- `tags.json` lives beside the original file, including for an image referenced by multiple boards. All boards display that same image's tags.
- Tags render below each image and in the enlarged viewer. Refresh or refocus the app after editing a tag file.
- Do not duplicate tags in `catalog.json`. Its HTTP response combines the catalog with folder-local tags for the app; the on-disk catalog holds paths and other metadata only.
- `tags.json` files are private library data and are ignored with the entire `images/` directory.

### Required tagging dimensions

For every reviewed image, include all four dimensions. Keep the filename-to-array format:

- **General:** unprefixed subject and medium tags, e.g. `biology`, `graphic design`, `3d rendering`.
- **Palette:** `palette: <color>` for the dominant colors and defining accents of the scheme. Include meaningful background colors; ignore minor pixel variations. Prefer color names over speculative hex values.
- **Signal:** `signal: <quality>` for the visual character conveyed, e.g. `scientific`, `archival`, `energetic`, `restrained`. These are visual interpretations, not claims about origin or scientific meaning.
- **Structure:** `structure: <feature>` for composition and form, e.g. `connected nodes`, `layered contour lines`, `asymmetric composition`.

Inspect new images before tagging, preserve other entries, and use consistent phrases across the library. The app displays a single horizontally scrollable tag row: general tags are neutral, palette tags blue, signal tags orange, and structure tags purple. Category names remain in tooltips and accessible labels. Tags scroll manually with a trackpad, touch, or keyboard; scrollbars are hidden and hovering does not move them. Image cells form a gapless grid with shared borders. Empty arrays still mean unreviewed.

## What belongs in Git

Commit `.gitignore`, `AGENTS.md`, `README.md`, `package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `serve.py`, `src/`, and `server/` (including tests).

The ignore rules exclude all personal boards: `images/` including every `tags.json`, `catalog.json`, and `cache/`. Dependencies, build output, logs, and local environment files are also ignored. No image placeholders or personal catalog are needed for a fresh clone.

Keep a separate backup of your local library. To move a library between your own machines, copy `catalog.json` and `images/` together outside Git. Do not force-add these paths to the repository.

Deletion validation covers actual file removal, shared-board records, tag preservation, symlink/traversal rejection, concurrent uploads/deletes, and metadata rollback on unlink failure. Paste → Cmd+Z, context-menu deletion, and the hover delete button were also verified in an isolated temporary library with synthetic images.

## Experiments section

Experiments lives inside this repository at `experiments/`. Open the Experiments tab to browse the three live Three.js/p5.js collections. The Lab server serves `experiments/dist-lab` under `/lab-experiments/`; no second server or external project path is needed.

After cloning, run `npm ci` in the repository root and `npm ci --prefix experiments`, then `npm run dev`. Development and production builds run `npm run build:experiments` first. After changing experiment code, run that command again and reopen the Experiments tab. Standalone development remains available with `npm run dev --prefix experiments` on port 8770.

Commit experiment source, small source SVGs, coordinate JSON, documentation, and dependency manifests. Keep large personal media in `experiments/assets/` or `experiments/public/`; both directories are ignored, along with experiment dependencies, build output, caches, and exports. Vite copies `public/` to the build for local serving. Use its configured base path when referencing those files. A new clone needs a separate local copy of any personal assets it uses.

Empty library, empty board, missing board, and loading/error views share a local composition using the existing Mirror M outlines and Fractal typography, spacing, and semantic colors. Empty boards support choosing images as well as dropping or pasting them.
