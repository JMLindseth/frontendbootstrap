import {
  Action,
  AnyAction,
  combineReducers,
  Dispatch,
} from 'redux';
import { connectRouter } from 'connected-react-router';
import {
  all,
  fork,
} from 'redux-saga/effects';
import configureStore from './configureStore';
import { createBrowserHistory } from 'history';
import { ModiacontextState } from './modiacontext/modiacontextTypes';
import { VeilederenheterState } from './veilederenheter/veilederenheterTypes';
import { VeilederinfoState } from './veilederinfo/veilederinfoTypes';
import modiacontextReducer from './modiacontext/modiacontextReducer';
import veilederenheterReducer from './veilederenheter/veilederenheterReducer';
import veilederinfoReducer from './veilederinfo/veilederinfoReducer';

import modiacontextSagas from './modiacontext/modiacontextSagas';
import veilederenheterSagas from './veilederenheter/veilederenheterSagas';
import veilederinfoSagas from './veilederinfo/veilederinfoSagas';

export interface ApplicationState {
  router: any;
  modiacontext: ModiacontextState;
  veilederenheter: VeilederenheterState;
  veilederinfo: VeilederinfoState;
}

export interface ConnectedReduxProps<A extends Action = AnyAction> {
  dispatch: Dispatch<A>;
}

export const rootReducer = () => combineReducers<ApplicationState>({
  router: connectRouter(history),
  modiacontext: modiacontextReducer,
  veilederenheter: veilederenheterReducer,
  veilederinfo: veilederinfoReducer,
});

export function* rootSaga() {
  yield all([
    fork(modiacontextSagas),
    fork(veilederenheterSagas),
    fork(veilederinfoSagas),
  ]);
}

const history = createBrowserHistory();

const initialState = (window as any).initialReduxState;

const store = configureStore(history, initialState);

export { store, history };
