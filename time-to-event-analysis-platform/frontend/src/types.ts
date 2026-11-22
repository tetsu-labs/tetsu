export type Domain = "generic" | "hamster" | "saas" | "machine" | "server" | "clinical";

export type AnalysisResponse = {
  n: number;
  events: number;
  censored: number;
  km: Array<{
    group: string;
    median: number | null;
    timeline: Array<{
      time: number;
      survival: number;
      lower_95: number | null;
      upper_95: number | null;
    }>;
  }>;
  logrank_p: number | null;
  cox: Array<{
    variable: string;
    hazard_ratio: number;
    ci_lower_95: number;
    ci_upper_95: number;
    p_value: number;
  }>;
  metadata: Record<string, unknown>;
};
