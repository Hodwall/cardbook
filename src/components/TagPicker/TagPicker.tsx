import { useState, useEffect, useRef } from 'react';
import { Popover } from 'react-tiny-popover';
import { useTagStore, iTag } from '../../hooks/useTagStore';
import { useSettingsStore } from '../../hooks/useSettingsStore';
import { MdAdd, MdOutlineClose } from 'react-icons/md';
import TagPickerAnimation from './TagPickerAnimation';
import Tag from '../Tag';

import { FaTags } from 'react-icons/fa';
import './TagPicker.css';


const TagPicker = (props: {
    tags: number[];
    shelfIndex: number,
}
) => {
    const { tagStore, getTagById, getTagByLabel } = useTagStore();
    const { addTagToShelf } = useSettingsStore();

    const [resultsTagsDialog, setResultsTagsDialog] = useState(tagStore);
    const [searchTagsString, setSearchTagsString] = useState('');

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const section_tags = props.tags.reduce((results: iTag[], tag: number) => {
        results.push(getTagById(tag));
        return results;
    }, []);


    useEffect(() => {
        if (!searchTagsString || searchTagsString === '') {
            setResultsTagsDialog(tagStore);
        } else {
            setResultsTagsDialog(tagStore.reduce((results: iTag[], tag: iTag) => {
                if (tag.label.search(searchTagsString) != -1) results.push(tag);
                return results;
            }, []));
        }
    }, [tagStore, searchTagsString]);


    const handleSearchTagsChange = (e: any) => {
        setSearchTagsString(e.target.value);
    };

    const handleSearchTagsKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (resultsTagsDialog.length) addTagToShelf(props.shelfIndex, getTagByLabel(searchTagsString).id);
            setSearchTagsString('');
        }
    };




    // HANDLE OUTSIDE CLICKS
    // const ref = useRef<any>(null);
    // const handleClickOutside = (event: any) => {
    //     if (ref.current && !ref.current.contains(event.target)) {
    //         //   setDisplayTagsDialog(false);
    //         //   setEditMode(false);
    //         //   setEditStatsMode(false);
    //     }
    // };
    // useEffect(() => {
    //     const delta = 0;
    //     let startX: number;
    //     let startY: number;
    //     document.addEventListener('mousedown', function (event) {
    //         startX = event.pageX;
    //         startY = event.pageY;
    //     });
    //     document.addEventListener('mouseup', function (event) {
    //         const diffX = Math.abs(event.pageX - startX);
    //         const diffY = Math.abs(event.pageY - startY);
    //         if (diffX < delta && diffY < delta) {
    //             handleClickOutside(event);
    //         }
    //     });
    // }, []);



    // const { activeDeck, createDeck, updateActiveDeck, updateDeckIsStrict } = useDeckStore();
    // const { activeTags, updateActiveTags } = useTagStore();
    const handlePopover = () => setIsPopoverOpen(!isPopoverOpen);

    // const handleCreateDeck = (e: any) => {
    //     console.log(e);
    //     e.preventDefault();
    //     if (e.target[0].value) {
    //         createDeck(e.target[0].value, false, activeTags);
    //         setIsPopoverOpen(false);
    //     }
    // };

    return (
        <Popover
            isOpen={isPopoverOpen}
            positions={['bottom']} // if you'd like, you can limit the positions
            padding={12}
            align={'end'}
            reposition={false} // prevents automatic readjustment of content position that keeps your popover content within its parent's bounds
            onClickOutside={() => setIsPopoverOpen(false)} // handle click events outside of the popover/target here!
            content={({ position, nudgedLeft, nudgedTop }) => ( // you can also provide a render function that injects some useful stuff!
                <>
                    <TagPickerAnimation >
                        <div className={'tagpicker-input'}>
                            <div className={'card-tags-dialog-results'}>
                                {
                                    resultsTagsDialog.reduce((results: iTag[], tag: iTag) => {
                                        if (!props.tags.includes(tag.id)) {
                                            results.push(tag);
                                        }
                                        return results;
                                    }, [])
                                        .sort((a: iTag, b: iTag) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0)
                                        .map((tag: iTag, index: number) => <Tag key={index} id={tag.id} label={tag.label} clickHandler={() => addTagToShelf(props.shelfIndex, tag.id)} />)
                                }
                            </div>
                            <form>
                                <input type="text" value={searchTagsString} onChange={handleSearchTagsChange} onKeyDown={handleSearchTagsKeyDown} autoFocus />
                            </form>
                            <button onClick={handlePopover}><MdOutlineClose /></button>
                        </div>
                    </TagPickerAnimation>
                </>
            )}
        >
            <button onClick={(e: any) => {
                e.stopPropagation();
                handlePopover();
            }}><FaTags /></button>
        </Popover>
    );
};

export default TagPicker;