import React, {FC} from 'react';
import {ChytInfo} from '../../../../store/reducers/chyt/list';
import './QueryCliqueItem.scss';
import cn from 'bem-cn-lite';
import {Text} from '@gravity-ui/uikit';

const block = cn('query-clique-item');

type Props = {
    clique: ChytInfo;
    onClick: (alias: string) => void;
};

export const QueryCliqueItem: FC<Props> = ({clique, onClick}) => {
    const handleClick = () => {
        onClick(clique.alias);
    };

    return (
        <div className={block()} onClick={handleClick}>
            {clique.alias}
            <Text color="secondary">{clique.yt_operation_id}</Text>
        </div>
    );
};
