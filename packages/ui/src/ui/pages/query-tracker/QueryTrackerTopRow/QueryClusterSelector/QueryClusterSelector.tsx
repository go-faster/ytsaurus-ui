import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {PopupList} from '../../PopupList';
import {ClusterConfig} from '../../../../../shared/yt-types';
import {QueryClusterItem} from './QueryClusterItem';
import {FakeSelectButton} from '../FakeSelectButton';

const filter = (items: ClusterConfig[], filterValue: string) => {
    return items.filter((cluster) => cluster.id.includes(filterValue));
};

type Props = {
    clusters: ClusterConfig[];
    value: string | undefined;
    onChange: (clusterId: string) => void;
};

export const QueryClusterSelector: FC<Props> = ({clusters, value, onChange}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const handleTogglePopup = useCallback(() => {
        setOpen((prevState) => !prevState);
    }, []);

    const handleChange = useCallback(
        (clusterId: string) => {
            onChange(clusterId);
            setOpen(false);
        },
        [onChange],
    );

    const activeValue = useMemo(() => {
        const activeCluster = clusters.find((cluester) => cluester.id === value);
        return activeCluster ? activeCluster.id : '';
    }, [clusters, value]);

    return (
        <>
            <FakeSelectButton
                title="Cluster:"
                open={open}
                name={activeValue}
                onClick={handleTogglePopup}
                ref={ref}
            />
            <PopupList
                items={clusters}
                filter={filter}
                open={open}
                anchorRef={ref}
                onOutsideClick={handleTogglePopup}
            >
                {(items) =>
                    items.map((item) => (
                        <QueryClusterItem
                            key={item.name}
                            active={item.id === value}
                            cluster={item}
                            onClick={handleChange}
                        />
                    ))
                }
            </PopupList>
        </>
    );
};
