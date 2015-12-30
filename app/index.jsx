// You can also include here commons if you want with import 'react-toolbox/lib/commons';
import React from 'react';
import { render } from 'react-dom';
import { App } from './App';
require('file?name=[name].[ext]!../www/index.html');

render(<App/>, document.getElementById('app'));
