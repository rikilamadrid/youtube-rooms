import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import './Tabs.css';

export type TabItem = {
  /** Unique id for this tab; used to build the tab element's DOM id (`tab-{id}`). */
  id: string;
  /** Visible label. */
  label: string;
  /** DOM id of the `tabpanel` this tab controls. */
  panelId: string;
};

export type TabsProps = {
  /** Accessible name for the tablist, e.g. "Room sections". */
  label: string;
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
};

/**
 * A horizontally scrollable WAI-ARIA Tabs widget (tablist only — panels are
 * rendered by the caller, referencing `tab-{id}` via `aria-labelledby`).
 * Arrow Left/Right move focus and activate the adjacent tab (wrapping at the
 * ends); Home/End jump to the first/last tab. Only the active tab sits in
 * the page tab order (roving `tabindex`).
 */
export function Tabs({ label, tabs, activeTabId, onTabChange }: TabsProps) {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  function focusTab(id: string) {
    tabRefs.current.get(id)?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    onTabChange(nextTab.id);
    focusTab(nextTab.id);
  }

  return (
    <div className="sr-tabs__list" role="tablist" aria-label={label}>
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            ref={(element) => {
              if (element) {
                tabRefs.current.set(tab.id, element);
              } else {
                tabRefs.current.delete(tab.id);
              }
            }}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={tab.panelId}
            tabIndex={isActive ? 0 : -1}
            className={`sr-tabs__tab${isActive ? ' sr-tabs__tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
