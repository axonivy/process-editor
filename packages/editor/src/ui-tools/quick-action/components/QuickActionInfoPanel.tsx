import { IvyIcons } from '@axonivy/ui-icons';
import { type GIssueSeverity } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { marked } from 'marked';
import React from 'react';
import type { ShowInfoQuickActionMenuAction } from '../quick-action-menu-ui';

interface QuickActionInfoPanelProps {
  action: ShowInfoQuickActionMenuAction;
}

function getIvyIconForSeverity(severity: GIssueSeverity): IvyIcons {
  switch (severity) {
    case 'info':
      return IvyIcons.InfoCircle;
    case 'warning':
      return IvyIcons.Caution;
    case 'error':
      return IvyIcons.ErrorXMark;
  }
}

export const QuickActionInfoPanel: React.FC<QuickActionInfoPanelProps> = ({ action }) => {
  return (
    <div className='bar-menu quick-action-bar-menu bar-menu-text simple-menu'>
      {action.title && <h3 className='simple-menu-header'>{action.title}</h3>}
      {action.markers.map((marker, index) => (
        <div key={index} className='menu-marker'>
          {marker.issues.map(issue => (
            <div key={issue.message} className='menu-issue'>
              <div className='menu-issue-title'>
                <i className={`ivy ivy-${getIvyIconForSeverity(issue.severity)}`} />
                <span>{issue.severity === 'error' ? t('label.error') : t('label.warning')}</span>
              </div>
              <p className='menu-issue-message'>{issue.message}</p>
            </div>
          ))}
        </div>
      ))}
      {action.text && (
        <div className='simple-menu-text' dangerouslySetInnerHTML={{ __html: marked.parse(action.text, { async: false, breaks: true }) }} />
      )}
      {action.info &&
        Object.entries(action.info).map(([label, info]) => (
          <div key={label} className='simple-menu-text simple-menu-small'>
            <strong>{label}: </strong>
            {info.type === 'STRING' ? info.value : info.type === 'CODE' ? <pre>{info.value}</pre> : <></>}
          </div>
        ))}
      <p className='simple-menu-text simple-menu-small'>
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <strong>PID: </strong> {action.elementId}
      </p>
    </div>
  );
};
