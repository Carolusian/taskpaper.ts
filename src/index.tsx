import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { store, TaskPaper } from './components';
import registerServiceWorker from './registerServiceWorker';

let taskpaperInstance: TaskPaper | null

const render = () => {
  ReactDOM.render(
    <TaskPaper content={store.getState().content} ref={(instance) => taskpaperInstance = instance} />,
    document.getElementById('root') as HTMLElement
  );
}

const forceRender = () => {
  taskpaperInstance!.forceRender()
}

store.subscribe(forceRender)

render()

registerServiceWorker();

