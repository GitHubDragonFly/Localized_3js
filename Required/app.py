#!flask/bin/python

from flask import Flask, Response, send_file, render_template, make_response
from flask_cors import CORS, cross_origin

app = Flask( __name__, template_folder='./' )
cors = CORS( app )
app.config[ 'CORS_HEADERS' ] = 'Content-Type'

folders = ['build/', 'docs/', 'editor/', 'examples/', 'files/', 'manual/', 'playground/', 'src/', 'test/', 'utils/']
extensions = ['.ico', '.bmp', '.dib', '.gif', '.jpg', 'jpeg', '.jfif', '.png', '.svg', '.tga', '.webp', '.js', '.json']

@app.route('/', methods=['GET'])
def get_index():
    return render_template( 'index.html' )

@app.route('/<path:path>', methods=['GET'])
@cross_origin()
def get_path( path ):
    if path != 'undefined':
        try:
            if path.startswith( tuple( folders ) ) or path.endswith( tuple( extensions ) ):
                if path == 'examples/':
                    path = path + 'index.html'

                return send_file( path )
            elif path.endswith('.css'):
                return Response( mimetype='text/css' )
            elif path.endswith('.map'):
                return Response( mimetype='applicaton/json' )
            elif path.endswith('.wasm'):
                return Response( mimetype='application/wasm' )
            else:
                return render_template( path )
        except Exception as e:
            return render_template( '404.html' ), 404
    else:
        return make_response('Path is undefined')

if __name__ == '__main__':
    app.run( host='0.0.0.0', debug=False )