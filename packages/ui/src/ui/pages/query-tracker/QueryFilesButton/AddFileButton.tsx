import React, {FC, useRef, useState} from 'react';
import {Button, Icon, Toaster} from '@gravity-ui/uikit';
import FilePlusIcon from '@gravity-ui/icons/svgs/file-plus.svg';
import {QueryFile} from '../module/api';

const readFileAsync = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
};

const toaster = new Toaster();

type Props = {
    onLoad: (file: QueryFile) => void;
};
export const AddFileButton: FC<Props> = ({onLoad}) => {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAddFile = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async ({target}: React.ChangeEvent<HTMLInputElement>) => {
        const uploaded = target.files && target.files[0];
        if (!uploaded) return;
        setLoading(true);

        try {
            const content = await readFileAsync(uploaded);
            onLoad({name: uploaded.name, content, type: 'raw_inline_data'});
        } catch (e) {
            if (e instanceof Error) {
                toaster.add({
                    name: 'add_query_file',
                    type: 'error',
                    title: 'Failed to load file',
                    content: e?.message,
                    autoHiding: false,
                });
            } else {
                console.log('Unknown error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button width="auto" onClick={handleAddFile} size="l" loading={loading}>
                <Icon data={FilePlusIcon} size={16} />
                Add file
            </Button>
            <input
                ref={inputRef}
                type="file"
                style={{display: 'none'}}
                onChange={handleFileChange}
            />
        </>
    );
};
