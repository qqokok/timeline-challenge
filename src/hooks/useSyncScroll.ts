import { useCallback, useEffect, useState } from "react";
type registerScrollSyncProps = {
  nodes: Array<HTMLElement>,
}

const useSyncScroll = ({ horizontal = false, vertical = false }: { horizontal?: Boolean, vertical?: Boolean}) => {
  const [connectedNodes, setConnectedNodes] = useState<Array<HTMLElement>>([]);
  const registerScrollSync = useCallback(({ nodes }: registerScrollSyncProps) => {
    setConnectedNodes(nodes);
  }, [])

  const syncScrollPosition = (
    scrolledNode: HTMLElement,
    syncNode: HTMLElement,
    horizontal: Boolean = false,
    vertical: Boolean = false
  ) => {
    const {
      scrollTop,
      scrollLeft,
    } = scrolledNode;

    if (vertical) {
      syncNode.scrollTop = scrollTop;
    }
    if (horizontal) {
      syncNode.scrollLeft = scrollLeft;
    }
  };

  const handleScrollInNodes = useCallback((scrolledNode: HTMLElement) => {
    connectedNodes.forEach((node: HTMLElement) => {
        // find sync targets
        if (scrolledNode !== node) {
          removeScrollEvents(node);
          syncScrollPosition(scrolledNode, node, horizontal, vertical);
          attachScrollEvents(node);
        }
    });
  }, [connectedNodes])

  const handleScrollEvent = useCallback((e: Event) => {
    window.requestAnimationFrame(() => handleScrollInNodes(e.target as HTMLElement));
  }, [connectedNodes]);

  const attachScrollEvents = useCallback((node: HTMLElement) => {
    node.addEventListener('scroll', handleScrollEvent);
  }, [connectedNodes])

  const removeScrollEvents = useCallback((node: HTMLElement) => {
    node.removeEventListener('scroll', handleScrollEvent);
  }, [connectedNodes])
  
  useEffect(() => {
    connectedNodes.forEach((node: HTMLElement) => {
      attachScrollEvents(node);
    });
    return () => {
      connectedNodes.forEach((node: HTMLElement) => {
        removeScrollEvents(node);
      });
    }
  }, [connectedNodes]);

  return {
    registerScrollSync
  }
};

export default useSyncScroll;
