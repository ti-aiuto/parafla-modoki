window.onbeforeunload = function (event) {
  event.preventDefault();
  event.returnValue = '';
};

window.onload = function () {
  initEditor();
};
import './form.scss';
import './editor.scss';
import './edit_event_modal.scss';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {initEditor} from '@/editor/editor_plain.js';
