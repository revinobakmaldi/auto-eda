export interface HistogramBin {
  label: string;
  count: number;
}

export interface NumericStats {
  mean: number;
  median: number;
  std: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  skewness: number;
  kurtosis: number;
  histogram: HistogramBin[];
}

export interface ValueCount {
  value: string;
  count: number;
  percentage: number;
}

export interface CategoricalStats {
  top_value: string;
  top_frequency: number;
  value_counts: ValueCount[];
}

export interface VariableInfo {
  name: string;
  dtype: string;
  n_missing: number;
  missing_percentage: number;
  n_unique: number;
  numeric?: NumericStats;
  categorical?: CategoricalStats;
}

export interface DatasetOverview {
  n_rows: number;
  n_columns: number;
  memory_usage_display: string;
  n_duplicates: number;
  duplicate_percentage: number;
  total_missing_cells: number;
  missing_percentage: number;
  dtypes_summary: Record<string, number>;
  column_names: string[];
}

export interface MissingValueInfo {
  column: string;
  count: number;
  percentage: number;
}

export interface CorrelationData {
  columns: string[];
  matrix: number[][];
}

export interface AnalysisResult {
  overview: DatasetOverview;
  variables: Record<string, VariableInfo>;
  missing_values: MissingValueInfo[];
  correlations: CorrelationData;
  sample_rows: Record<string, unknown>[];
}

export type AppState = "upload" | "analyzing" | "dashboard" | "error";
