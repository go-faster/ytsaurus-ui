import React, {FC, useCallback} from 'react';
import {Dialog, Flex, Loader} from '@gravity-ui/uikit';
import {useDispatch, useSelector} from 'react-redux';
import {SET_ATTRIBUTE_MODAL_VISIBLE} from '../../../../constants/accounts/attributes';
import {getAttributeModal} from '../../../../store/selectors/accounts/account-usage';
import Yson from '../../../../components/Yson/Yson';

export const AttributeModal: FC = () => {
    const {isVisible, isLoading, data} = useSelector(getAttributeModal);
    const dispatch = useDispatch();

    const handleToggleModal = useCallback(() => {
        dispatch({type: SET_ATTRIBUTE_MODAL_VISIBLE, data: false});
    }, [dispatch]);

    return (
        <Dialog open={isVisible} size="l" onClose={handleToggleModal}>
            <Dialog.Header />
            <Dialog.Body>
                {isLoading && (
                    <Flex justifyContent="center" alignItems="center">
                        <Loader size="m" />
                    </Flex>
                )}
                {data && <Yson value={data} />}
            </Dialog.Body>
            <Dialog.Footer preset="default" showError={false} listenKeyEnter={false} />
        </Dialog>
    );
};
