varying vec2 textCoords;
uniform sampler2D texture;

void main()
{
  gl_Color = texture(textCoords);
}