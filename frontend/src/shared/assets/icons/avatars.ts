import Avatar1 from './icon-files/avatars/avatar_1.svg?react';
import Avatar2 from './icon-files/avatars/avatar_2.svg?react';
import Avatar3 from './icon-files/avatars/avatar_3.svg?react';
import Avatar4 from './icon-files/avatars/avatar_4.svg?react';
import Avatar5 from './icon-files/avatars/avatar_5.svg?react';
import Avatar6 from './icon-files/avatars/avatar_6.svg?react';
import Avatar7 from './icon-files/avatars/avatar_7.svg?react';
import Avatar8 from './icon-files/avatars/avatar_8.svg?react';
import Avatar9 from './icon-files/avatars/avatar_9.svg?react';
import Avatar10 from './icon-files/avatars/avatar_10.svg?react';
import Avatar11 from './icon-files/avatars/avatar_11.svg?react';
import Avatar12 from './icon-files/avatars/avatar_12.svg?react';

export type AvatarComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement>
>;

export interface AvatarItem {
  id: number;
  component: AvatarComponent;
}

export const AVATARS: AvatarItem[] = [
  { id: 1, component: Avatar1 },
  { id: 2, component: Avatar2 },
  { id: 3, component: Avatar3 },
  { id: 4, component: Avatar4 },
  { id: 5, component: Avatar5 },
  { id: 6, component: Avatar6 },
  { id: 7, component: Avatar7 },
  { id: 8, component: Avatar8 },
  { id: 9, component: Avatar9 },
  { id: 10, component: Avatar10 },
  { id: 11, component: Avatar11 },
  { id: 12, component: Avatar12 },
];