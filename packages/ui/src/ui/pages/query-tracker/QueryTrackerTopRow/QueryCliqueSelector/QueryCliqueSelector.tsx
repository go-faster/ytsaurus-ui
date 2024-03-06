import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import {FakeSelectButton} from '../FakeSelectButton';
import {PopupList} from '../../PopupList';
import {ChytInfo} from '../../../../store/reducers/chyt/list';
import {QueryCliqueItem} from './QueryCliqueItem';
import './QueryCliqueSelector.scss';
import cn from 'bem-cn-lite';

const block = cn('query-clique-selector');

const filter = (items: ChytInfo[], filterValue: string) => {
    return items.filter(
        (item) => item.alias.includes(filterValue) || item.yt_operation_id?.includes(filterValue),
    );
};

type Props = {
    loading: boolean;
    cliqueList: {alias: string; yt_operation_id?: string}[];
    value: string | undefined;
    onChange: (alias: string) => void;
};

export const QueryCliqueSelector: FC<Props> = ({cliqueList, value, loading, onChange}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const handleTogglePopup = useCallback(() => {
        if (!loading) {
            setOpen((prevState) => !prevState);
        }
    }, [loading]);

    const handleChange = useCallback(
        (alias: string) => {
            onChange(alias);
            setOpen(false);
        },
        [onChange],
    );

    const activeValue = useMemo(() => {
        const activeClique = cliqueList.find((chyt) => chyt.alias === value);
        return activeClique ? activeClique.alias : '';
    }, [cliqueList, value]);

    return (
        <>
            <FakeSelectButton
                title="Clique:"
                open={open}
                name={activeValue}
                onClick={handleTogglePopup}
                ref={ref}
                loading={loading}
            />
            <PopupList
                items={cliqueList}
                filter={filter}
                open={open}
                anchorRef={ref}
                onOutsideClick={handleTogglePopup}
                className={block()}
            >
                {(items) =>
                    items.length > 0 ? (
                        items.map((item) => (
                            <QueryCliqueItem
                                key={item.alias}
                                clique={item}
                                onClick={handleChange}
                            />
                        ))
                    ) : (
                        <div className={block('empty')}>Empty clique list</div>
                    )
                }
            </PopupList>
        </>
    );
};
