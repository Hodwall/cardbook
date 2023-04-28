//@ts-nocheck
interface FlexItemInfo {
    element: Element;
    x: number;
    y: number;
    width: number;
    height: number;
}

export const useFlexAnimation = (container_selector: string) => {

    const getFlexItemsInfo = (): FlexItemInfo[] => {
        const container = document.querySelector(container_selector);
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

    const animateFlexItems = (
        oldFlexItemsInfo: FlexItemInfo[],
        newFlexItemsInfo: FlexItemInfo[]
    ): void => {
        for (const oldFlexItemInfo of oldFlexItemsInfo) {
            let newFlexItemInfo = newFlexItemsInfo.find(
                (itemInfo) => itemInfo.element === oldFlexItemInfo.element
            );
            let newFlexItemInfoIndex = newFlexItemsInfo.findIndex(
                (itemInfo) => itemInfo.element === oldFlexItemInfo.element
            );
            let oldFlexItemInfoIndex = oldFlexItemsInfo.findIndex(
                (itemInfo) => itemInfo.element === oldFlexItemInfo.element
            );

            if (newFlexItemInfoIndex === oldFlexItemInfoIndex) {
                // console.log('card didnt move');
            } else if (!newFlexItemInfo) {
                // console.log('card not found');
            } else {
                const translateX = oldFlexItemInfo.x - newFlexItemInfo.x;
                const translateY = oldFlexItemInfo.y - newFlexItemInfo.y;
                oldFlexItemInfo.element.animate(
                    [
                        { transform: `translate(${translateX}px, ${translateY}px)` },
                        { transform: 'none' },
                    ],
                    { duration: 250, easing: 'ease-out' }
                );
            }
        };
    };

    return {
        getFlexItemsInfo,
        animateFlexItems,
    };
};