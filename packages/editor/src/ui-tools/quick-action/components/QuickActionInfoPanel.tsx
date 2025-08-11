import { Popover, PopoverAnchor, PopoverContent } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type GIssue, type GIssueMarker, type GIssueSeverity } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { marked } from 'marked';
import React from 'react';
import type { ShowInfoQuickActionMenuAction } from '../quick-action-menu-ui';

interface QuickActionInfoPanelProps {
  anchor: React.RefObject<HTMLDivElement | null>;
  action: ShowInfoQuickActionMenuAction;
  onClose: () => void;
}

type InfoFormat = 'CODE' | 'STRING';

export const QuickActionInfoPanel: React.FC<QuickActionInfoPanelProps> = ({ anchor, action, onClose }) => {
  const renderTitle = (name: string) => <h3 className='simple-menu-header'>{name}</h3>;

  const renderInfo = (infoLabel: string, infoValue: string) => (
    <p className='simple-menu-text simple-menu-small'>
      <strong>{infoLabel}: </strong>
      {infoValue}
    </p>
  );

  const renderCodeInfo = (infoLabel: string, infoValue: string) => (
    <p className='simple-menu-text simple-menu-small'>
      <strong>{infoLabel}: </strong>
      <pre>{infoValue}</pre>
    </p>
  );

  const renderDescription = (description: string) => {
    const htmlText = marked.parse(description, { async: false, breaks: true });
    return <div className='simple-menu-text' dangerouslySetInnerHTML={{ __html: htmlText }} />;
  };

  const getIvyIconForSeverity = (severity: GIssueSeverity): IvyIcons => {
    switch (severity) {
      case 'info':
        return IvyIcons.InfoCircle;
      case 'warning':
        return IvyIcons.Caution;
      case 'error':
        return IvyIcons.ErrorXMark;
    }
  };

  const renderIssue = (issue: GIssue) => (
    <div key={issue.message} className='menu-issue'>
      <div className='menu-issue-title'>
        <i className={`ivy ivy-${getIvyIconForSeverity(issue.severity)}`} />
        <span>{issue.severity === 'error' ? t('label.error') : t('label.warning')}</span>
      </div>
      <p className='menu-issue-message'>{issue.message}</p>
    </div>
  );

  const renderMarker = (marker: GIssueMarker, index: number) => (
    <div key={index} className='menu-marker'>
      {marker.issues.map(issue => renderIssue(issue))}
    </div>
  );

  const renderInfoValue = (label: string, info: { type: InfoFormat; value: string }) => {
    switch (info.type) {
      case 'STRING':
        return renderInfo(label, info.value);
      case 'CODE':
        return renderCodeInfo(label, info.value);
    }
  };

  if (!anchor?.current) {
    return null;
  }

  return (
    <Popover open={true} onOpenChange={open => !open && onClose()}>
      <PopoverAnchor virtualRef={{ current: anchor.current }} />
      <PopoverContent sideOffset={0} className='bar-menu bar-menu-text'>
        {action.title && renderTitle(action.title)}
        {action.markers.map((marker, index) => renderMarker(marker, index))}
        {action.text && renderDescription(action.text)}
        {action.info && Object.entries(action.info).map(([label, info]) => renderInfoValue(label, info))}
        {renderInfo('PID', action.elementId)}
      </PopoverContent>
    </Popover>
  );
};
