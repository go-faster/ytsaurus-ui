import React, {ForwardRefRenderFunction, forwardRef} from 'react';
import {ArrowToggle, Text} from '@gravity-ui/uikit';
import './FakeSelectButton.scss';
import cn from 'bem-cn-lite';

const block = cn('query-cluster-button');

type Props = {
    title: string;
    open: boolean;
    name: string;
    onClick: () => void;
    loading?: boolean;
};

const Button: ForwardRefRenderFunction<HTMLDivElement, Props> = (
    {title, open, loading, name, onClick},
    ref,
) => {
    return (
        <div className={block({open, loading})} onClick={onClick} ref={ref}>
            <Text ellipsis>
                {title} {name}
            </Text>
            <ArrowToggle direction={open ? 'top' : 'bottom'} />
        </div>
    );
};

export const FakeSelectButton = forwardRef<HTMLDivElement, Props>(Button);
