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
    width: 500,
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
    label: '0°C',
  },
  {
    value: 0.1,
    label: '5°C',
  },
  {
    value: 0.2,
    label: '10°C',
  },
  {
    value: 0.3,
    label: '15°C',
  },
  {
    value: 0.4,
    label: '20°C',
  },
  {
    value: 0.5,
    label: '25°C',
  },
  {
    value: 0.6,
    label: '30°C',
  },
  {
    value: 0.7,
    label: '35°C',
  },
  {
    value: 0.8,
    label: '40°C',
  },
  {
    value: 0.9,
    label: '45°C',
  },
  {
    value: 1,
    label: '50°C',
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
  } = useRootContext();

  const classes = useStyles();

  const [gridBorder, setBorder] = useState(true);
  const [keepconst, setKeepConst] = useState(true);
  const [plotted, setPlotted] = useState(false);
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
              SW
            );
          }
        }

        if (keepconst) {
          celltemp.map((pp, i) => {
            gridCopy[pp[0]][pp[1]] = pp[2];
            return 1;
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

          gdata[i]['data'].push([count, (1 - gridCopy[pp[0]][pp[1]]) * 50]);

          return 0;
        });
      });
    });

    setTimeout(runSimulation, 50);
  }, [numRows, numCols, celltemp, plotcell, keepconst]);

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
            label="Keep Constant Temperature on selected spots"
          />
        </Grid>
      </Grid>

      <Grid container justify="center" className={classes.gridcont}>
        <Grid item>
          <Typography id="discrete-slider" gutterBottom>
            Boundary Temperature
          </Typography>
          <Slider
            align="center"
            className={classes.slider}
            defaultValue={0.4}
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
            defaultValue={0.6}
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
