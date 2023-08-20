# Localized and optionally customized three.js

IF, for whatever reason, you might need to locally run the [three.js](https://github.com/mrdoob/three.js/) Editor and Examples (Docs) then here is a possible way of doing it with python.

Note: this repository also provides optional customized files which can provide additional functionality currently not available in the Editor. These files should be implemented as either `all` or `none`. You could also try using only some of these files but don't get surprised if eventually something doesn't work properly.

# Requirements

`Required repository` - download and extract the zip file from:
- `master` or `dev` branch or `releases` of the [three.js](https://github.com/mrdoob/three.js/), which when unzipped will create the `main folder`
  - Possible `main folder` definitions could then be:
    - `three.js-master` or `three.js-dev` or `three.js-rXXX` or some custom name

The simplest requirement and approach for running:

- [python3](https://www.python.org/downloads/)
  - get the `Required Repository` as stated above and unzipp it to create the `main folder`
  - add to the `main folder` the `index.html` file found in the `Required` folder of this repository
  - use Terminal / Command Prompt, navigate to the `main folder` and run either of the following commands:
    - `python3 -m http.server` or `python3 -m http.server 8000 --bind 127.0.0.1`
  - access the main page in your browser at `http://localhost:8000`
  - if you decide to use the optional customized files then read below on how to install all of them

As an alternative, either of the following 2 choices below should also work:

- `python` + `Flask` and `flask_cors` packages
- `VS Code` + `python` extension (from Microsoft Store) + `Flask` and `flask_cors` packages

Packages are normally installed with `pip`, for example: `> pip install Flask` or `> pip install flask_cors`

# Folder Structure

- Required files for python / Flask run (add each file to the `main folder`):

  - `app.py`
  - `__init__.py`
  - `index.html`
  - `404.html`

- To run the Flask server:
  - navigate to the `main folder` in terminal and type `python -m app`
  - or open the `app.py` file in VS Code, wait for it to find python interpreters and press `F5`
  - In the browser go to `http://localhost:5000` to see the page

I would recommend using VS Code since it allows to start / stop the server and edit files, all in one app.

## Optional Custom Mods (use all or none)

These files / folders should be placed in their corresponding folder and replace any existing files:

| file / folder | destination |
|      :--      |     :--     |
| sw.js (file) | main folder/editor/ |
| Strings.js (file) | main folder/editor/js/ |
| Loader.js (file) | main folder/editor/js/ |
| Editor.js (file) | main folder/editor/js/ |
| Menubar.File.js (file) | main folder/editor/js/ |
| ui.three.js (file) | main folder/editor/js/libs/ |
| ColladaLoader.js (file) | main folder/examples/jsm/loaders/ |
| FBXLoader.js (file) | main folder/examples/jsm/loaders/ |
| IFCLoader.js (file) | main folder/examples/jsm/loaders/ |
| IFCLoader.js.map (file) | main folder/examples/jsm/loaders/ |
| ifc (folder) | main folder/examples/jsm/loaders/ |
| MTLLoader.js (file) | main folder/examples/jsm/loaders/ |
| USDZLoader.js (file) | main folder/examples/jsm/loaders/ |
| XYZLoader.js (file) | main folder/examples/jsm/loaders/ |
| LDRAWLoader.js (file) | main folder/examples/jsm/loaders/ |
| ldraw-parts-library-master (folder) | main folder/editor/ |
| PRWMLoader.js (file) | main folder/examples/jsm/loaders/ |
| OBJExporter.js (file) | main folder/examples/jsm/exporters/ |
| PLYExporter.js (file) | main folder/examples/jsm/exporters/ |
| ColladaExporter.js (file) | main folder/examples/jsm/exporters/ |
| chevrotain.module.min.js (file) | main folder/examples/jsm/libs/ |

`Optional repository` - download and extract the zip file from:
- [ldraw-parts-library](https://github.com/gkjohnson/ldraw-parts-library) for local LDRAW support, which when unzipped will create the `ldraw-parts-library-master` folder mentioned above

Customized features would be mainly Editor related:

- Automatic addition of `DirectionalLight` to the new scene
- Customized PDB, PRWM, LDRAW, USDZ and XYZ loaders
- Localized IFC loader
- Customized OBJ exporter:
  - it will export MTL file along with the OBJ model / textures
- Customized MTL loader to support the above mentioned exported MTL file
- Customized PLY exporter:
  - converts material color to vertex color if the material has no texture
- Customized DAE (Collada) loader:
  - includes support for THREE.Points
- Customized FBX loader:
  - includes support for THREE.Points
- Added DAE (Collada) exporter, which was officially removed
- Added support for loading `3DS + textures` zipped files
- Added support for loading `OBJ + MTL + textures` zipped files
- Added support for loading `DAE (Collada) + textures` zipped files
- modified `ui.three.js` file allows using DDS and KTX2 images as maps
- modified `chevrotain.module.min.js` fixes the `unreachable code` warnings

There might be bugs.

# Mozilla Firefox screenshot

Main Menu Page
![Start Page](screenshot/Localized%203js.png?raw=true)

# License

This is all MIT licensed but please observe any other licenses that might be applicable to some files or content.

# Trademarks

Any and all trademarks, either directly or indirectly mentioned in this project, belong to their respective owners.
