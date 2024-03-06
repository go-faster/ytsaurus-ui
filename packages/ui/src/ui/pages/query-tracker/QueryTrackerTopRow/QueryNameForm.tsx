import React, {ChangeEvent, FC, KeyboardEvent, useCallback, useRef, useState} from 'react';
import {Button, Icon, Popup, Text, TextInput, Tooltip} from '@gravity-ui/uikit';
import PencilIcon from '@gravity-ui/icons/svgs/pencil.svg';
import XmarkIcon from '@gravity-ui/icons/svgs/xmark.svg';
import CheckIcon from '@gravity-ui/icons/svgs/check.svg';
import cn from 'bem-cn-lite';
import './QueryNameForm.scss';

const ELEMENT_SIZE = 'l';
const NAME_PLACEHOLDER = 'No name';

const form = cn('query-name-form');
const popup = cn('query-name-popup');

type Props = {
    queryName?: string;
    onSave: (name: string | undefined) => void;
};

export const QueryNameForm: FC<Props> = ({queryName, onSave}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const currentName = useRef(queryName);

    const formName = queryName || NAME_PLACEHOLDER;

    const handleToggleEditMode = useCallback(() => {
        setOpen((prevState) => !prevState);
    }, []);

    const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        currentName.current = e.currentTarget.value;
    }, []);

    const handleCancel = useCallback(() => {
        currentName.current = queryName;
        setOpen(false);
    }, [queryName]);

    const handleSave = useCallback(() => {
        onSave(currentName.current);
        setOpen(false);
    }, [onSave]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleSave();
            }
            if (e.key === 'Escape') {
                handleCancel();
            }
        },
        [handleSave, handleCancel],
    );

    return (
        <>
            <div className={form()}>
                <Tooltip content={formName}>
                    <Text
                        className={form('name')}
                        title={queryName}
                        variant="body-1"
                        color={queryName ? 'primary' : 'secondary'}
                        ellipsis
                    >
                        {formName}
                    </Text>
                </Tooltip>
                <div ref={ref}>
                    <Button
                        view={open ? 'outlined-info' : 'outlined'}
                        selected={open}
                        onClick={handleToggleEditMode}
                        size={ELEMENT_SIZE}
                    >
                        <Icon data={PencilIcon} size={16} />
                    </Button>
                </div>
            </div>
            <Popup anchorRef={ref} open={open} onOutsideClick={handleCancel} className={popup()}>
                <TextInput
                    defaultValue={currentName.current}
                    onChange={handleChangeName}
                    onKeyDown={handleKeyDown}
                    hasClear
                    size={ELEMENT_SIZE}
                />
                <Button size={ELEMENT_SIZE} view="normal" onClick={handleSave}>
                    <Icon data={CheckIcon} size={16} />
                </Button>
                <Button size={ELEMENT_SIZE} view="flat" onClick={handleCancel}>
                    <Icon data={XmarkIcon} size={16} />
                </Button>
            </Popup>
        </>
    );
};
