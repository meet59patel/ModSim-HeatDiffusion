const calculateNewValueNewtonsLaw = (
  k,
  value,
  N,
  S,
  E,
  W,
  NE,
  NW,
  SE,
  SW,
  filter,
  useweights
) => {
  var ans = 0;

  if (!useweights) {
    ans = (1 - 8 * k) * value + k * (N + S + E + W + NE + NW + SE + SW);
  } else {
    ans =
      filter['00'] * SW +
      filter['01'] * S +
      filter['02'] * SE +
      filter['10'] * W +
      filter['11'] * value +
      filter['12'] * E +
      filter['20'] * NW +
      filter['21'] * N +
      filter['22'] * SE;
  }

  return ans;
};

export { calculateNewValueNewtonsLaw };
