import React, { useState, useCallback, useRef } from 'react';
import {
  Button,
  Grid,
  makeStyles,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputLabel,
  FormLabel,
  Select,
  MenuItem,
  Switch,
  Slider,
  Card,
  TextField,
  Box,
} from '@material-ui/core';
import produce from 'immer';
import rgbToHex from '../Utils/rgbToHex';
import {
  generateAnsorbingGrid,
  generateReflectiveGrid,
  generatePeriodicGrid,
} from '../Utils/generateGrid';
import { useRootContext } from '../Context/RootState';
import { calculateNewValueNewtonsLaw } from '../Utils/Calculate';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import BarChartIcon from '@material-ui/icons/BarChart';

const useStyles = makeStyles(() => ({
  buttton: {
    margin: 8,
  },

  gridcont: {
    marginTop: 24,
  },

  text: {
    margin: 16,
  },
  slider: {
    width: 700,
  },

  card: {
    padding: 12,
  },
}));

var count = 0;

var gdata = [];

const marks = [
  {
    value: 0,
    label: '-50°C',
  },
  {
    value: 0.1667,
    label: '-25°C',
  },
  {
    value: 0.3333,
    label: '0°C',
  },
  {
    value: 0.4,
    label: '10°C',
  },
  {
    value: 0.4667,
    label: '20°C',
  },
  {
    value: 0.5333,
    label: '30°C',
  },
  {
    value: 0.6,
    label: '40°C',
  },
  {
    value: 0.6667,
    label: '50°C',
  },
  {
    value: 0.7333,
    label: '60°C',
  },
  {
    value: 0.8,
    label: '70°C',
  },
  {
    value: 0.8667,
    label: '80°C',
  },
  {
    value: 0.9333,
    label: '90°C',
  },
  {
    value: 1,
    label: '100°C',
  },
];

