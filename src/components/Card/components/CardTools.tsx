import { useState, useEffect } from 'react';
import ColorPicker from '../../ColorPicker/ColorPicker';
import BackgroundPicker from '../../BackgroundPicker/BackgroundPicker';
import { useCardStore, iCard } from '../../../hooks/useCardStore';
import { useTagStore, iTag } from '../../../hooks/useTagStore';
import { useSettingsStore } from '../../../hooks/useSettingsStore';

import Tag from '../../Tag';

import { FaTags } from 'react-icons/fa';
import { IoIosCopy } from 'react-icons/io';
import { MdAddCircle, MdBarChart, MdDeleteForever, MdEdit } from 'react-icons/md';
import { RiArrowGoBackFill, RiPushpinFill, RiPushpinLine } from 'react-icons/ri';


const CardTools = (props: {
    data: iCard,
    isFlipped: boolean,
    isEditMode: boolean,
    setIsEditMode: (x: boolean) => void,
    isEditStatsMode: boolean,
    setIsEditStatsMode: (x: boolean) => void,
    isDisplayTagsDialog: boolean,
    setIsDisplayTagsDialog: (x: boolean) => void,
}) => {
    const { updateCardColor, deleteCard, addTagToCard, addStatToCard, copyCard, updateCardBackground, setCardPinned } = useCardStore();
    const { tagStore, createTag, getTagByLabel } = useTagStore();
    const [resultsTagsDialog, setResultsTagsDialog] = useState(tagStore);
    const [searchTagsString, setSearchTagsString] = useState('');
    const { setDisplayCard } = useSettingsStore();


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

    useEffect(() => {
        setSearchTagsString('');
    }, [props.isFlipped]);


    const handleChangeColor = (color: any) => {
        updateCardColor(color, props.data.id);
    };
    const handleChangeBackground = (background: string) => {
        updateCardBackground(background, props.data.id);
    };

    // HANDLERS
    const handleSearchTagsChange = (e: any) => {
        setSearchTagsString(e.target.value);
    };

    const handleSearchTagsKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (resultsTagsDialog.length === 0) addTagToCard(props.data.id, createTag({ label: searchTagsString, type: 'default' }));
            else addTagToCard(props.data.id, getTagByLabel(searchTagsString));
            setSearchTagsString('');
        }
    };

    const handleAddTag = (tag_id: number) => {
        addTagToCard(props.data.id, tag_id);
    };


    const getTools = () => {
        if (!props.isFlipped) {
            if (props.isEditMode) {
                return (
                    <div className={'tools-right'}>
                        <button onClick={() => props.setIsEditMode(false)}><RiArrowGoBackFill /></button>
                    </div>
                );
            } else if (props.isEditStatsMode) {
                return (
                    <div className={'tools-right'}>
                        <button onClick={() => addStatToCard(props.data.id)}><MdAddCircle /></button>
                        <button onClick={() => props.setIsEditStatsMode(false)}><RiArrowGoBackFill /></button>
                    </div>
                );
            } else {
                return (
                    <>
                        <div className={'tools-left'}>
                            <button onClick={() => setCardPinned(!props.data.isPinned, props.data.id)}>{props.data.isPinned ? <RiPushpinFill /> : <RiPushpinLine />}</button>
                            <button className={'copy-button'} onClick={() => copyCard(props.data.id)}><IoIosCopy /></button>
                            <button onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                deleteCard(props.data.id);
                            }}><MdDeleteForever /></button>
                            <button
                                onClick={() => {
                                    setDisplayCard(props.data.id);
                                }}
                            >
                                D
                            </button>
                        </div>
                        <div className={'tools-right'}>
                            <button onClick={() => props.setIsEditStatsMode(true)}><MdBarChart /></button>
                            <button onClick={() => props.setIsEditMode(true)}><MdEdit /></button>
                        </div>
                    </>
                );
            }
        } else {
            if (props.isDisplayTagsDialog) {
                return (
                    <div className={'tags-dialog'}>
                        <div className={'results'}>
                            {
                                resultsTagsDialog.reduce((results: iTag[], tag: iTag) => {
                                    if (!props.data.tags.includes(tag.id)) {
                                        results.push(tag);
                                    }
                                    return results;
                                }, [])
                                    .sort((a: iTag, b: iTag) => (a.label > b.label) ? 1 : (a.label < b.label) ? -1 : 0)
                                    .map((tag: iTag, index: number) => <Tag key={index} id={tag.id} label={tag.label} clickHandler={handleAddTag} />)
                            }
                        </div>
                        <form>
                            <input type="text" value={searchTagsString} onChange={handleSearchTagsChange} onKeyDown={handleSearchTagsKeyDown} autoFocus />
                        </form>
                    </div>
                );
            } else {
                return (
                    <>
                        <div className={'tools-left'}>
                            <ColorPicker defaultColor={props.data.color} changeColorHandler={handleChangeColor} />
                            <BackgroundPicker changeBackgroundHandler={handleChangeBackground} />
                        </div>
                        <div className={'tools-right'}>
                            <button onClick={(e) => { e.preventDefault(); props.setIsDisplayTagsDialog(!props.isDisplayTagsDialog); }}><FaTags /></button>
                        </div>
                    </>
                );
            }
        }
    };

    return (
        <div className={'tools'} onClick={(e) => e.stopPropagation()}>
            {getTools()}
        </div>
    );
};
export default CardTools;
