/**
 * @file Timeline.jsx
 * @description Vertical timeline of session events (User Journey panel).
 *
 * @param {{
 *   events: Object[],
 *   selectedEventId?: string,
 *   onEventClick?: (event: Object) => void,
 * }} props
 */

import { useState, memo } from 'react';
import TimelineItem from './TimelineItem';
import EmptyState from './EmptyState';

const Timeline = ({ events = [], selectedEventId, onEventClick }) => {
  const [selected, setSelected] = useState(selectedEventId || null);

  const handleClick = (event) => {
    const id = event._id;
    setSelected(prev => prev === id ? null : id);
    onEventClick?.(event);
  };

  if (events.length === 0) {
    return (
      <EmptyState
        icon="🗺️"
        title="No events recorded"
        description="This session has no events yet, or they may still be loading."
      />
    );
  }

  // Counts for the summary row
  const pageViews = events.filter(e => e.event_type === 'page_view').length;
  const clicks = events.filter(e => e.event_type === 'click').length;

  return (
    <div className="flex flex-col h-full">
      {/* Summary chips */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 flex-shrink-0">
        <span className="text-xs font-medium text-slate-500">
          {events.length} event{events.length !== 1 ? 's' : ''}
        </span>
        <span className="text-slate-300">·</span>
        <span className="text-xs text-blue-600">{pageViews} page view{pageViews !== 1 ? 's' : ''}</span>
        <span className="text-slate-300">·</span>
        <span className="text-xs text-emerald-600">{clicks} click{clicks !== 1 ? 's' : ''}</span>
      </div>

      {/* Scrollable timeline */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sp-scrollbar">
        <div className="relative">
          {events.map((event, i) => (
            <TimelineItem
              key={event._id || i}
              event={event}
              isFirst={i === 0}
              isLast={i === events.length - 1}
              isSelected={selected === event._id}
              onClick={() => handleClick(event)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Timeline);
