import {useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {QueriesListAuthorFilter} from '../../module/queries_list/types';
import {AllColumns, MyColumns, NameColumns} from './index';
import {setSettingByKey} from '../../../../store/actions/settings';
import {
    getQueryListHistoryAllColumns,
    getQueryListHistoryMyColumns,
} from '../../module/queries_list/selectors';

export const useQueryHistoryListColumns = ({type}: {type?: QueriesListAuthorFilter}) => {
    const dispatch = useDispatch();
    const selectedMyColumns = useSelector(getQueryListHistoryMyColumns);
    const selectedAllColumns = useSelector(getQueryListHistoryAllColumns);

    const handleColumnChange = (selectedColumns: {
        items: Array<{checked: boolean; name: string}>;
    }) => {
        const settingKey =
            type === QueriesListAuthorFilter.My
                ? 'local::queryTracker::history::MyColumns'
                : 'local::queryTracker::history::AllColumns';

        dispatch(
            setSettingByKey(
                settingKey,
                selectedColumns.items.filter(({checked}) => checked).map(({name}) => name),
            ),
        );
    };

    const data = useMemo(() => {
        const getCurrentColumns = () => {
            switch (type) {
                case QueriesListAuthorFilter.My: {
                    return {
                        currentColumns: MyColumns,
                        currentSelectedColumnNames: selectedMyColumns,
                    };
                }

                case QueriesListAuthorFilter.All: {
                    return {
                        currentColumns: AllColumns,
                        currentSelectedColumnNames: selectedAllColumns,
                    };
                }

                default:
                    throw new Error('Unknown type of filter');
            }
        };

        const currentColumns = getCurrentColumns();

        const selectedColumnNames = new Set(
            Array.isArray(currentColumns.currentSelectedColumnNames)
                ? currentColumns.currentSelectedColumnNames
                : MyColumns.map((item) => item.name),
        );

        selectedColumnNames.add(NameColumns.name);

        return {
            columns: currentColumns.currentColumns.filter(({name}) =>
                selectedColumnNames.has(name),
            ),
            allowedColumns: currentColumns.currentColumns
                .filter((item) => item.name !== NameColumns.name)
                .map(({name}) => ({name, checked: selectedColumnNames.has(name)})),
        };
    }, [type, selectedAllColumns, selectedMyColumns]);

    return {
        ...data,
        handleColumnChange,
    };
};
