import {ActionD, YTError} from '../../../types';
import {mergeStateOnClusterChange} from '../utils';
import {CHYT_OPTIONS} from '../../../constants/chyt-page';
import {ChytDescribeOptionsType} from '../../actions/chyt/api';

export type ChytCliqueOptionsState = {
    loaded: boolean;
    loading: boolean;
    error: YTError | undefined;

    dataAlias: string;
    data: ChytDescribeOptionsType | undefined;
};

const initialState: ChytCliqueOptionsState = {
    loaded: false,
    loading: false,
    error: undefined,
    dataAlias: '',
    data: undefined,
};

function reducer(state = initialState, action: ChytCliqueOptionsAction) {
    switch (action.type) {
        case CHYT_OPTIONS.REQUEST:
            return {...state, ...action.data, loading: true};
        case CHYT_OPTIONS.SUCCESS:
            return {...state, ...action.data, loading: false, loaded: true, error: undefined};
        case CHYT_OPTIONS.FAILURE:
            return {...state, ...action.data, loading: false};
        default:
            return state;
    }
}

export type ChytCliqueOptionsAction =
    | ActionD<typeof CHYT_OPTIONS.REQUEST, Pick<ChytCliqueOptionsState, 'dataAlias'>>
    | ActionD<typeof CHYT_OPTIONS.SUCCESS, Pick<ChytCliqueOptionsState, 'data' | 'dataAlias'>>
    | ActionD<typeof CHYT_OPTIONS.FAILURE, Pick<ChytCliqueOptionsState, 'error'>>;

export default mergeStateOnClusterChange(initialState, {}, reducer);