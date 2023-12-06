import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RouteComponentProps, useHistory} from 'react-router';
import moment from 'moment';

import {Loader, Text} from '@gravity-ui/uikit';

import format from '../../../common/hammer/format';

import {useUpdater} from '../../../hooks/use-updater';
import Alert from '../../../components/Alert/Alert';
import Error from '../../../components/Error/Error';
import Label from '../../../components/Label/Label';
import MetaTable, {MetaTableItem} from '../../../components/MetaTable/MetaTable';
import {OperationId} from '../../../components/OperationId/OperationId';
import StatusLabel from '../../../components/StatusLabel/StatusLabel';
import {UserCard} from '../../../components/UserLink/UserLink';

import {chytCliqueLoad, chytResetCurrentClique} from '../../../store/actions/chyt/clique';
import {
    getChytCliqueData,
    getChytCliqueError,
    getChytCliqueInitialLoading,
    getChytCliqueStartError,
} from '../../../store/selectors/chyt/clique';
import {getCluster} from '../../../store/selectors/global';
import {Page} from '../../../../shared/constants/settings';

import {CliqueState} from '../components/CliqueState';
import {ChytCliqueActions} from '../ChytCliqueActions/ChytCliqueActions';
import {ChytPageCliqueTabs} from './ChytPageCliqueTabs';
import {ChytSpecletEditButton} from './ChytPageCliqueSpeclet';
import cn from 'bem-cn-lite';

import './ChytPageClique.scss';

const block = cn('chyt-page-clique');

export function ChytPageClique(props: RouteComponentProps<{alias: string}>) {
    const dispatch = useDispatch();
    const history = useHistory();
    const cluster = useSelector(getCluster);

    const {alias} = props.match.params;
    const update = React.useCallback(() => {
        dispatch(chytCliqueLoad(alias));
    }, [alias]);

    React.useEffect(() => {
        return () => {
            dispatch(chytResetCurrentClique());
        };
    }, [alias]);

    const {yt_operation, pool} = useSelector(getChytCliqueData) ?? {};
    const initialLoading = useSelector(getChytCliqueInitialLoading);

    useUpdater(update);

    return (
        <div className={block()}>
            <div className={block('header')}>
                <Text variant="header-1">CHYT clique *{alias}</Text>
                <StatusLabel
                    className={block('header-operation-state')}
                    label={yt_operation?.state as any}
                />
                {initialLoading && <Loader className={block('loader')} size="s" />}
                <span className={block('spacer')} />

                <ChytCliqueActions
                    alias={alias}
                    pool={pool}
                    showAllButtons
                    onAction={(action) => {
                        if (action === 'remove') {
                            history.push(`/${cluster}/${Page.CHYT}`);
                        } else {
                            update();
                        }
                    }}
                />
                <span className={block('edit')}>
                    <ChytSpecletEditButton compact />
                </span>
            </div>
            <ChytCliqueErrors />
            <ChytCliqueMetaTable />
            <ChytPageCliqueTabs className={block('tabs')} />
        </div>
    );
}

function ChytCliqueErrors() {
    const error = useSelector(getChytCliqueError);
    const startError = useSelector(getChytCliqueStartError);
    const {health_reason} = useSelector(getChytCliqueData) ?? {};

    return (
        <React.Fragment>
            {error ? <Error className={block('error')} error={error} bottomMargin /> : null}
            {startError ? (
                <Error
                    header="Failed to start"
                    className={block('error')}
                    error={{message: startError}}
                    bottomMargin
                />
            ) : null}
            {health_reason ? (
                <Alert header="Health reason" type="alert" message={health_reason} bottomMargin />
            ) : null}
        </React.Fragment>
    );
}

function ChytCliqueMetaTable() {
    const cluster = useSelector(getCluster);
    const data = useSelector(getChytCliqueData);

    const items: Array<Array<MetaTableItem>> = React.useMemo(() => {
        const {
            pool,
            state,
            stage,
            ctl_attributes,
            yt_operation,
            health,
            incarnation_index,
            creator,
            speclet_modification_time,
            strawberry_state_modification_time,
        } = data ?? {};

        const {start_time, finish_time, id} = yt_operation ?? {};

        const start_time_number = start_time ? moment(start_time).valueOf() : undefined;
        const finish_time_number = finish_time
            ? moment(finish_time).valueOf()
            : start_time_number
            ? Date.now()
            : undefined;

        const duration =
            !start_time_number || !finish_time_number
                ? undefined
                : finish_time_number - start_time_number;

        return [
            [
                {
                    key: 'Pool',
                    value: pool ? pool : format.NO_VALUE,
                },
                {
                    key: 'Creator',
                    value: creator ? <UserCard userName={creator} /> : format.NO_VALUE,
                },
                {
                    key: 'Instances',
                    value: format.Number(ctl_attributes?.instance_count),
                },
                {
                    key: 'Cores',
                    value: format.Number(ctl_attributes?.total_cpu),
                },
                {
                    key: 'Memory',
                    value: format.Bytes(ctl_attributes?.total_memory),
                },
                {
                    key: 'Modification time',
                    value: format.DateTime(speclet_modification_time),
                },
            ],
            [
                {key: 'State', value: <CliqueState state={state} />},
                {key: 'Health', value: <CliqueState state={health} />},
                {key: 'Incarnation index', value: format.Number(incarnation_index)},
                {key: 'Stage', value: stage ? <Label capitalize text={stage} /> : format.NO_VALUE},
                {
                    key: 'SB modification time',
                    value: format.DateTime(strawberry_state_modification_time),
                },
            ],
            [
                {
                    key: 'Operation id',
                    value: (
                        <div className={block('operation-id')}>
                            <OperationId id={id} cluster={cluster} />
                        </div>
                    ),
                },
                {
                    key: 'Operation state',
                    value: format.ReadableField(yt_operation?.state),
                },
                {
                    key: 'Start time',
                    value: format.DateTime(start_time),
                },
                {
                    key: 'Finish time',
                    value: format.DateTime(finish_time),
                },
                {
                    key: 'Duration',
                    value: duration ? format.TimeDuration(duration) : format.NO_VALUE,
                },
            ],
        ];
    }, [data, cluster]);

    return <MetaTable items={items} />;
}
