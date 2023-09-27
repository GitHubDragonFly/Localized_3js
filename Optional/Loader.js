import * as THREE from 'three';

import { TGALoader } from 'three/addons/loaders/TGALoader.js';

import { AddObjectCommand } from './commands/AddObjectCommand.js';
import { SetSceneCommand } from './commands/SetSceneCommand.js';

import { LoaderUtils } from './LoaderUtils.js';

import { unzipSync, strFromU8 } from 'three/addons/libs/fflate.module.js';

function Loader( editor ) {

	const scope = this;

	this.texturePath = '';

	this.loadItemList = function ( items ) {

		LoaderUtils.getFilesFromItemList( items, function ( files, filesMap ) {

			scope.loadFiles( files, filesMap );

		} );

	};

	this.loadFiles = function ( files, filesMap ) {

		if ( files.length > 0 ) {

			filesMap = filesMap || LoaderUtils.createFilesMap( files );

			const manager = new THREE.LoadingManager();
			manager.setURLModifier( function ( url ) {

				url = url.replace( /^(\.?\/)/, '' ); // remove './'

				const file = filesMap[ url ];

				if ( file ) {

					console.log( 'Loading', url );

					return URL.createObjectURL( file );

				}

				return url;

			} );

			manager.addHandler( /\.tga$/i, new TGALoader() );

			for ( let i = 0; i < files.length; i ++ ) {

				scope.loadFile( files[ i ], manager );

			}

		}

	};

	this.loadFile = function ( file, manager ) {

		editor.flip_required = false;

		const filename = file.name;
		const extension = filename.split( '.' ).pop().toLowerCase();

		const reader = new FileReader();
		reader.addEventListener( 'progress', function ( event ) {

			const size = '(' + Math.floor( event.total / 1000 ).format() + ' KB)';
			const progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';

			console.log( 'Loading', filename, size, progress );

		} );

		switch ( extension ) {

			case '3dm':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { Rhino3dmLoader } = await import( 'three/addons/loaders/3DMLoader.js' );

					const loader = new Rhino3dmLoader();
					loader.setLibraryPath( '../examples/jsm/libs/rhino3dm/' );
					loader.parse( contents, function ( object ) {

						object.name = filename;
						object.rotation.x = - Math.PI / 2;

						editor.execute( new AddObjectCommand( editor, object ) );

					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case '3ds':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const { TDSLoader } = await import( 'three/addons/loaders/TDSLoader.js' );

					const loader = new TDSLoader();
					const object = loader.parse( event.target.result );

					object.name = filename;
					object.rotation.x = - Math.PI / 2;

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case '3mf':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const { ThreeMFLoader } = await import( 'three/addons/loaders/3MFLoader.js' );

					const loader = new ThreeMFLoader();
					const object = loader.parse( event.target.result );

					object.name = filename;
					object.rotation.x = - Math.PI / 2;

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'amf':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const { AMFLoader } = await import( 'three/addons/loaders/AMFLoader.js' );

					const loader = new AMFLoader();
					const amfobject = loader.parse( event.target.result );

					amfobject.name = filename;
					amfobject.rotation.x = - Math.PI / 2;

					editor.execute( new AddObjectCommand( editor, amfobject ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'bim':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const { BIMLoader } = await import( 'three/addons/loaders/BIMLoader.js' );
					const { createMeshesFromInstancedMesh } = await import( 'three/addons/utils/SceneUtils.js' );

					const loader = new BIMLoader();
					const bim_meshes = loader.parse( event.target.result );

					const meshes = new THREE.Group();
					meshes.name = filename;

					bim_meshes.traverse( bim_mesh => {

						if ( bim_mesh.isInstancedMesh ) {

							meshes.add( createMeshesFromInstancedMesh( bim_mesh ) );

						}

					});

					editor.execute( new AddObjectCommand( editor, meshes ) );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'dae':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { ColladaLoader } = await import( 'three/addons/loaders/ColladaLoader.js' );

					const loader = new ColladaLoader( manager );
					const collada = loader.parse( contents );

					collada.scene.name = filename;

					editor.execute( new AddObjectCommand( editor, collada.scene ) );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'drc':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { DRACOLoader } = await import( 'three/addons/loaders/DRACOLoader.js' );

					const loader = new DRACOLoader();
					loader.setDecoderPath( '../examples/jsm/libs/draco/' );
					loader.parse( contents, function ( geometry ) {

						let object;

						if ( geometry.index !== null ) {

							const material = new THREE.MeshStandardMaterial();

							object = new THREE.Mesh( geometry, material );
							object.name = filename;

						} else {

							const material = new THREE.PointsMaterial( { size: 0.01 } );
							material.vertexColors = geometry.hasAttribute( 'color' );

							object = new THREE.Points( geometry, material );
							object.name = filename;

						}

						loader.dispose();
						editor.execute( new AddObjectCommand( editor, object ) );

					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'fbx':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { FBXLoader } = await import( 'three/addons/loaders/FBXLoader.js' );

					const loader = new FBXLoader( manager );
					const object = loader.parse( contents );
					object.name = filename;

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'glb':

			{

				reader.addEventListener( 'load', async function ( event ) {

					editor.flip_required = true;

					const contents = event.target.result;

					const { GLTFLoader } = await import( 'three/addons/loaders/GLTFLoader.js' );
					const { DRACOLoader } = await import( 'three/addons/loaders/DRACOLoader.js' );
					const { KTX2Loader } = await import( 'three/addons/loaders/KTX2Loader.js' );
					const { MeshoptDecoder } = await import( 'three/addons/libs/meshopt_decoder.module.js' );

					const dracoLoader = new DRACOLoader( manager );
					dracoLoader.setDecoderPath( '../examples/jsm/libs/draco/gltf/' );

					const ktx2Loader = new KTX2Loader( manager );
					ktx2Loader.setTranscoderPath( '../examples/jsm/libs/basis/' );
					// assume WebGLRenderer() use
					ktx2Loader.detectSupport( new THREE.WebGLRenderer() );

					const loader = new GLTFLoader( manager );
					loader.setDRACOLoader( dracoLoader );
					loader.setKTX2Loader( ktx2Loader );
					loader.setMeshoptDecoder( MeshoptDecoder );
					loader.parse( contents, '', function ( result ) {

						const scene = result.scene;
						scene.name = filename;

						scene.animations.push( ...result.animations );
						editor.execute( new AddObjectCommand( editor, scene ) );

						dracoLoader.dispose();

					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'gltf':

			{

				reader.addEventListener( 'load', async function ( event ) {

					editor.flip_required = true;

					const contents = event.target.result;

					const { DRACOLoader } = await import( 'three/addons/loaders/DRACOLoader.js' );
					const { GLTFLoader } = await import( 'three/addons/loaders/GLTFLoader.js' );

					const dracoLoader = new DRACOLoader( manager );
					dracoLoader.setDecoderPath( '../examples/jsm/libs/draco/gltf/' );

					const loader = new GLTFLoader( manager );
					loader.setDRACOLoader( dracoLoader );

					loader.parse( contents, '', function ( result ) {

						const scene = result.scene;
						scene.name = filename;

						scene.animations.push( ...result.animations );
						editor.execute( new AddObjectCommand( editor, scene ) );

						dracoLoader.dispose();

					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'js':
			case 'json':

			{

				reader.addEventListener( 'load', function ( event ) {

					const contents = event.target.result;

					// 2.0

					if ( contents.indexOf( 'postMessage' ) !== - 1 ) {

						const blob = new Blob( [ contents ], { type: 'text/javascript' } );
						const url = URL.createObjectURL( blob );

						const worker = new Worker( url );

						worker.onmessage = function ( event ) {

							event.data.metadata = { version: 2 };
							handleJSON( event.data );

						};

						worker.postMessage( Date.now() );

						return;

					}

					// >= 3.0

					let data;

					try {

						data = JSON.parse( contents );

					} catch ( error ) {

						alert( error );
						return;

					}

					handleJSON( data );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'ifc':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const { IFCLoader } = await import( 'three/addons/loaders/IFCLoader.js' );

					var loader = new IFCLoader();
					loader.ifcManager.setWasmPath( '../../examples/jsm/loaders/ifc/' );

					const model = await loader.parse( event.target.result );
					model.mesh.name = filename;

					editor.execute( new AddObjectCommand( editor, model.mesh ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'kmz':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const { KMZLoader } = await import( 'three/addons/loaders/KMZLoader.js' );

					const loader = new KMZLoader();
					const collada = loader.parse( event.target.result );

					collada.scene.name = filename;

					editor.execute( new AddObjectCommand( editor, collada.scene ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'dat':
			case 'l3b':
			case 'ldr':
			case 'mpd':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const { LDrawLoader } = await import( 'three/addons/loaders/LDrawLoader.js' );

					const loader = new LDrawLoader();

					// The path to preload color definitions from.
					await loader.preloadMaterials( './ldraw-parts-library-master/colors/ldcfgalt.ldr' );
					// The path to load parts from the LDraw parts library from.
					loader.setPartsLibraryPath( './ldraw-parts-library-master/complete/ldraw/' );
					loader.setPath( '../../examples/models/ldraw/officialLibrary/' );

					loader.parse( event.target.result, function ( group ) {

						group.name = filename;

						// Convert from LDraw coordinates: rotate 180 degrees around OX
						group.rotation.x = Math.PI;

						// Scale and add model groups to the scene
						group.scale.multiplyScalar( 0.1 );

						editor.execute( new AddObjectCommand( editor, group ) );

					} );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'md2':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { MD2Loader } = await import( 'three/addons/loaders/MD2Loader.js' );

					const geometry = new MD2Loader().parse( contents );
					const material = new THREE.MeshStandardMaterial();

					const mesh = new THREE.Mesh( geometry, material );
					mesh.mixer = new THREE.AnimationMixer( mesh );
					mesh.name = filename;

					mesh.animations.push( ...geometry.animations );
					editor.execute( new AddObjectCommand( editor, mesh ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'obj':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { OBJLoader } = await import( 'three/addons/loaders/OBJLoader.js' );

					const object = new OBJLoader().parse( contents );
					object.name = filename;

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'pcd':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { PCDLoader } = await import( 'three/addons/loaders/PCDLoader.js' );

					const points = new PCDLoader().parse( contents );
					points.name = filename;

					// Rotate 180 degrees around OX
					points.rotation.x = Math.PI;

					editor.execute( new AddObjectCommand( editor, points ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'pdb':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { PDBLoader } = await import( 'three/addons/loaders/PDBLoader.js' );

					let pdb = new PDBLoader().parse( contents );
					pdb.name = filename;

					editor.execute( new AddObjectCommand( editor, pdb ) );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'ply':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { PLYLoader } = await import( 'three/addons/loaders/PLYLoader.js' );

					const geometry = new PLYLoader().parse( contents );
					let object;

					if ( geometry.index !== null ) {

						const material = new THREE.MeshStandardMaterial();

						object = new THREE.Mesh( geometry, material );
						object.name = filename;

					} else {

						const material = new THREE.PointsMaterial( { size: 0.01 } );
						material.vertexColors = geometry.hasAttribute( 'color' );

						object = new THREE.Points( geometry, material );
						object.name = filename;

					}

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'prwm':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { PRWMLoader } = await import( 'three/addons/loaders/PRWMLoader.js' );

					const geometry = new PRWMLoader().parse( contents );

					let uvs = geometry.getAttribute( 'uv' );

					if ( uvs !== undefined && uvs.array.length > 0 ) {

						if ( uvs.array.some( e => e.toString() === 'NaN' || e === null ) ) geometry.deleteAttribute( 'uv' );

					}

					geometry.center();

					let object;

					const material = new THREE.MeshPhongMaterial();
					material.vertexColors = geometry.hasAttribute( 'color' );

					object = new THREE.Mesh( geometry, material );
					object.name = filename;

					// Scale and add object to the scene
					object.scale.multiplyScalar( 0.05 );

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'stl':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { STLLoader } = await import( 'three/addons/loaders/STLLoader.js' );

					const geometry = new STLLoader().parse( contents );
					const material = new THREE.MeshStandardMaterial();

					const mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( editor, mesh ) );

				}, false );

				if ( reader.readAsBinaryString !== undefined ) {

					reader.readAsBinaryString( file );

				} else {

					reader.readAsArrayBuffer( file );

				}

				break;

			}

			case 'svg':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { SVGLoader } = await import( 'three/addons/loaders/SVGLoader.js' );

					const loader = new SVGLoader();
					const paths = loader.parse( contents ).paths;

					//

					const group = new THREE.Group();
					group.name = filename;
					group.scale.multiplyScalar( 0.1 );
					group.scale.y *= - 1;

					for ( let i = 0; i < paths.length; i ++ ) {

						const path = paths[ i ];

						const material = new THREE.MeshBasicMaterial( {
							color: path.color,
							depthWrite: false
						} );

						const shapes = SVGLoader.createShapes( path );

						for ( let j = 0; j < shapes.length; j ++ ) {

							const shape = shapes[ j ];

							const geometry = new THREE.ShapeGeometry( shape );
							const mesh = new THREE.Mesh( geometry, material );

							group.add( mesh );

						}

					}

					editor.execute( new AddObjectCommand( editor, group ) );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'usdz':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { USDZLoader } = await import( 'three/addons/loaders/USDZLoader.js' );

					const group = new USDZLoader().parse( contents );
					group.name = filename;

					editor.execute( new AddObjectCommand( editor, group ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'vox':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { VOXLoader, VOXMesh } = await import( 'three/addons/loaders/VOXLoader.js' );

					const chunks = new VOXLoader().parse( contents );

					const group = new THREE.Group();
					group.name = filename;

					for ( let i = 0; i < chunks.length; i ++ ) {

						const chunk = chunks[ i ];

						const mesh = new VOXMesh( chunk );
						group.add( mesh );

					}

					editor.execute( new AddObjectCommand( editor, group ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'vtk':
			case 'vtp':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { VTKLoader } = await import( 'three/addons/loaders/VTKLoader.js' );

					const geometry = new VTKLoader().parse( contents );
					const material = new THREE.MeshStandardMaterial();

					const mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( editor, mesh ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'wrl':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { VRMLLoader } = await import( 'three/addons/loaders/VRMLLoader.js' );

					const result = new VRMLLoader().parse( contents );
					result.name = filename;

					editor.execute( new SetSceneCommand( editor, result ) );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'xyz':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { XYZLoader } = await import( 'three/addons/loaders/XYZLoader.js' );

					const geometry = new XYZLoader().parse( contents );
					geometry.rotateX( - Math.PI / 2 );

					const material = new THREE.PointsMaterial( { size: 0.1 } );
					material.vertexColors = geometry.hasAttribute( 'color' );

					const points = new THREE.Points( geometry, material );
					points.name = filename;

					editor.execute( new AddObjectCommand( editor, points ) );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'zip':

			{

				reader.addEventListener( 'load', function ( event ) {

					handleZIP( event.target.result );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			default:

				console.error( 'Unsupported file format (' + extension + ').' );

				break;

		}

	};

	function handleJSON( data ) {

		if ( data.metadata === undefined ) { // 2.0

			data.metadata = { type: 'Geometry' };

		}

		if ( data.metadata.type === undefined ) { // 3.0

			data.metadata.type = 'Geometry';

		}

		if ( data.metadata.formatVersion !== undefined ) {

			data.metadata.version = data.metadata.formatVersion;

		}

		switch ( data.metadata.type.toLowerCase() ) {

			case 'buffergeometry':

			{

				const loader = new THREE.BufferGeometryLoader();
				const result = loader.parse( data );

				const mesh = new THREE.Mesh( result );

				editor.execute( new AddObjectCommand( editor, mesh ) );

				break;

			}

			case 'geometry':

				console.error( 'Loader: "Geometry" is no longer supported.' );

				break;

			case 'object':

			{

				const loader = new THREE.ObjectLoader();
				loader.setResourcePath( scope.texturePath );

				loader.parse( data, function ( result ) {

					if ( result.isScene ) {

						editor.execute( new SetSceneCommand( editor, result ) );

					} else {

						editor.execute( new AddObjectCommand( editor, result ) );

					}

				} );

				break;

			}

			case 'app':

				editor.fromJSON( data );

				break;

		}

	}

	async function handleZIP( contents ) {

		let obj_file = null, mtl_file = null;
		let mime_type = 'image/';
		let filename = 'model';
		let obj_textures = {};

		let zip = unzipSync( new Uint8Array( contents ) );

		// Poly

		Object.keys( zip ).forEach( key => {

			let key_lc = key.toLowerCase();

			if ( key_lc.endsWith( '.obj' ) ) {

				filename = key;
				obj_file = zip[ key ];

			} else if ( key_lc.endsWith( '.mtl' ) ) {

				mtl_file = zip[ key ];

			} else {

				let ext = key_lc.substring( key_lc.lastIndexOf( '.' ) + 1 );

				switch ( ext ) {

					case 'png':

						mime_type += 'png';

						break;

					case 'jpg':
					case 'pjp':
					case 'jpeg':
					case 'jfif':
					case 'pjpeg':

						mime_type += 'jpeg';

						break;

					case 'bmp':
					case 'dib':

						mime_type += 'bmp';

						break;

					case 'gif':

						mime_type += 'gif';

						break;

					case 'svg':

						mime_type += 'svg+xml';

						break;

					case 'webp':

						mime_type += 'webp';

						break;

					default:

						break;
				}

				// handle TGA separately
				if ( ext === 'tga' ) {

					let tga_loader = new TGALoader();

					let tga_texture = tga_loader.parse( zip[ key ].buffer );

					// convert TGA to PNG
					let canvas = document.createElement( 'canvas' );
					let ctx = canvas.getContext( '2d' );
					canvas.width = tga_texture.width;
					canvas.height = tga_texture.height;

					let imgData = new ImageData( new Uint8ClampedArray( tga_texture.data ), tga_texture.width, tga_texture.height );

					ctx.putImageData( imgData, 0, 0 );

					obj_textures[ key ] = canvas.toDataURL( 'image/png', 1 );

				} else {

					let blob = new Blob( [ zip[ key ].buffer ], { type: mime_type } );
					obj_textures[ key ] = URL.createObjectURL( blob );
					URL.revokeObjectURL( blob );

				}

			}

		});

		if ( obj_file !== null && mtl_file !== null ) {

			const { MTLLoader } = await import( 'three/addons/loaders/MTLLoader.js' );
			const { OBJLoader } = await import( 'three/addons/loaders/OBJLoader.js' );

			const map_strings = [ 'bump', 'map_bump', 'disp', 'map_disp', 'norm', 'map_kn', 'map_d', 'map_ka', 'map_kd', 'map_ke', 'map_emissive', 'map_ks', 'map_ns', 'map_pm', 'map_pr', 'map_px', 'map_psc', 'map_psr', 'map_pcc', 'map_pcn', 'map_pcr', 'map_pth', 'map_ptr', 'pl_map', 'pbr_pa_map', 'pbr_pir_map', 'pbr_pirth_map', 'pbr_psc_map', 'pbr_psi_map' ];

			let materials = new MTLLoader().parse( strFromU8( mtl_file ) );

			if ( Object.entries( obj_textures ).length !== 0 ) {

				for ( const [ key, value ] of Object.entries( materials.materialsInfo ) ) {

					Object.keys( obj_textures ).forEach( textureKey => {

						let str = '';

						map_strings.forEach( map_str => {

							if ( value[ map_str ] ) {

								if ( value[ map_str ].indexOf( '/' ) > -1 ) {

									str = value[ map_str ].substring( value[ map_str ].lastIndexOf( '/' ) + 1 );

								} else if ( value[ map_str ].indexOf( '\\' ) > -1 ) {

									str = value[ map_str ].substring( value[ map_str ].lastIndexOf( '\\' ) + 1 );

								} else if ( value[ map_str ].indexOf( '-s' ) > -1 || value[ map_str ].indexOf( '-o' ) > -1 ) {

									str = value[ map_str ].substring( value[ map_str ].lastIndexOf( ' ' ) + 1 );

								} else {

									str = value[ map_str ];

								}

								if ( textureKey.endsWith( str ) ) value[ map_str ] = obj_textures[ textureKey ];

							}

						});

					});

				}

			}

			materials.preload();

			let object = new OBJLoader().setMaterials( materials ).parse( strFromU8( obj_file ) );

			object.name = filename;

			editor.execute( new AddObjectCommand( editor, object ) );

		} else {

			for ( const path in zip ) {

				const file = zip[ path ];

				const manager = new THREE.LoadingManager();
				manager.setURLModifier( function ( url ) {

					const file = zip[ url ];

					if ( file ) {

						console.log( 'Loading', url );

						const blob = new Blob( [ file.buffer ], { type: 'application/octet-stream' } );
						return URL.createObjectURL( blob );

					}

					return url;

				} );

				filename = path;
				const extension = path.substring( path.lastIndexOf( '.' ) + 1 ).toLowerCase();

				switch ( extension ) {

					case '3ds':

					{

						const { TDSLoader } = await import( 'three/addons/loaders/TDSLoader.js' );

						const loader = new TDSLoader( manager );
						const object = loader.parse( file.buffer );
	
						object.name = filename;
						object.rotation.x = - Math.PI / 2;
	
						editor.execute( new AddObjectCommand( editor, object ) );

						break;

					}

					case 'dae':

					{

						const { ColladaLoader } = await import( 'three/addons/loaders/ColladaLoader.js' );

						const loader = new ColladaLoader( manager );
						const collada = loader.parse( strFromU8( file.buffer ) );
						collada.scene.name = filename;

						editor.execute( new AddObjectCommand( editor, collada.scene ) );

						break;

					}

					case 'fbx':

					{

						const { FBXLoader } = await import( 'three/addons/loaders/FBXLoader.js' );

						const loader = new FBXLoader( manager );
						const object = loader.parse( file.buffer );
						object.name = filename;

						editor.execute( new AddObjectCommand( editor, object ) );

						break;

					}

					case 'glb':

					{

						editor.flip_required = true;

						const { DRACOLoader } = await import( 'three/addons/loaders/DRACOLoader.js' );
						const { GLTFLoader } = await import( 'three/addons/loaders/GLTFLoader.js' );

						const dracoLoader = new DRACOLoader();
						dracoLoader.setDecoderPath( '../examples/jsm/libs/draco/gltf/' );

						const loader = new GLTFLoader();
						loader.setDRACOLoader( dracoLoader );

						loader.parse( file.buffer, '', function ( result ) {

							const scene = result.scene;
							scene.name = filename;

							scene.animations.push( ...result.animations );
							editor.execute( new AddObjectCommand( editor, scene ) );

							dracoLoader.dispose();

						} );

						break;

					}

					case 'gltf':

					{

						editor.flip_required = true;

						const { DRACOLoader } = await import( 'three/addons/loaders/DRACOLoader.js' );
						const { GLTFLoader } = await import( 'three/addons/loaders/GLTFLoader.js' );

						const dracoLoader = new DRACOLoader();
						dracoLoader.setDecoderPath( '../examples/jsm/libs/draco/gltf/' );

						const loader = new GLTFLoader( manager );
						loader.setDRACOLoader( dracoLoader );
						loader.parse( strFromU8( file ), '', function ( result ) {

							const scene = result.scene;
							scene.name = filename;

							scene.animations.push( ...result.animations );
							editor.execute( new AddObjectCommand( editor, scene ) );

							dracoLoader.dispose();

						} );

						break;

					}

				}

			}

		}

	}

}

export { Loader };
