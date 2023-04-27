//@ts-nocheck
interface FlexItemInfo {
    element: Element;
    x: number;
    y: number;
    width: number;
    height: number;
}

export const useFlexAnimation = (container_selector: string) => {
    const container = document.querySelector(container_selector);

    const removeFlexItem = (id: string, callback: Function): void => {
        console.log(id);
        const item = document.querySelector(id);
        const oldFlexItemsInfo = getFlexItemsInfo(container);
        item.style.display = 'none';
        const newFlexItemsInfo = getFlexItemsInfo(container);
        aminateFlexItems(oldFlexItemsInfo, newFlexItemsInfo);
        callback();
    };

    const getFlexItemsInfo = (): FlexItemInfo[] => {
        return Array.from(container.children).map((item) => {
            const rect = item.getBoundingClientRect();
            return {
                element: item,
                x: rect.left,
                y: rect.top,
                width: rect.right - rect.left,
                height: rect.bottom - rect.top,
            };
        });
    };

    function aminateFlexItems(
        oldFlexItemsInfo: FlexItemInfo[],
        newFlexItemsInfo: FlexItemInfo[]
    ): void {
        for (const newFlexItemInfo of newFlexItemsInfo) {
            const oldFlexItemInfo = oldFlexItemsInfo.find(
                (itemInfo) => itemInfo.element === newFlexItemInfo.element
            );
            const translateX = oldFlexItemInfo.x - newFlexItemInfo.x;
            const translateY = oldFlexItemInfo.y - newFlexItemInfo.y;
            const scaleX = oldFlexItemInfo.width / newFlexItemInfo.width;
            const scaleY = oldFlexItemInfo.height / newFlexItemInfo.height;
            newFlexItemInfo.element.animate(
                [
                    { transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})` },
                    { transform: 'none' },
                ],
                { duration: 250, easing: 'ease-out' }
            );
        }
    }

    return {
        removeFlexItem
    };
};