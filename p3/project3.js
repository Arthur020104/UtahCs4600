// [TO-DO] Complete the implementation of the following class and the vertex shader below.

class CurveDrawer {
	constructor()
	{
    // Initialize the attribute buffer
    this.steps = 100;
    var tv = [];
    for ( var i=0; i<this.steps; ++i ) {

      tv.push( i / (this.steps-1) );
    }
    
    this.timeBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.timeBufferId);
    gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(tv),
    gl.STATIC_DRAW
    );
    
    this.prog = InitShaderProgram( curvesVS, curvesFS );

    gl.useProgram(this.prog);

    this.mvpId = gl.getUniformLocation(this.prog, 'mvp');
    this.p0Id = gl.getUniformLocation(this.prog, 'p0');
    this.p1Id = gl.getUniformLocation(this.prog, 'p1');
    this.p2Id = gl.getUniformLocation(this.prog, 'p2');
    this.p3Id = gl.getUniformLocation(this.prog, 'p3');
	}
	setViewport( width, height )
	{
		gl.useProgram( this.prog );
    //[column major] model should be I, view also should be I, P should p just ortho
    let ortho = [2/width,0,0,0, 0,-2/height,0,0, 0,0,1,0, -1,1,0,1];
		gl.uniformMatrix4fv( this.mvpId, false, ortho);
        
	}
	updatePoints( pt )
	{
    gl.useProgram(this.prog);
    for(let i = 0; i < pt.length; i++)
    {
      let x = pt[i].getAttribute("cx");
      let y = pt[i].getAttribute("cy");
      
      gl.uniform2f(this[`p${i}Id`],x, y);
    }
	}
	draw()
	{
    let timeAttribId = gl.getAttribLocation(this.prog, 't');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.timeBufferId);
    gl.vertexAttribPointer(timeAttribId, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(timeAttribId);
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.prog);
    gl.drawArrays( gl.LINE_STRIP, 0, this.steps);
	}
}

// Vertex Shader
var curvesVS = `
	attribute float t;
	uniform mat4 mvp;
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;
	
  vec2 bezierEval()
  {
    return pow(1.0 - t, 3.0) * p0 + 3.0 * pow(1.0 - t, 2.0) * t * p1 + 3.0 * (1.0 - t) * pow(t, 2.0) * p2 + pow(t, 3.0) * p3;
  }
  void main()
	{
		// [TODO] Replace the following with the proper vertex shader code
		gl_Position = mvp * vec4(bezierEval(), 0, 1);

	}
    
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(1,0,0,1);
	}
`;
