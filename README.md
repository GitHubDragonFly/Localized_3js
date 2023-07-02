# Localized and optionally customized three.js

IF, for whatever reason, you might need to locally run the [three.js](https://github.com/mrdoob/three.js/) Editor or Examples (Docs) then here is a possible way of doing it with python.

Note: Custom modified files are optional and should be implemented as either `all` or `none`. Try to read the whole description so you don't miss anything.

# Requirements

Either of the below should work:

- `python` + `Flask` and `flask_cors` packages
- `VS Code` + `python` extension (from Microsoft Store) + `Flask` and `flask_cors` packages

Packages are normally installed with `pip`, for example: `> pip install Flask`

Required repository - download and extract the zip file from:

- `master` or `dev` branch or `releases` of the [three.js](https://github.com/mrdoob/three.js/), which when unzipped will create the `main folder`

Optional repository - download and extract the zip file from:

- [ldraw-parts-library](https://github.com/gkjohnson/ldraw-parts-library) for local LDRAW support, which when unzipped will create the `ldraw-parts-library-master` folder mentioned below

# Folder Structure

- Possible `main folder` definitions:
  - `three.js-master` or `three.js-dev` or `three.js-rXXX` or some custom name

- Required files for python / Flask run (add each file to the `main folder`):

  - `app.py`
  - `__init__.py`
  - `index.html`
  - `404.html`

- To run the Flask server:
  - navigate to the `main folder` in terminal and type `python -m app`
  - or open the `app.py` file in VS Code, wait for it to find python interpreters and press `F5`
  - In the browser go to `http://localhost:5000` to see the page

# Optional Custom Mods (use all or none)

These files / folders should be placed in the corresponding folder and replace any existing files:

- `sw.js` file ------------------------	main folder/editor/
- `Strings.js` file -------------------	main folder/editor/js/
- `Loader.js` file --------------------	main folder/editor/js/
- `Editor.js` file --------------------	main folder/editor/js/
- `Menubar.File.js` file --------------	main folder/editor/js/
- `ColladaLoader.js` file -----------	main folder/examples/jsm/loaders/
- `IFCLoader.js` file -----------------	main folder/examples/jsm/loaders/
- `IFCLoader.js.map` file -------------	main folder/examples/jsm/loaders/
- `ifc` folder ------------------------	main folder/examples/jsm/loaders/
- `MTLLoader.js` file -----------------	main folder/examples/jsm/loaders/
- `XYZLoader.js` file -----------------	main folder/examples/jsm/loaders/
- `LDRAWLoader.js` file ---------------	main folder/examples/jsm/loaders/
- `ldraw-parts-library-master` folder -	main folder/editor/
- `PRWMLoader.js` file ----------------	main folder/examples/jsm/loaders/
- `OBJExporter.js` file ---------------	main folder/examples/jsm/exporters/
- `PLYExporter.js` file ---------------	main folder/examples/jsm/exporters/
- `ColladaExporter.js` file -----------	main folder/examples/jsm/exporters/
- `chevrotain.module.min.js` ---------- main folder/examples/jsm/libs/

Customized features would be mainly Editor related:

- Automatic addition of `DirectionalLight` to the new scene
- Customized PDB, PRWM, LDRAW and XYZ loaders
- Customized MTL loader and OBJ exporter
- Localized IFC loader
- Customized PLY exporter
- Customized DAE (Collada) loader to support THREE.Points
- Added DAE (Collada) exporter, which was officially removed
- Added support for loading 3DS + textures zipped files
- Added support for loading OBJ + MTL + textures zipped files
- Added support for loading DAE (Collada) + textures zipped files
- modified `chevrotain.module.min.js` fixes the `unreachable code` warnings

There might be bugs.

You could try using only some of these files but don't get surprised if eventually something doesn't work properly.

# Mozilla Firefox screenshot

Main Menu Page
![Start Page](screenshot/Localized%203js.png?raw=true)

# License

This is all MIT licensed but please observe any other licenses that might be applicable to some files or content.

# Trademarks

Any and all trademarks, either directly or indirectly mentioned in this project, belong to their respective owners.
