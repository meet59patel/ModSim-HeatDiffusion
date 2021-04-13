const generateAnsorbingGrid = (numRows, numCols, initTemp, boundTemp, hot, cold, amb) => {
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => initTemp));
  }

  hot.forEach(([xx,yy])=>{
    rows[xx][yy] = 0;
  });

  cold.forEach(([xx,yy])=>{
      rows[xx][yy] = 1;
  });

  amb.forEach(([xx,yy])=>{
      rows[xx][yy] = 0.5;
  });

  const ro = [0, numRows - 1];
  const col = [0, numCols - 1];

  ro.forEach((roi) => {
    for (let i = 0; i < numCols; i++) {
      rows[roi][i] = boundTemp;
    }
  });

  col.forEach((coi) => {
    for (let i = 0; i < numRows; i++) {
      rows[i][coi] = boundTemp;
    }
  });

  return rows;
};

const generateReflectiveGrid = (numRows, numCols, initTemp, boundTemp, hot, cold, amb) => {
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => initTemp));
  }

  hot.forEach(([xx,yy])=>{
    rows[xx][yy] = 0;
  });

  cold.forEach(([xx,yy])=>{
      rows[xx][yy] = 1;
  });

  amb.forEach(([xx,yy])=>{
      rows[xx][yy] = 0.5;
  });

  const ro = [0, numRows - 1];
  const col = [0, numCols - 1];

  ro.forEach((roi) => {
    for (let i = 1; i < numCols-1; i++) {
      if(roi===0)
      {
        rows[roi][i] = rows[roi+1][i];
      }
      else
      {
        rows[roi][i] = rows[roi-1][i];
      }
    }
  });

  col.forEach((coi) => {
    for (let i = 0; i < numRows; i++) {

      if(coi===0)
      {
        rows[i][coi] = rows[i][coi+1];
      }
      else
      {
        rows[i][coi] = rows[i][coi-1];
      }
    }
  });

  return rows;
};

const generatePeriodicGrid = (numRows, numCols, initTemp, boundTemp, hot, cold, amb) => {
  const rows = [];

  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => initTemp));
  }

  hot.forEach(([xx,yy])=>{
    rows[xx][yy] = 0;
  });

  cold.forEach(([xx,yy])=>{
      rows[xx][yy] = 1;
  });

  amb.forEach(([xx,yy])=>{
      rows[xx][yy] = 0.5;
  });

  const ro = [0, numRows - 1];
  const col = [0, numCols - 1];


  ro.forEach((roi) => {
    for (let i = 1; i < numCols-1; i++) {
      if(roi===0)
      {
        rows[roi][i] = rows[numRows-2][i];
      }
      else
      {
        rows[roi][i] = rows[1][i];
      }
    }
  });

  col.forEach((coi) => {
    for (let i = 0; i < numRows; i++) {
      if(coi===0)
      {
        rows[i][coi] = rows[i][numCols-2];
      }
      else
      {
        rows[i][coi] = rows[i][1];
      }
    }
  });

  return rows;
};


export {generateAnsorbingGrid,generateReflectiveGrid,generatePeriodicGrid};
