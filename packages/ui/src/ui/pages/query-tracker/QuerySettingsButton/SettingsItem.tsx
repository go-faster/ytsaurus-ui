import React, {FC, useState} from 'react';
import cn from 'bem-cn-lite';
import './SettingsItem.scss';
import {Icon, IconData, Text, Tooltip} from '@gravity-ui/uikit';
import PencilIcon from '@gravity-ui/icons/svgs/pencil.svg';
import CircleMinusIcon from '@gravity-ui/icons/svgs/circle-minus.svg';
import {
    SaveFormData,
    Props as SettingsItemEditFormProps,
    SettingsItemForm,
} from './SettingsItemForm';

const block = cn('settings-item');
const button = cn('settings-item-button');

type Props = {
    icon: IconData;
    name: string;
    value: string;
    onDelete: (name: string) => void;
    onChange: (data: SaveFormData) => void;
    validator: SettingsItemEditFormProps['validator'];
    canEdit?: SettingsItemEditFormProps['config'];
};

export const SettingsItem: FC<Props> = ({
    icon,
    name,
    value,
    canEdit,
    onDelete,
    validator,
    onChange,
}) => {
    const [edit, setEdit] = useState(false);
    const handleDelete = () => {
        onDelete(name);
    };

    const handleToggleEdit = () => {
        setEdit((prevState) => !prevState);
    };

    const handleChange = (data: SaveFormData) => {
        onChange(data);
        setEdit(false);
    };

    if (edit) {
        return (
            <div className={block({edit: true})}>
                <SettingsItemForm
                    name={name}
                    value={value}
                    onSave={handleChange}
                    onCancel={handleToggleEdit}
                    validator={validator}
                    config={canEdit}
                />
            </div>
        );
    }

    return (
        <div className={block()}>
            <div className={block('info')}>
                <Icon className={block('icon')} data={icon} size={16} />
                <Text variant="subheader-2" ellipsis>
                    {name}
                </Text>
                <Text className={block('value')} ellipsis>
                    {value}
                </Text>
            </div>

            <div className={block('actions')}>
                {canEdit && (
                    <Tooltip content="Edit" placement="top">
                        <button className={button()} onClick={handleToggleEdit}>
                            <Icon data={PencilIcon} size={16} />
                        </button>
                    </Tooltip>
                )}

                <Tooltip content="Remove" placement="top">
                    <button className={button({delete: true})} onClick={handleDelete}>
                        <Icon data={CircleMinusIcon} size={16} />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};
