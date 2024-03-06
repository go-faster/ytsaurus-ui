import React, {FC, useMemo} from 'react';
import './QueryClusterIcon.scss';
import {useClusterColorClassName} from '../../../../containers/ClusterPageHeader/ClusterColor';
import cn from 'bem-cn-lite';

const block = cn('query-cluster-icon');

type Props = {
    clusterId: string;
    name: string;
};
export const QueryClusterIcon: FC<Props> = ({clusterId, name}) => {
    const clusterColorClassName = useClusterColorClassName(clusterId);

    const shortName = useMemo(() => {
        return name.slice(0, 2);
    }, [name]);

    return <div className={`${block()} ${clusterColorClassName}`}>{shortName}</div>;
};
