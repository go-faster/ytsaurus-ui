import React, {FC} from 'react';
import {ClusterConfig} from '../../../../../shared/yt-types';
import cn from 'bem-cn-lite';
import './QueryClusterItem.scss';
import {Text} from '@gravity-ui/uikit';
import {QueryClusterIcon} from './QueryClusterIcon';

const block = cn('query-cluster-item');

type Props = {
    active: boolean;
    cluster: ClusterConfig;
    onClick: (clusterId: string) => void;
};

export const QueryClusterItem: FC<Props> = ({active, cluster, onClick}) => {
    const handleClick = () => {
        onClick(cluster.id);
    };

    return (
        <div className={block({active})} onClick={handleClick}>
            <QueryClusterIcon clusterId={cluster.id} name={cluster.name} />
            <div className={block('info')}>
                {cluster.name}
                <Text color="secondary" className={block('environment')}>
                    {cluster.environment}
                </Text>
            </div>
        </div>
    );
};
