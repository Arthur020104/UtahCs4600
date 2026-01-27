attribute vec3 vertexPos;
attribute vec2 textureCoords;
varying vec2 textCoords;
uniform mvp;


void main()
{
  textCoords = textureCoords;
  gl_Position = mvp * vertexPos;
}