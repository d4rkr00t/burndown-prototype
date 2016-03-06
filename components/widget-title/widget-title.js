import h from 'hyperscript';
import style from './widget-title.css';

export default function title(text) {
    return h('.widget-title', text);
}
