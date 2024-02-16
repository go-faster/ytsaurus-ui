import React, {FC, useCallback} from 'react';
import Icon from '../../../../components/Icon/Icon';
import Button from '../../../../components/Button/Button';
import {Flex} from '@gravity-ui/uikit';
import {AccountLink, Props as AccountLinkProps} from './AccountLink';
import {AccountRequestData} from '../../../../store/actions/accounts/attributes';

type Props = AccountLinkProps & {
    account: string;
    onAttributeButtonClick: (accountData: AccountRequestData) => void;
};

export const AccountActionsField: FC<Props> = ({
    path,
    account,
    cluster,
    onAttributeButtonClick,
}) => {
    const handleOpenAttributeModal = useCallback(() => {
        onAttributeButtonClick({path, account, cluster});
    }, [onAttributeButtonClick, path, account, cluster]);

    if (!path) return undefined;

    return (
        <Flex gap={1} alignItems="center">
            <Button
                view="flat"
                withTooltip
                tooltipProps={{placement: 'bottom-end', content: 'Show transactions'}}
                onClick={handleOpenAttributeModal}
            >
                <Icon awesome="at" />
            </Button>
            <AccountLink cluster={cluster} path={path} />
        </Flex>
    );
};
