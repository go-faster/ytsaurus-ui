import React, {FC, useMemo} from 'react';
import Link from '../../../../components/Link/Link';
import Icon from '../../../../components/Icon/Icon';
import {Tooltip} from '../../../../components/Tooltip/Tooltip';
import {makeRoutedURL} from '../../../../store/location';
import {Page} from '../../../../../shared/constants/settings';
import cn from 'bem-cn-lite';

const block = cn('account-usage-details');

export type Props = {
    cluster: string;
    path: string;
};

export const AccountLink: FC<Props> = ({cluster, path}) => {
    const navigationUrl = useMemo(() => {
        return makeRoutedURL(`/${cluster}/${Page.NAVIGATION}`, {path});
    }, [cluster, path]);

    return (
        <Link theme={'secondary'} url={navigationUrl} routed routedPreserveLocation>
            <Tooltip
                content={<span className={block('no-wrap')}>Open original path in Navigation</span>}
                placement={'left'}
            >
                <Icon awesome={'folder-tree'} />
            </Tooltip>
        </Link>
    );
};
