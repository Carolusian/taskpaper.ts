import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import TaskPaper from './components';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { rootReducer } from './reducers'

const store = createStore(rootReducer)

ReactDOM.render(
  <Provider store={store}>
    <TaskPaper />
  </Provider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();

