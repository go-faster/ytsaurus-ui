import React, {FC, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RowWithName} from '../../../containers/AppNavigation/TopRowContent/SectionName';
import {Page} from '../../../../shared/constants/settings';
import {
    getCliqueLoading,
    getCliqueMap,
    getQuery,
    getQueryDraft,
    getQueryGetParams,
} from '../module/query/selectors';
import {getCliqueByCluster, resetQueryTracker, updateQueryDraft} from '../module/query/actions';
import {RightButtonsGroup} from './RightButtonsGroup';
import {HeadSpacer} from '../../../containers/ClusterPageHeader/HeadSpacer';
import {QueryNameForm} from './QueryNameForm';
import {Flex} from '@gravity-ui/uikit';
import {QueryEngineSelector} from '../QueryEngineSelector';
import {QuerySettingsButton} from '../QuerySettingsButton';
import {QueryFilesButton} from '../QueryFilesButton';
import {QueryFile} from '../module/api';
import {getClusterList} from '../../../store/selectors/slideoutMenu';
import {QuerySelectorsByEngine} from './QuerySelectorsByEngine';
import {QueryEngine} from '../module/engines';

const QueryTrackerTopRow: FC = () => {
    const dispatch = useDispatch();
    const {cluster, path} = useSelector(getQueryGetParams);
    const {annotations, files, settings, engine} = useSelector(getQueryDraft);
    const originalQuery = useSelector(getQuery);
    const clusters = useSelector(getClusterList);
    const cliqueMap = useSelector(getCliqueMap);
    const cliqueLoading = useSelector(getCliqueLoading);

    const handleChangeEngine = useCallback(
        (newEngine: QueryEngine) => {
            const newSettings = {...settings};

            if (newEngine !== QueryEngine.SPYT && 'path' in newSettings) {
                delete newSettings['path'];
            }
            if (newEngine !== QueryEngine.CHYT && 'clique' in newSettings) {
                delete newSettings['clique'];
            }

            dispatch(updateQueryDraft({settings: newSettings}));
        },
        [dispatch, settings],
    );

    const handleCreateNewQuery = useCallback(() => {
        dispatch(resetQueryTracker());
    }, [dispatch]);

    const handleNameChange = useCallback(
        (title: string | undefined) => {
            dispatch(updateQueryDraft({annotations: {title}}));
        },
        [dispatch],
    );

    const handleSettingsChange = useCallback(
        (newSettings: Record<string, string>) =>
            dispatch(updateQueryDraft({settings: newSettings})),
        [dispatch],
    );

    const handleClusterChange = useCallback(
        (clusterId: string) => {
            const newSettings = {...settings};
            if ('clique' in newSettings) {
                delete newSettings['clique'];
            }
            if (engine === QueryEngine.CHYT && clusterId) {
                dispatch(getCliqueByCluster(clusterId));
            }

            dispatch(updateQueryDraft({settings: {...newSettings, cluster: clusterId}}));
        },
        [dispatch, engine, settings],
    );

    const handleCliqueChange = useCallback(
        (alias: string) => {
            dispatch(updateQueryDraft({settings: {...settings, clique: alias}}));
        },
        [dispatch, settings],
    );

    const handlePathChange = useCallback(
        (newPath: string) => {
            dispatch(updateQueryDraft({settings: {...settings, path: newPath}}));
        },
        [dispatch, settings],
    );

    const handleFilesChange = useCallback(
        (newFiles: QueryFile[]) => dispatch(updateQueryDraft({files: newFiles})),
        [dispatch],
    );

    return (
        <RowWithName page={Page.QUERIES}>
            <Flex alignItems="center" gap={4} grow={1}>
                <QueryNameForm queryName={annotations?.title} onSave={handleNameChange} />
                <HeadSpacer />
                <QueryEngineSelector cluster={cluster} path={path} onChange={handleChangeEngine} />
                <QuerySelectorsByEngine
                    settings={settings}
                    engine={engine}
                    clusters={clusters}
                    cliqueMap={cliqueMap}
                    cliqueLoading={cliqueLoading}
                    onClusterChange={handleClusterChange}
                    onCliqueChange={handleCliqueChange}
                    onPathChange={handlePathChange}
                />
                <Flex gap={2}>
                    <QuerySettingsButton settings={settings} onChange={handleSettingsChange} />
                    <QueryFilesButton
                        files={files}
                        onChange={handleFilesChange}
                        queryId={originalQuery?.id ?? ''}
                    />
                </Flex>
            </Flex>
            <RightButtonsGroup onQueryCreate={handleCreateNewQuery} />
        </RowWithName>
    );
};

export default QueryTrackerTopRow;