function Diffusion() {
  const {
    running,
    setRunning,
    numCols,
    numRows,
    intermediateTemp,
    boundaryTemp,
    method,
    setMethod,
    celltemp,
    addCellTemp,
    clearTemp,
    plotcell,
    setGraphdata,
    addPlotCell,
    setBoundaryTemp,
    setIntmTemp,
    filter,
    setFilter,
  } = useRootContext();

  const classes = useStyles();

  const [gridBorder, setBorder] = useState(true);
  const [keepconst, setKeepConst] = useState(true);
  const [plotted, setPlotted] = useState(false);
  const [useweights, setUseWeights] = useState(false);
  const [selectedCellTemp, setSelectedCellTemp] = useState(false);

  const [grid, setGrid] = useState(() => {
    return generateAnsorbingGrid(
      numRows,
      numCols,
      intermediateTemp,
      boundaryTemp,
      celltemp
    );
  });

  const [cellSelection, setCellSelection] = useState('temp');

  const handleCellSelection = (event) => {
    setCellSelection(event.target.value);
  };

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let x = 1; x < numRows - 1; x++) {
          for (let y = 1; y < numCols - 1; y++) {
            const N = g[x][y - 1];
            const S = g[x][y + 1];
            const W = g[x - 1][y];
            const E = g[x + 1][y];
            const NE = g[x + 1][y - 1];
            const NW = g[x - 1][y - 1];
            const SE = g[x + 1][y + 1];
            const SW = g[x - 1][y + 1];
            const value = g[x][y];

            gridCopy[x][y] = calculateNewValueNewtonsLaw(
              0.03,
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
            );
          }
        }

        if (keepconst) {
          celltemp.map((pp, i) => {
            gridCopy[pp[0]][pp[1]] = pp[2];
            return 1;
          });
        }

        const ro = [0, numRows - 1];
        const col = [0, numCols - 1];

        if (method === 2) {
          ro.forEach((roi) => {
            for (let i = 1; i < numCols - 1; i++) {
              if (roi === 0) {
                gridCopy[roi][i] = g[roi + 1][i];
              } else {
                gridCopy[roi][i] = g[roi - 1][i];
              }
            }
          });

          col.forEach((coi) => {
            for (let i = 0; i < numRows; i++) {
              if (coi === 0) {
                gridCopy[i][coi] = g[i][coi + 1];
              } else {
                gridCopy[i][coi] = g[i][coi - 1];
              }
            }
          });
        } else if (method === 3) {
          ro.forEach((roi) => {
            for (let i = 1; i < numCols - 1; i++) {
              if (roi === 0) {
                gridCopy[roi][i] = g[numRows - 2][i];
              } else {
                gridCopy[roi][i] = g[1][i];
              }
            }
          });

          col.forEach((coi) => {
            for (let i = 0; i < numRows; i++) {
              if (coi === 0) {
                gridCopy[i][coi] = g[i][numCols - 2];
              } else {
                gridCopy[i][coi] = g[i][1];
              }
            }
          });
        }

        count = count + 1;

        plotcell.map((pp, i) => {
          if (gdata.length <= i) {
            gdata.push({
              label: `${pp[0]},${pp[1]}`,
              data: [],
            });
          }

          // console.log(gridCopy[pp[0]][pp[1]]);

          gdata[i]['data'].push([
            count,
            (1 - gridCopy[pp[0]][pp[1]] - 0.3333) * 150,
          ]);

          return 0;
        });
      });
    });

    setTimeout(runSimulation, 50);
  }, [
    numRows,
    numCols,
    celltemp,
    plotcell,
    keepconst,
    filter,
    useweights,
    method,
  ]);

  function handleMethods(e) {
    if (e.target.value === 1) {
      setMethod(1);
      setGrid(
        generateAnsorbingGrid(
          numRows,
          numCols,
          intermediateTemp,
          boundaryTemp,
          celltemp
        )
      );
    } else if (e.target.value === 2) {
      setMethod(2);
      setGrid(
        generateReflectiveGrid(
          numRows,
          numCols,
          intermediateTemp,
          boundaryTemp,
          celltemp
        )
      );
    } else {
      setMethod(3);
      setGrid(
        generatePeriodicGrid(
          numRows,
          numCols,
          intermediateTemp,
          boundaryTemp,
          celltemp
        )
      );
    }
  }

  function handleReset() {
    if (method === 1) {
      setGrid(
        generateAnsorbingGrid(
          numRows,
          numCols,
          intermediateTemp,
          boundaryTemp,
          celltemp
        )
      );
    } else if (method === 2) {
      setGrid(
        generateReflectiveGrid(
          numRows,
          numCols,
          intermediateTemp,
          boundaryTemp,
          celltemp
        )
      );
    } else {
      setGrid(
        generatePeriodicGrid(
          numRows,
          numCols,
          intermediateTemp,
          boundaryTemp,
          celltemp
        )
      );
    }
  }

  function handleClear() {
    clearTemp();
    if (method === 1) {
      setGrid(
        generateAnsorbingGrid(
          numRows,
          numCols,
          intermediateTemp,
          boundaryTemp,
          []
        )
      );
    } else if (method === 2) {
      setGrid(
        generateReflectiveGrid(
          numRows,
          numCols,
          intermediateTemp,
          boundaryTemp,
          []
        )
      );
    } else {
      setGrid(
        generatePeriodicGrid(
          numRows,
          numCols,
          intermediateTemp,
          boundaryTemp,
          []
        )
      );
    }
  }

  const handleBorderTemp = (event, newValue) => {
    setBoundaryTemp(1 - newValue);
  };

  const handleIntmTemp = (event, newValue) => {
    setIntmTemp(1 - newValue);
  };

  const handleCellTemp = (event, newValue) => {
    setSelectedCellTemp(1 - newValue);
  };

  function handleFilter(keyval) {
    console.log(filter);
    setFilter(keyval);
  }

  function valuetext(value) {
    return `${value}°C`;
  }

  return (
    <>
      <Grid container justify="center">
        <Grid item>
          <Button
            color="primary"
            className={classes.buttton}
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => {
              setRunning(!running);

              if (!running) {
                runningRef.current = true;
                runSimulation();
              }
            }}
          >
            {running ? 'stop' : 'start'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.buttton}
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            startIcon={<DeleteIcon />}
          >
            Reset
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.buttton}
            variant="outlined"
            color="primary"
            onClick={handleClear}
          >
            Clear Selections
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            className={classes.buttton}
            variant="contained"
            startIcon={<BarChartIcon />}
            onClick={() => {
              if (plotted) {
                // console.log("CLEAR");

                setGraphdata(
                  plotcell.map((pp) => {
                    return {
                      label: `${pp[0]},${pp[1]}`,
                      data: [],
                    };
                  })
                );

                gdata = plotcell.map((pp) => {
                  return {
                    label: `${pp[0]},${pp[1]}`,
                    data: [],
                  };
                });
              } else {
                // console.log("PLOT");
                setGraphdata(gdata);
              }

              setPlotted(!plotted);
            }}
          >
            {plotted ? 'Clear Graph' : 'Plot Graph'}
          </Button>
        </Grid>
      </Grid>

      <Grid container justify="center" className={classes.gridcont}>
        <FormControl variant="filled">
          <InputLabel id="demo-simple-select-filled-label">
            Boundary Type
          </InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={method}
            defaultValue={1}
            onChange={handleMethods}
          >
            <MenuItem value={1}>Absorbing Boundaries</MenuItem>
            <MenuItem value={2}>Reflective Boundaries</MenuItem>
            <MenuItem value={3}>Periodic Boundaries</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid container justify="center" className={classes.gridcont}>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={gridBorder}
                onChange={(e) => setBorder(e.target.checked)}
                name="checkedA"
              />
            }
            label="Grid"
          />
          <FormControlLabel
            control={
              <Switch
                checked={keepconst}
                onChange={(e) => setKeepConst(e.target.checked)}
                name="checkedB"
              />
            }
            label="Keep Constant Temperature on selected cells"
          />
          <FormControlLabel
            control={
              <Switch
                checked={useweights}
                onChange={(e) => setUseWeights(!useweights)}
                name="checkedB"
              />
            }
            label="Use Weights in propagation"
          />
        </Grid>
      </Grid>

      <Grid
        container
        justify="center"
        className={classes.gridcont}
        spacing={10}
      >
        <Grid item>
          <Typography id="discrete-slider" gutterBottom>
            Boundary Temperature
          </Typography>
          <Slider
            align="center"
            className={classes.slider}
            defaultValue={0.5333}
            onChangeCommitted={handleBorderTemp}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-restrict"
            step={null}
            valueLabelDisplay="auto"
            marks={marks}
            min={0}
            max={1}
          />
          <Typography id="discrete-slider" gutterBottom>
            Intermediate Temperature
          </Typography>
          <Slider
            className={classes.slider}
            defaultValue={1}
            onChangeCommitted={handleIntmTemp}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-restrict"
            step={null}
            valueLabelDisplay="auto"
            marks={marks}
            min={0}
            max={1}
          />
          <Typography id="discrete-slider" gutterBottom>
            Cell Temperature
          </Typography>
          <Slider
            className={classes.slider}
            defaultValue={0.8}
            onChangeCommitted={handleCellTemp}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-restrict"
            step={null}
            valueLabelDisplay="auto"
            marks={marks}
            min={0}
            max={1}
          />
        </Grid>
        {useweights ? (
          <Grid item>
            <Typography variant="h6">Filter</Typography>
            <Box
              display="flex"
              justifyContent="center"
              bgcolor="background.paper"
            >
              <Box p={1}>
                <TextField
                  value={filter['00']}
                  onChange={(e) => {
                    handleFilter({ key: '00', val: e.target.value });
                  }}
                  label="(0,0)"
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box p={1}>
                <TextField
                  value={filter['01']}
                  onChange={(e) => {
                    handleFilter({ key: '01', val: e.target.value });
                  }}
                  label="(0,1)"
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box p={1}>
                <TextField
                  value={filter['02']}
                  onChange={(e) => {
                    handleFilter({ key: '02', val: e.target.value });
                  }}
                  label="(0,2)"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              bgcolor="background.paper"
            >
              <Box p={1}>
                <TextField
                  value={filter['10']}
                  onChange={(e) => {
                    handleFilter({ key: '10', val: e.target.value });
                  }}
                  label="(1,0)"
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box p={1}>
                <TextField
                  value={filter['11']}
                  onChange={(e) => {
                    handleFilter({ key: '11', val: e.target.value });
                  }}
                  label="(1,1)"
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box p={1}>
                <TextField
                  value={filter['12']}
                  onChange={(e) => {
                    handleFilter({ key: '12', val: e.target.value });
                  }}
                  label="(1,2)"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              bgcolor="background.paper"
            >
              <Box p={1}>
                <TextField
                  value={filter['20']}
                  onChange={(e) => {
                    handleFilter({ key: '20', val: e.target.value });
                  }}
                  label="(2,0)"
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box p={1}>
                <TextField
                  value={filter['21']}
                  onChange={(e) => {
                    handleFilter({ key: '21', val: e.target.value });
                  }}
                  label="(2,1)"
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Box p={1}>
                <TextField
                  value={filter['22']}
                  onChange={(e) => {
                    handleFilter({ key: '22', val: e.target.value });
                  }}
                  label="(2,2)"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
          </Grid>
        ) : (
          ''
        )}
      </Grid>

      <Grid container justify="center" className={classes.gridcont}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Cell Selection For </FormLabel>
          <RadioGroup
            row
            aria-label="Cell Selection For"
            name="Cell Selection For"
            value={cellSelection}
            onChange={handleCellSelection}
          >
            <FormControlLabel value="plot" control={<Radio />} label="Plot" />
            <FormControlLabel
              value="temp"
              control={<Radio />}
              label="Temperature"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid container justify="center" className={classes.gridcont}>
        Cells to be plotted:
        {plotcell.map((pp, i) => (
          <Typography
            key={`${pp[0]},${pp[1]}`}
          >{` (${pp[0]},${pp[1]})`}</Typography>
        ))}
      </Grid>

      <Grid container justify="center" className={classes.gridcont}>
        <Card elevation={10} className={classes.card}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${numCols}, 20px)`,
            }}
          >
            {grid.map((rows, i) =>
              rows.map((col, k) => (
                <div
                  key={`${i}-${k}`}
                  onClick={() => {
                    if (cellSelection === 'plot') {
                      // console.log("addceel bro");
                      addPlotCell([i, k]);
                    } else {
                      const newGrid = produce(grid, (gridCopy) => {
                        gridCopy[i][k] = selectedCellTemp;
                        addCellTemp([i, k, selectedCellTemp]);
                      });
                      setGrid(newGrid);
                    }
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    background: rgbToHex(
                      255 * (1 - grid[i][k]),
                      0,
                      255 * grid[i][k]
                    ),
                    border: gridBorder ? '1px solid black' : '',
                  }}
                />
              ))
            )}
          </div>
        </Card>
      </Grid>
    </>
  );
}

export default Diffusion;
