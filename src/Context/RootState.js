import React, {  useContext, useReducer, useEffect } from 'react'

//const url = 'https://course-api.com/react-useReducer-cart-project'
const RootContext = React.createContext()

const initialState = {
  type: 0,
  method:1,
  running:false,
  numRows:20,
  numCols:50,
  boundaryTemp:0.6,
  intermediateTemp:0.4,
  hot:[],
  cold:[],
  amb:[],
  plotcell:[],
  graphdata:[],
}

const reducer = (state, action) => {
  if (action.type === 'SET_RUNNING') {
    return {...state, running: action.payload}
  }
  if (action.type === 'SET_METHOD') {
    return {...state, method: action.payload}
  }
  if (action.type === 'ADD_HOT') {
    return {...state, hot:[...state.hot,action.payload]}
  }
  if (action.type === 'ADD_COLD') {
    return {...state, cold:[...state.cold,action.payload]}
  }
  if (action.type === 'ADD_AMB') {
    return {...state, amb:[...state.amb,action.payload]}
  }
  if (action.type === 'ADD_PLOTCELL') {
    return {...state, plotcell:[...state.plotcell,action.payload]}
  }
  if (action.type === 'CLEAR_TEMP') {
    return {...state, hot:[], amb:[], cold:[], plotcell:[]}
  }
  if (action.type === 'SET_GRAPH_DATA') {
    return {...state, graphdata: action.payload}
  }

  throw new Error('no matching action type')
}


const RootContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  const setRunning = (run) => {
    dispatch({ type: 'SET_RUNNING', payload: run })
  }
  const setMethod = (method) => {
    dispatch({ type: 'SET_METHOD', payload: method })
  }

  const addHot = (val) => {
    dispatch({ type: 'ADD_HOT', payload: val })
  }

  const addCold = (val) => {
    dispatch({ type: 'ADD_COLD', payload: val })
  }

  const addAmb = (val) => {
    dispatch({ type: 'ADD_AMB', payload: val })
  }

  const addPlotCell = (val) => {
    dispatch({ type: 'ADD_PLOTCELL', payload: val })
  }

  const clearTemp = () => {
    dispatch({ type: 'CLEAR_TEMP'})
  }

  const setGraphdata = (data) => {
    // console.log(data);
    dispatch({ type: 'SET_GRAPH_DATA', payload: data})
  }

  useEffect(() => {
    // dispatch({ type: 'GET_TOTALS' })
  }, [state.cart])

  return (
    <RootContext.Provider
      value={{
        ...state,
        setMethod,
        setRunning,
        addAmb,
        addCold,
        addHot,
        clearTemp,
        addPlotCell,
        setGraphdata
      }}
    >
      {children}
    </RootContext.Provider>
  )
}

export const useRootContext = () => {
  return useContext(RootContext)
}

export { RootContext, RootContextProvider }