import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import cn from 'bem-cn-lite';
import {map} from 'lodash';
import {
    changeObjectPermissionsFilter,
    changeObjectSubjectFilter,
} from '../../../store/actions/acl-filters';
import {
    getObjectPermissionsFilter,
    getObjectSubjectFilter,
} from '../../../store/selectors/acl-filters';
import {getObjectPermissionsTypesList} from '../../../store/selectors/acl';
import Filter from '../../../components/Filter/Filter';
import Select from '../../Select/Select';
import './ObjectPermissionsFilters.scss';

const block = cn('object-permissions-filters');

interface Props {
    idmKind: string;
}

export default function ObjectPermissionsFilters({idmKind, ...rest}: Props) {
    const dispatch = useDispatch();
    const subjectFilter = useSelector(getObjectSubjectFilter);
    const selectedPermissons = useSelector(getObjectPermissionsFilter);
    const permissionList = useSelector(getObjectPermissionsTypesList(idmKind));

    return (
        <div className={block()} {...rest}>
            <Filter
                placeholder="Filter by subject"
                onChange={(value: string) => {
                    dispatch(
                        changeObjectSubjectFilter({
                            objectSubject: value,
                        }),
                    );
                }}
                className={block('subject-filter')}
                value={subjectFilter}
                size="m"
            />
            <Select
                multiple
                placeholder={'select'}
                value={selectedPermissons}
                items={map(permissionList, (p) => ({value: p, text: p}))}
                onUpdate={(value: string[]) => {
                    dispatch(
                        changeObjectPermissionsFilter({
                            objectPermissions: value,
                        }),
                    );
                }}
                label={'Permissions'}
                hideFilter={true}
                maxVisibleValues={4}
            />
        </div>
    );
}
