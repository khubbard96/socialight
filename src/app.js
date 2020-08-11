import logMessage from './js/logger'
import './css/bootstrap.min.css'
import './css/style.css'
import $ from 'jquery';
import _ from 'underscore';
import App from './js/app';

window.jQuery = window.$ = $;
window._ = _;


// Log message to console
logMessage('Its finished!!');
new App().render();


if (module.hot)       // eslint-disable-line no-undef
  module.hot.accept() // eslint-disable-line no-undef


