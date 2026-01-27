const VERTEX = `
attribute vec3 pos;
attribute vec2 txc;
uniform mat4 mvp;
uniform bool swap;
varying vec2 texCoord;


void main()
{
  vec4 vpos = !swap ? vec4(pos, 1.0) : vec4(pos.x, pos.z, pos.y, 1.0);
  gl_Position = mvp * vpos;
  texCoord = txc;
}`;
const FRAG = `
precision mediump float;
uniform sampler2D tex;
varying vec2 texCoord;
uniform bool useTexture;

void main()
{
  if(useTexture)
    gl_FragColor = texture2D(tex, texCoord);
  else
    gl_FragColor = vec4(1, 0.35, 0, 1);
}`;

// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.
// You can use the MatrixMult function defined in project4.html to multiply two 4x4 matrices in the same format.
function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	// [TO-DO] Modify the code below to form the transformation matrix.
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];
  let xRot = [
    1, 0, 0, 0,
    0, Math.cos(rotationX), Math.sin(rotationX), 0,
    0, -Math.sin(rotationX), Math.cos(rotationX), 0,
    0, 0, 0, 1
  ];
  let yRot = [
    Math.cos(rotationY), 0, -Math.sin(rotationY), 0,
    0, 1, 0, 0,
    Math.sin(rotationY), 0, Math.cos(rotationY), 0,
    0, 0, 0, 1
  ];
  let mvp = MatrixMult( yRot, xRot );
  mvp = MatrixMult(trans, mvp);
	mvp = MatrixMult( projectionMatrix, mvp );
	return mvp;
}


// [TO-DO] Complete the implementation of the following class.

class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		// [TO-DO] initializations
    this.numTriangles = 0;
    this.textureCoordsBufferId = gl.createBuffer();
    this.verticesBufferId = gl.createBuffer()
    this.textureId = gl.createTexture();
    this.swapYz = false;
    this.vertexShader = VERTEX;
    this.fragShader = FRAG;
    this.prog = InitShaderProgram(this.vertexShader, this.fragShader);

    gl.useProgram(this.prog);
    this.vertAttrib = gl.getAttribLocation(this.prog, 'pos');
    this.textAttrib = gl.getAttribLocation(this.prog, 'txc');
    this.mvpId = gl.getUniformLocation(this.prog, 'mvp');
    this.sawpId = gl.getUniformLocation(this.prog, 'swap');
    this.useTextureId = gl.getUniformLocation(this.prog, 'useTexture');
    this.textureShaderId = gl.getUniformLocation(this.prog, 'txc');

	}
	
	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions
	// and an array of 2D texture coordinates.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex.
	// Note that this method can be called multiple times.
	setMesh( vertPos, texCoords )
	{
		// [TO-DO] Update the contents of the vertex buffer objects.
		this.numTriangles = vertPos.length / 3;
    gl.useProgram(this.prog);
    gl.bindBuffer(gl.ARRAY_BUFFER,this.verticesBufferId);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertPos),
      gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER,this.textureCoordsBufferId);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(texCoords),
      gl.STATIC_DRAW
    );

    
	}
	
	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
		// [TO-DO] Set the uniform parameter(s) of the vertex shader
    gl.useProgram(this.prog);
    gl.uniform1i(this.sawpId, swap);
	}
	
	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw( trans )
	{
		// [TO-DO] Complete the WebGL initializations before drawing
    gl.bindBuffer(gl.ARRAY_BUFFER,this.verticesBufferId);

    gl.vertexAttribPointer(this.vertAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.vertAttrib);

    gl.bindBuffer(gl.ARRAY_BUFFER,this.textureCoordsBufferId);
    gl.vertexAttribPointer(this.textAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.textAttrib);

    gl.useProgram(this.prog);

    gl.uniformMatrix4fv( this.mvpId,false, trans);
    
    gl.uniform1i(this.textureShaderId, 0);

		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles );
	}
	
	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture( img )
	{
		// [TO-DO] Bind the texture
    gl.bindTexture(gl.TEXTURE_2D, this.textureId);
		// You can set the texture image data using the following command.
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );
    gl.generateMipmap(gl.TEXTURE_2D);
    
		// [TO-DO] Now that we have a texture, it might be a good idea to set
		// some uniform parameter(s) of the fragment shader, so that it uses the texture.
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MAG_FILTER,
      gl.LINEAR
    );
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textureId);
	}
	
	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
    gl.useProgram(this.prog);
    gl.uniform1i(this.useTextureId, show);
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
	}
	
}
