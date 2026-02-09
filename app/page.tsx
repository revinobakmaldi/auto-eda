"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart3, Loader2, AlertCircle, RotateCcw } from "lucide-react";

import { AnimatedBackground } from "@/components/shared/animated-background";
import { Navbar } from "@/components/shared/navbar";
import { FileDropzone } from "@/components/upload/file-dropzone";
import { SampleDatasetButton } from "@/components/upload/sample-dataset-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DatasetOverview } from "@/components/dashboard/dataset-overview";
import { VariableCard } from "@/components/dashboard/variable-card";
import { MissingValues } from "@/components/dashboard/missing-values";
import { CorrelationHeatmap } from "@/components/dashboard/correlation-heatmap";
import { DataSample } from "@/components/dashboard/data-sample";
import { SectionHeader } from "@/components/shared/section-header";
import { analyzeCSV } from "@/lib/api";
import { staggerContainer } from "@/lib/animations";
import type { AnalysisResult, AppState } from "@/lib/types";

export default function Home() {
  const [state, setState] = useState<AppState>("upload");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFileSelect = useCallback(async (file: File) => {
    setFileName(file.name);
    setState("analyzing");
    setError("");

    try {
      const data = await analyzeCSV(file);
      setResult(data);
      setState("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setState("error");
    }
  }, []);

  const handleReset = useCallback(() => {
    setState("upload");
    setResult(null);
    setFileName("");
    setError("");
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnimatedBackground />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Upload State */}
        {state === "upload" && (
          <div className="mx-auto max-w-2xl pt-16 sm:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 text-center"
            >
              <div className="mx-auto mb-4 inline-flex rounded-2xl bg-primary/10 p-4">
                <BarChart3 className="h-10 w-10 text-primary" />
              </div>
              <h1 className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                Auto EDA
              </h1>
              <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
                Upload a CSV and instantly get comprehensive exploratory data analysis
              </p>
            </motion.div>

            <FileDropzone onFileSelect={handleFileSelect} />

            <div className="mt-4 flex justify-center">
              <SampleDatasetButton onFileReady={handleFileSelect} />
            </div>
          </div>
        )}

        {/* Analyzing State */}
        {state === "analyzing" && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Analyzing {fileName}...
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Computing statistics, distributions, and correlations
              </p>

              {/* Skeleton cards */}
              <div className="mt-10 grid max-w-lg gap-3 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100 dark:bg-zinc-800"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Error State */}
        {state === "error" && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 inline-flex rounded-2xl bg-red-500/10 p-4">
                <AlertCircle className="h-10 w-10 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Analysis Failed
              </h2>
              <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">{error}</p>
              <button
                onClick={handleReset}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-5 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 transition-all hover:border-primary/30 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
            </motion.div>
          </div>
        )}

        {/* Dashboard State */}
        {state === "dashboard" && result && (
          <div>
            <DashboardHeader
              fileName={fileName}
              overview={result.overview}
              onReset={handleReset}
            />

            <DashboardNav
              hasMissing={result.missing_values.length > 0}
              hasCorrelations={result.correlations.columns.length >= 2}
            />

            <div className="space-y-12">
              <DatasetOverview overview={result.overview} />

              <section id="section-variables">
                <SectionHeader
                  badge="Variables"
                  title="Column Analysis"
                  subtitle="Detailed statistics and distributions for each variable"
                />
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid gap-4 md:grid-cols-2"
                >
                  {Object.values(result.variables).map((variable) => (
                    <VariableCard key={variable.name} variable={variable} />
                  ))}
                </motion.div>
              </section>

              <MissingValues missingValues={result.missing_values} />

              <CorrelationHeatmap correlations={result.correlations} />

              <DataSample
                sampleRows={result.sample_rows}
                columns={result.overview.column_names}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200/50 dark:border-zinc-800/50 py-6 text-center text-xs text-zinc-500">
        Built by{" "}
        <a
          href="https://revinobakmaldi.vercel.app"
          className="text-primary hover:underline"
        >
          Revino B Akmaldi
        </a>
      </footer>
    </div>
  );
}
