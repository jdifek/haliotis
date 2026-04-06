/* eslint-disable @typescript-eslint/no-explicit-any */
export type CenterData = {
  id: number;
  center_name: string;
  slug: string;
  sliders: any;
  small_description: string | null;
  description: string | null;
  color: string | null;
  center_icon_url: string | null;
  center_image_url: string | null;
  contact_phone: string | null;
  contact_fax: string | null;
  contact_address: string | null;
  latitude: string | null;
  longitude: string | null;
  gallery: { id: string; image: string; position: string }[] | null;
  partners: { id: number; image_url: string; title: string; description: string; url: string }[];
  legal_supports: { id: number; name: string; images: string }[];
  payment_methods: { id: number; name: string; images: string }[];
};

export type TabEntity = {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  information?: string;
  image_path: string;
  job?: string;
  email?: string;
  academic_background?: string | null;
  avatar_path?: string;
  certifications?: {
    diving?: { id: number; title: string }[];
    nautical?: { id: number; title: string }[];
  };
  enumeration?: { id: number; category: string; key: string };
};

export type CenterTabs = {
  diving_center_information: { title: string; description: string; entities: TabEntity[] };
  diving_center_facilities: { title: string; description: string; entities: TabEntity[] };
  diving_center_boats: { title: string; description: string; entities: TabEntity[] };
  diving_center_history: { title: string; description: string; entities: TabEntity[] };
  diving_center_team_members: { title: string; description: string; entities: TabEntity[] };
};