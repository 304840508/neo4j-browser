export const NAME = 'connections'
export const ADD = 'connections/ADD'
export const SET_ACTIVE = 'connections/SET_ACTIVE'
export const SELECT = 'connections/SELECT'
export const REMOVE = 'connections/REMOVE'
export const MERGE = 'connections/MERGE'

const initialState = {
  allConnectionIds: [],
  connectionsById: {},
  activeConnection: null
}

/**
 * Selectors
*/
export function getConnection (state, id) {
  return getConnections(state).filter((connection) => connection.id === id)[0]
}

export function getConnections (state) {
  return state[NAME].allConnectionIds.map((id) => state[NAME].connectionsById[id])
}

export function getActiveConnection (state) {
  return state[NAME].activeConnection
}

const addConnectionHelper = (state, obj) => {
  const connectionsById = {...state.connectionsById, [obj.id]: obj}
  let allConnectionIds = state.allConnectionIds
  if (state.allConnectionIds.indexOf(obj.id) < 0) {
    allConnectionIds = state.allConnectionIds.concat([obj.id])
  }
  return Object.assign(
    {},
    state,
    {allConnectionIds: allConnectionIds},
    {connectionsById: connectionsById}
  )
}

const removeConnectionHelper = (state, connectionId) => {
  const connectionsById = {...state.connectionsById}
  let allConnectionIds = state.allConnectionIds
  const index = allConnectionIds.indexOf(connectionId)
  if (index > 0) {
    allConnectionIds.splice(index, 1)
    delete connectionsById[connectionId]
  }
  return Object.assign(
    {},
    state,
    {allConnectionIds: allConnectionIds},
    {connectionsById: connectionsById}
  )
}

const mergeConnectionHelper = (state, connection) => {
  const connectionId = connection.id
  const connectionsById = {...state.connectionsById}
  let allConnectionIds = state.allConnectionIds
  const index = allConnectionIds.indexOf(connectionId)
  if (index >= 0) {
    connectionsById[connectionId] = Object.assign(
      {},
      connectionsById[connectionId],
      connection
    )
  } else {
    connectionsById[connectionId] = Object.assign({}, connection)
    allConnectionIds.push(connectionId)
  }
  return Object.assign(
    {},
    state,
    {allConnectionIds: allConnectionIds},
    {connectionsById: connectionsById}
  )
}

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD:
      return addConnectionHelper(state, action.connection)
    case SET_ACTIVE:
      return {...state, activeConnection: action.connectionId}
    case REMOVE:
      return removeConnectionHelper(state, action.connectionId)
    case MERGE:
      return mergeConnectionHelper(state, action.connection)
    default:
      return state
  }
}

// Actions
export const selectConnection = (id) => {
  return {
    type: SELECT,
    connectionId: id
  }
}

export const setActiveConnection = (id) => {
  return {
    type: SET_ACTIVE,
    connectionId: id
  }
}

export const addConnection = ({name, username, password, host}) => {
  return {
    type: ADD,
    connection: {id: name, name, username, password, host, type: 'bolt'}
  }
}

export const updateConnection = (connection) => {
  return {
    type: MERGE,
    connection
  }
}
