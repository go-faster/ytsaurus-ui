import _ from 'lodash';

import {FAVOURITES} from '../../shared/constants/settings';
import {makeGetSetting} from '../store/selectors/settings';
import {setSetting} from '../store/actions/settings';

const store = window.store;

export class Favourites {
    constructor(nsSelector) {
        this.nsSelector = nsSelector;
    }

    _get() {
        const state = store.getState();
        const parentNS = this.nsSelector(state);
        return makeGetSetting(state)(FAVOURITES, parentNS) || [];
    }

    _set(value) {
        const parentNS = this.nsSelector(store.getState());
        return store.dispatch(setSetting(FAVOURITES, parentNS, value));
    }

    toggle(path) {
        const current = this._get();
        const currentPathItem = {path: path};

        const entry = _.find(current, currentPathItem);

        if (entry) {
            current.splice(current.indexOf(entry), 1);
        } else {
            current.push(currentPathItem);
        }

        return this._set(current);
    }

    get() {
        return _.sortBy(this._get(), 'path');
    }

    has(path) {
        if (path) {
            return Boolean(_.find(this._get(), {path}));
        }
    }
}
