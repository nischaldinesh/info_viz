"use client";
import ScatterPlot from "@/components/ScatterPlot";
import movieData from "../data/movie.json";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Information Visualization Homework 1 -{" "}
        <span className="text-blue-800"> Analyzing Movie Datasets </span>
      </h1>

      <ScatterPlot data={movieData} />
    </div>
  );
}
