import React, { useContext, useReducer, useEffect } from "react";

//const url = 'https://course-api.com/react-useReducer-cart-project'
const RootContext = React.createContext();

const initialState = {
  type: 0,
  method: 1,
  running: false,
  numRows: 10,
  numCols: 30,
  boundaryTemp: 0.4667,
  intermediateTemp: 0,
  celltemp: [],
  plotcell: [],
  graphdata: [],
  filter: {
    "00": 0.0625,
    "01": 0.125,
    "02": 0.0625,
    "10": 0.125,
    "11": 0.25,
    "12": 0.125,
    "20": 0.0625,
    "21": 0.125,
    "22": 0.0625,
  },
};

const reducer = (state, action) => {
  if (action.type === "SET_RUNNING") {
    return { ...state, running: action.payload };
  }
  if (action.type === "SET_BOUND_TEMP") {
    return { ...state, boundaryTemp: action.payload };
  }
  if (action.type === "SET_INTM_TEMP") {
    return { ...state, intermediateTemp: action.payload };
  }
  if (action.type === "SET_METHOD") {
    return { ...state, method: action.payload };
  }
  if (action.type === "ADD_CELLTEMP") {
    return { ...state, celltemp: [...state.celltemp, action.payload] };
  }
  if (action.type === "ADD_PLOTCELL") {
    return { ...state, plotcell: [...state.plotcell, action.payload] };
  }
  if (action.type === "CLEAR_TEMP") {
    return { ...state, celltemp: [], plotcell: [] };
  }
  if (action.type === "SET_GRAPH_DATA") {
    return { ...state, graphdata: action.payload };
  }
  if (action.type === "SET_FILTER") {

    var key = action.payload["key"];
    var val = action.payload["val"];

    var dummfilter = state.filter;

    dummfilter[key] = val;

    return { ...state, filter: dummfilter};
  }

  throw new Error("no matching action type");
};

const RootContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setRunning = (run) => {
    dispatch({ type: "SET_RUNNING", payload: run });
  };
  const setBoundaryTemp = (val) => {
    dispatch({ type: "SET_BOUND_TEMP", payload: val });
  };
  const setIntmTemp = (val) => {
    dispatch({ type: "SET_INTM_TEMP", payload: val });
  };
  const setMethod = (method) => {
    dispatch({ type: "SET_METHOD", payload: method });
  };

  const addCellTemp = (val) => {
    dispatch({ type: "ADD_CELLTEMP", payload: val });
  };

  const addPlotCell = (val) => {
    dispatch({ type: "ADD_PLOTCELL", payload: val });
  };

  const clearTemp = () => {
    dispatch({ type: "CLEAR_TEMP" });
  };

  const setGraphdata = (data) => {
    // console.log(data);
    dispatch({ type: "SET_GRAPH_DATA", payload: data });
  };

  const setFilter = (data) => {
    dispatch({ type: "SET_FILTER" , payload: data });
  };



  useEffect(() => {
    // dispatch({ type: 'GET_TOTALS' })
  }, [state.cart]);

  return (
    <RootContext.Provider
      value={{
        ...state,
        setMethod,
        setRunning,
        addCellTemp,
        clearTemp,
        addPlotCell,
        setGraphdata,
        setBoundaryTemp,
        setIntmTemp,
        setFilter
      }}
    >
      {children}
    </RootContext.Provider>
  );
};

export const useRootContext = () => {
  return useContext(RootContext);
};

export { RootContext, RootContextProvider };
