export interface ReferenceItem {
  id: number;
  name: string;
}

export interface AvatarItem {
  id: number;
  svg: string;
}

export interface ReferenceResponse {
  levels: ReferenceItem[];
  topics: ReferenceItem[];
  avatars: AvatarItem[];
}