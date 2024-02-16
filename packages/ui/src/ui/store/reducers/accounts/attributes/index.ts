import {mergeStateOnClusterChange} from '../../utils';
import {
    ADD_ATTRIBUTE,
    SET_ATTRIBUTE_MODAL_ID,
    SET_ATTRIBUTE_MODAL_LOAD,
    SET_ATTRIBUTE_MODAL_VISIBLE,
} from '../../../../constants/accounts/attributes';
import {ActionD} from '../../../../types';

export type AccountsAttributeState = {
    isLoading: boolean;
    isVisible: boolean;
    items: Record<string, string>;
    activeId: string | null;
};

const initialState: AccountsAttributeState = {
    isLoading: false,
    isVisible: false,
    items: {},
    activeId: null,
};

export type AccountsAttributeActions =
    | ActionD<typeof ADD_ATTRIBUTE, Record<string, string>>
    | ActionD<typeof SET_ATTRIBUTE_MODAL_VISIBLE, boolean>
    | ActionD<typeof SET_ATTRIBUTE_MODAL_ID, string>
    | ActionD<typeof SET_ATTRIBUTE_MODAL_LOAD, boolean>;

function reducer(state = initialState, action: AccountsAttributeActions): AccountsAttributeState {
    switch (action.type) {
        case ADD_ATTRIBUTE:
            return {
                ...state,
                items: {...state.items, ...action.data},
            };
        case SET_ATTRIBUTE_MODAL_LOAD:
            return {...state, isLoading: action.data};
        case SET_ATTRIBUTE_MODAL_VISIBLE:
            return {...state, isVisible: action.data};
        case SET_ATTRIBUTE_MODAL_ID:
            return {...state, activeId: action.data};
        default:
            return state;
    }
}

export default mergeStateOnClusterChange(initialState, {}, reducer);
