import React from 'react';

export type ProgramSelectableItem = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
};

export function ProgramSelectIcon({ icon }: { icon?: string }) {
  if (!icon) return null;
  const isImageUrl = icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('/') || icon.startsWith('data:');
  return isImageUrl ? (
    <img src={icon} alt='' aria-hidden='true' style={{ height: 18, width: 18 }} />
  ) : (
    <span aria-hidden='true' style={{ fontSize: 18 }}>
      {icon}
    </span>
  );
}
