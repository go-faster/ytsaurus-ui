import {CHYT_LIST_FILTERS} from '../../../constants/chyt-page';
import {ActionD, SortState} from '../../../types';
import {replaceEmpty} from '../../../utils/empty';
import {ChytInfo} from './list';

export type ChytListFilters = {
    name: string;
    creator: string | undefined;
    state: string | undefined;
    health: string | undefined;

    sortState: Array<SortState<keyof ChytInfo>>;
};

export const initialState: ChytListFilters = {
    name: '',
    creator: undefined,
    state: undefined,
    health: undefined,

    sortState: [{column: 'alias', order: 'asc'}],
};

export default function reducer(state = initialState, action: ChytListFiltersAction) {
    switch (action.type) {
        case CHYT_LIST_FILTERS:
            return {...state, ...replaceEmpty(action.data)};
        default:
            return state;
    }
}

export type ChytListFiltersAction = ActionD<typeof CHYT_LIST_FILTERS, Partial<ChytListFilters>>;
