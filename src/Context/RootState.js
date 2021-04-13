import React, { useContext, useReducer, useEffect } from 'react';

//const url = 'https://course-api.com/react-useReducer-cart-project'
const RootContext = React.createContext();

const initialState = {
  type: 0,
  method: 1,
  running: false,
  numRows: 10,
  numCols: 30,
  boundaryTemp: 0.6,
  intermediateTemp: 0.4,
  plotcell: [],
  graphdata: [],
  celltemp: [],
};

const reducer = (state, action) => {
  if (action.type === 'SET_RUNNING') {
    return { ...state, running: action.payload };
  }
  if (action.type === 'SET_BOUND_TEMP') {
    return { ...state, boundaryTemp: action.payload };
  }
  if (action.type === 'SET_INTM_TEMP') {
    return { ...state, intermediateTemp: action.payload };
  }
  if (action.type === 'SET_METHOD') {
    return { ...state, method: action.payload };
  }
  if (action.type === 'ADD_CELLTEMP') {
    return { ...state, celltemp: [...state.celltemp, action.payload] };
  }
  if (action.type === 'ADD_PLOTCELL') {
    return { ...state, plotcell: [...state.plotcell, action.payload] };
  }
  if (action.type === 'CLEAR_TEMP') {
    return { ...state, celltemp: [], plotcell: [] };
  }
  if (action.type === 'SET_GRAPH_DATA') {
    return { ...state, graphdata: action.payload };
  }

  throw new Error('no matching action type');
};

const RootContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setRunning = (run) => {
    dispatch({ type: 'SET_RUNNING', payload: run });
  };
  const setBoundaryTemp = (val) => {
    dispatch({ type: 'SET_BOUND_TEMP', payload: val });
  };

  const setIntmTemp = (val) => {
    dispatch({ type: 'SET_INTM_TEMP', payload: val });
  };

  const setMethod = (method) => {
    dispatch({ type: 'SET_METHOD', payload: method });
  };

  const addCellTemp = (val) => {
    dispatch({ type: 'ADD_CELLTEMP', payload: val });
  };

  const addPlotCell = (val) => {
    dispatch({ type: 'ADD_PLOTCELL', payload: val });
  };

  const clearTemp = () => {
    dispatch({ type: 'CLEAR_TEMP' });
  };

  const setGraphdata = (data) => {
    // console.log(data);
    dispatch({ type: 'SET_GRAPH_DATA', payload: data });
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
        setGraphdata,
        setBoundaryTemp,
        setIntmTemp,
        clearTemp,
        addPlotCell,
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
