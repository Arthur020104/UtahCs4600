// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform( positionX, positionY, rotation, scale )
{
	const scaleMatrix = Array( scale, 0, 0, 0, scale, 0, 0, 0, 1 );

	rotation = rotation * Math.PI / 180;
	const rotationMatrix = Array(Math.cos(rotation), Math.sin(rotation), 0, -Math.sin(rotation), Math.cos(rotation), 0, 0, 0, 1);

	const translationMatrix = Array(1, 0, 0, 0, 1, 0, positionX, positionY, 1);

	const result = ApplyTransform(ApplyTransform( scaleMatrix, rotationMatrix ) , translationMatrix );
	
	return result;
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform( trans1, trans2 )
{
	let result = Array( 0, 0, 0, 0, 0, 0, 0, 0, 0 );

	for(let r = 0; r < 3; r++)
	{
		for(let c = 0; c < 3; c++)
		{
			for(let i = 0; i < 3; i++)
			{
				result[r + c * 3] += trans2[i * 3 + r] * trans1[c * 3 + i];
			}
		}
	}
	
	
	return result;
}
