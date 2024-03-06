import React, {ChangeEvent, ReactNode, useMemo, useState} from 'react';
import {Popup, PopupProps, TextInput} from '@gravity-ui/uikit';
import cn from 'bem-cn-lite';
import './PopupList.scss';

const block = cn('popup-list');

type Props<T> = {
    open: boolean;
    filter: (items: T[], filter: string) => T[];
    filterPlaceholder?: string;
    items: T[];
    children: (items: T[]) => ReactNode;
    onOutsideClick?: () => void;
    className?: string;
} & Pick<PopupProps, 'anchorRef'>;

export const PopupList = <T,>({
    open,
    anchorRef,
    items,
    filter,
    filterPlaceholder = 'Search',
    onOutsideClick,
    children,
    className,
}: Props<T>): JSX.Element => {
    const [filterValue, setFilterValue] = useState('');

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterValue(e.currentTarget.value);
    };

    const handleOutsideClick = () => {
        setFilterValue('');
        if (onOutsideClick) onOutsideClick();
    };

    const listItems = useMemo(() => {
        if (!filterValue) return items;
        return filter(items, filterValue);
    }, [filter, items, filterValue]);

    return (
        <Popup
            open={open}
            anchorRef={anchorRef}
            className={block(null, className)}
            onOutsideClick={handleOutsideClick}
        >
            <div className={block('search-wrap')}>
                <TextInput
                    defaultValue=""
                    onChange={handleFilterChange}
                    placeholder={filterPlaceholder}
                    size="l"
                    hasClear
                />
            </div>
            <div className={block('spacer')} />
            <div className={block('items-wrap')}>{children(listItems)}</div>
        </Popup>
    );
};
