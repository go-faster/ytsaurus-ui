import {ThunkAction} from 'redux-thunk';
import {RootState} from '../../reducers';
import {AccountsAttributeActions} from '../../reducers/accounts/attributes';
import {
    ADD_ATTRIBUTE,
    SET_ATTRIBUTE_MODAL_ID,
    SET_ATTRIBUTE_MODAL_LOAD,
    SET_ATTRIBUTE_MODAL_VISIBLE,
} from '../../../constants/accounts/attributes';
import {accountUsageApiUrl} from './account-usage';
import axios, {AxiosError} from 'axios';
import {Toaster} from '@gravity-ui/uikit';
import {showErrorPopup} from '../../../utils/utils';

type AccountsThunkAction = ThunkAction<void, RootState, any, AccountsAttributeActions>;
type GetAccountAttributeResponse = {transactions: any; available: boolean};

export type AccountRequestData = {
    path: string;
    account: string;
    cluster: string;
};

export const showAccountAttribute =
    ({path, account, cluster}: AccountRequestData): AccountsThunkAction =>
    async (dispatch, getState) => {
        const attributes = getState().accounts.attributes.items;

        if (!path) return;

        const key = `${cluster}_${account}_${path}`;

        dispatch({type: SET_ATTRIBUTE_MODAL_ID, data: key});
        dispatch({type: SET_ATTRIBUTE_MODAL_VISIBLE, data: true});

        if (key in attributes) {
            dispatch({type: SET_ATTRIBUTE_MODAL_LOAD, data: false});
            return;
        }

        dispatch({type: SET_ATTRIBUTE_MODAL_LOAD, data: true});
        try {
            const {data} = await axios.request<GetAccountAttributeResponse>({
                method: 'POST',
                url: accountUsageApiUrl('get-versioned-resource-usage'),
                data: {
                    cluster,
                    account,
                    path,
                    timestamp_rounding_policy: 'closest',
                },
                withCredentials: true,
            });
            dispatch({type: ADD_ATTRIBUTE, data: {[key]: JSON.stringify(data)}});
        } catch (e: any) {
            if (!(e instanceof AxiosError)) return;

            const toaster = new Toaster();
            toaster.add({
                name: 'load/accounts/attribute',
                autoHiding: false,
                type: 'error',
                content: `[code ${e.code}] ${e.message}`,
                title: 'Could not load attribute',
                actions: [
                    {
                        label: ' view',
                        onClick: () => showErrorPopup(e),
                    },
                ],
            });
        } finally {
            dispatch({type: SET_ATTRIBUTE_MODAL_LOAD, data: false});
        }
    };
