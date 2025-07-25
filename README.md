# Reality Check
Just for those of you who might be concerned about the Climate Change, here are couple of sobering insights:
- Neil deGrasse Tyson's perspective on climate change: [YouTube Video](https://www.youtube.com/watch?v=tRA2SfSk2Tc)
- My perspective, with statements from two AI entities: [Climate Change](https://githubdragonfly.github.io/viewers/templates/Climate%20Change.txt)

# Localized and optionally customized three.js

IF, for whatever reason, you might need to locally run the [three.js](https://github.com/mrdoob/three.js/) Editor and Examples (Docs) then here is a possible way of doing it with python.

Note: this repository also provides optional customized files which can provide additional functionality currently not available in the Editor. These files should be implemented as either `all` or `none`. Also try using only some of these files but don't get surprised if eventually something doesn't work properly.

Maybe consider learning how to modify these files yourself since three.js might implement some features in the future that would not be available in the current optional files or might even break their functionality. This was tested as working with r158 (even r159dev).

# Requirements

`Required repository` - download and extract the zip file from:
- `master` or `dev` branch or `releases` of the [three.js](https://github.com/mrdoob/three.js/), which when unzipped will create the `main folder`
  - Possible `main folder` definitions could then be:
    - `three.js-master` or `three.js-dev` or `three.js-rXXX` or some custom name

The simplest requirement and approach for running:

- [python3](https://www.python.org/downloads/)
  - get the `Required Repository` as stated above and unzip it to create the `main folder`
  - add to the `main folder` the `index.html` file found in the `Required` folder of this repository
  - use Terminal / Command Prompt, navigate to the `main folder` and run either of the following commands:
    - `python3 -m http.server` or `python3 -m http.server 8000 --bind 127.0.0.1`
  - access the main page in your browser at `http://localhost:8000`
  - if you decide to use the optional customized files then read below on how to install all of them

As an alternative, either of the following 2 choices below should also work:

- `python` + `Flask` and `flask_cors` packages
- `VS Code` + `python` extension (from Microsoft Store) + `Flask` and `flask_cors` packages

Packages are normally installed with `pip`, for example: `> pip install Flask` or `> pip install flask_cors`

# Flask Folder Structure

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
| 3DMLoader.js (file) | main folder/examples/jsm/loaders/ |
| BIMLoader.js (file) | main folder/examples/jsm/loaders/ |
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
| 3DMExporter.js (file) | main folder/examples/jsm/exporters/ |
| OBJExporter.js (file) | main folder/examples/jsm/exporters/ |
| PLYExporter.js (file) | main folder/examples/jsm/exporters/ |
| USDZExporter.js (file) | main folder/examples/jsm/exporters/ |
| ColladaExporter.js (file) | main folder/examples/jsm/exporters/ |
| chevrotain.module.min.js (file) | main folder/examples/jsm/libs/ |

`Optional repository` - download and extract the zip file from:
- [ldraw-parts-library](https://github.com/gkjohnson/ldraw-parts-library) for local LDRAW support, which when unzipped will create the `ldraw-parts-library-master` folder mentioned above

Customized features would be mainly Editor related:

- Automatic addition of `DirectionalLight` to the new scene
- Customized PDB, PRWM, LDRAW and XYZ loaders
- Unofficial BIM loader ([dotbim](https://github.com/ricaun/dotbim.three.js) based)
- Customized 3DM loader / exporter:
  - exporter is unofficial and can export textured meshes, points and line segments
  - loader has been modified to support the above mentioned exported 3dm files
- Customized USDZ loader / exporter:
  - can approximate transmission effect
  - `USDZ (flipY)` as an additional menu export option that can flip exported textures
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
- Added support for loading `USDZ` zipped file
- Added support for loading `3DS + textures` zipped files
- Added support for loading `FBX + textures` zipped files
- Added support for loading `OBJ + MTL + textures` zipped files
- Added support for loading `GLTF + BIN + textures` zipped files
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
