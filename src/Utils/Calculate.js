const calculateNewValueNewtonsLaw =(k, value, N, S, E, W, NE, NW, SE, SW)=>{
	var ans = (1 - 8*k)*value + k*(N + S + E + W + NE + NW + SE + SW);
	return ans;
}

const calculateNewValueUsingFilter= (value, N, S, E, W, NE, NW, SE, SW)=>{

	var ans = 0.25*value + 0.125*(N + E + S + W) + 0.0625*(NE + NW + SE + SW);
	return ans;
    
}


export {calculateNewValueNewtonsLaw,calculateNewValueUsingFilter};