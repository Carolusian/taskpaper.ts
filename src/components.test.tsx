import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { TaskPaper } from './components';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TaskPaper />, div);
  ReactDOM.unmountComponentAtNode(div);
});