
export interface ReportData {
  title: string;
  summary: string;
  metrics: {
    label: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  recommendations: string[];
}

export interface AchievementDetail {
  domain: string;
  kpi: string;
  procedure: string;
}

export interface AchievementRecord {
  id: number;
  semester: string;
  team: string;
  supervisor: string;
  day: string;
  date: string; // Formatted Hijri date string
  school: string;
  stage: string;
  status: string;
  details: AchievementDetail[];
  witness: string[];
}
