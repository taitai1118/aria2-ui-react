
import { Action, AnyAction } from "redux";
import { createStore, Reducer } from "redux";
import { produce } from 'immer';


//  action type的类型
type ActionTypes =
  | 'updateActiveTasks'
  | 'updateWaitingTasks'
  | 'updateStoppedTasks'
  | 'updateServers'
  | 'updateSelectedServerIndex'
  | 'updateSelectedTasksGid'
  |' updateDownloadTasks'

type MyActions = Action<ActionTypes>






export interface State {
  activeTasks: any[],
  waitingTasks: any[],
  stoppedTasks: any[],
  downloadTasks: any[],
  servers: any[],
  selectedServerIndex: number,
  selectedTasksGid: string[],
}

const initState: State = {
  activeTasks: [],
  waitingTasks: [],
  stoppedTasks: [],
  downloadTasks:[],
  servers: [],
  selectedServerIndex: 0,
  selectedTasksGid: [],

}

// Reducer<State, AnyAction>    reducer函数的泛型类型，State是状态的类型，AnyAction是action的类型
const reducer: Reducer<State, AnyAction> = (state: State = initState, action: AnyAction): State => {

  switch (action.type) {
    case 'updateActiveTasks':
      return produce(state, draft => {
        draft.activeTasks = action.tasks
      });
    case 'updateDownloadTasks':
      return produce(state, draft => {
        draft.downloadTasks = action.tasks
      });
    case 'updateWaitingTasks':
      return produce(state, draft => {
        draft.waitingTasks = action.tasks
      })
    case 'updateStoppedTasks':
      return produce(state, draft => {
        draft.stoppedTasks = action.tasks
      })
    case 'selectTask':
      return produce(state, draft => {
        draft.selectedTasksGid = action.tasks
      })
      
    }
    return state
}

const store = createStore(reducer, initState)

export default store
