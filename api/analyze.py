from http.server import BaseHTTPRequestHandler
import json
import io
import cgi
import math
import pandas as pd
import numpy as np


def make_json_safe(obj):
    """Recursively replace NaN/Inf with None for JSON serialization."""
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        v = float(obj)
        if math.isnan(v) or math.isinf(v):
            return None
        return v
    if isinstance(obj, np.bool_):
        return bool(obj)
    if isinstance(obj, np.ndarray):
        return make_json_safe(obj.tolist())
    if isinstance(obj, dict):
        return {k: make_json_safe(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [make_json_safe(v) for v in obj]
    if isinstance(obj, pd.Timestamp):
        return str(obj)
    if pd.isna(obj):
        return None
    return obj


def analyze_dataframe(df: pd.DataFrame) -> dict:
    """Run full EDA on a pandas DataFrame."""

    # --- Overview ---
    memory_bytes = df.memory_usage(deep=True).sum()
    if memory_bytes < 1024:
        mem_display = f"{memory_bytes} B"
    elif memory_bytes < 1024 ** 2:
        mem_display = f"{memory_bytes / 1024:.1f} KB"
    else:
        mem_display = f"{memory_bytes / (1024 ** 2):.1f} MB"

    n_duplicates = int(df.duplicated().sum())
    total_cells = df.shape[0] * df.shape[1]
    total_missing = int(df.isnull().sum().sum())

    dtypes_summary = {}
    for col in df.columns:
        dtype_str = str(df[col].dtype)
        if "int" in dtype_str or "float" in dtype_str:
            key = "numeric"
        elif "bool" in dtype_str:
            key = "boolean"
        elif "datetime" in dtype_str:
            key = "datetime"
        else:
            key = "categorical"
        dtypes_summary[key] = dtypes_summary.get(key, 0) + 1

    overview = {
        "n_rows": int(df.shape[0]),
        "n_columns": int(df.shape[1]),
        "memory_usage_display": mem_display,
        "n_duplicates": n_duplicates,
        "duplicate_percentage": round(n_duplicates / max(df.shape[0], 1) * 100, 1),
        "total_missing_cells": total_missing,
        "missing_percentage": round(total_missing / max(total_cells, 1) * 100, 1),
        "dtypes_summary": dtypes_summary,
        "column_names": list(df.columns),
    }

    # --- Per-variable analysis ---
    variables = {}
    for col in df.columns:
        series = df[col]
        n_missing = int(series.isnull().sum())
        n_unique = int(series.nunique())

        var_info = {
            "name": col,
            "dtype": str(series.dtype),
            "n_missing": n_missing,
            "missing_percentage": round(n_missing / max(df.shape[0], 1) * 100, 1),
            "n_unique": n_unique,
        }

        if pd.api.types.is_numeric_dtype(series):
            clean = series.dropna()
            if len(clean) > 0:
                hist_counts, hist_edges = np.histogram(clean, bins=min(20, max(5, n_unique)))
                histogram = []
                for i in range(len(hist_counts)):
                    label = f"{hist_edges[i]:.2f}-{hist_edges[i+1]:.2f}"
                    histogram.append({"label": label, "count": int(hist_counts[i])})

                var_info["numeric"] = {
                    "mean": float(clean.mean()),
                    "median": float(clean.median()),
                    "std": float(clean.std()),
                    "min": float(clean.min()),
                    "max": float(clean.max()),
                    "q1": float(clean.quantile(0.25)),
                    "q3": float(clean.quantile(0.75)),
                    "skewness": float(clean.skew()),
                    "kurtosis": float(clean.kurtosis()),
                    "histogram": histogram,
                }
            else:
                var_info["numeric"] = {
                    "mean": None, "median": None, "std": None,
                    "min": None, "max": None, "q1": None, "q3": None,
                    "skewness": None, "kurtosis": None, "histogram": [],
                }
        else:
            clean = series.dropna()
            value_counts = clean.value_counts().head(10)
            total_non_null = len(clean)
            vc_list = []
            for val, count in value_counts.items():
                vc_list.append({
                    "value": str(val),
                    "count": int(count),
                    "percentage": round(int(count) / max(total_non_null, 1) * 100, 1),
                })

            top_value = str(value_counts.index[0]) if len(value_counts) > 0 else ""
            top_freq = int(value_counts.iloc[0]) if len(value_counts) > 0 else 0

            var_info["categorical"] = {
                "top_value": top_value,
                "top_frequency": top_freq,
                "value_counts": vc_list,
            }

        variables[col] = var_info

    # --- Missing values ---
    missing_values = []
    for col in df.columns:
        count = int(df[col].isnull().sum())
        if count > 0:
            missing_values.append({
                "column": col,
                "count": count,
                "percentage": round(count / max(df.shape[0], 1) * 100, 1),
            })
    missing_values.sort(key=lambda x: x["percentage"], reverse=True)

    # --- Correlations (numeric columns only) ---
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if len(numeric_cols) >= 2:
        corr_matrix = df[numeric_cols].corr()
        correlations = {
            "columns": numeric_cols,
            "matrix": corr_matrix.values.tolist(),
        }
    else:
        correlations = {"columns": [], "matrix": []}

    # --- Sample rows ---
    sample = df.head(10)
    sample_rows = json.loads(sample.to_json(orient="records", date_format="iso"))

    return make_json_safe({
        "overview": overview,
        "variables": variables,
        "missing_values": missing_values,
        "correlations": correlations,
        "sample_rows": sample_rows,
    })


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_type = self.headers.get("Content-Type", "")
            if "multipart/form-data" not in content_type:
                self._send_error(400, "Expected multipart/form-data")
                return

            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={
                    "REQUEST_METHOD": "POST",
                    "CONTENT_TYPE": content_type,
                },
            )

            file_item = form["file"]
            if not file_item.file:
                self._send_error(400, "No file uploaded")
                return

            file_data = file_item.file.read()

            if len(file_data) == 0:
                self._send_error(400, "File is empty")
                return

            if len(file_data) > 4 * 1024 * 1024:
                self._send_error(400, "File too large (max 4MB)")
                return

            try:
                text = file_data.decode("utf-8")
            except UnicodeDecodeError:
                try:
                    text = file_data.decode("latin-1")
                except Exception:
                    self._send_error(400, "Could not decode file. Please upload a valid CSV.")
                    return

            try:
                df = pd.read_csv(io.StringIO(text))
            except Exception as e:
                self._send_error(400, f"Could not parse CSV: {str(e)}")
                return

            if df.empty or df.shape[1] < 1:
                self._send_error(400, "CSV has no data or no columns")
                return

            result = analyze_dataframe(df)

            self._send_json(200, result)

        except Exception as e:
            self._send_error(500, f"Internal error: {str(e)}")

    def _send_json(self, status: int, data: dict):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_error(self, status: int, message: str):
        self._send_json(status, {"error": message})
