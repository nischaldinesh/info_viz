/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface ScatterPlotProps {
  data: any[];
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [brushedData, setBrushedData] = useState<any[]>([]);

  const [mapping, setMapping] = useState<{
    x: string;
    y: string;
    color?: string;
    opacity?: string;
    size?: string;
  }>({
    x: "budget",
    y: "us_gross",
    color: "genre",
    opacity: undefined,
    size: undefined,
  });

  const availableAttributes = Object.keys(data[0] || {});

  const numericOptions = [
    "budget",
    "us_gross",
    "worldwide_gross",
    "rotten_rating",
    "imdb_rating",
    "imdb_votes",
  ];

  useEffect(() => {
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!mapping.x || !mapping.y) return;

    const xExtent = d3.extent(data, (d) => +d[mapping.x]) as [number, number];
    const yExtent = d3.extent(data, (d) => +d[mapping.y]) as [number, number];

    const xScale = d3
      .scaleLinear()
      .domain([xExtent[0] * 0.95, xExtent[1] * 1.05])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([yExtent[0] * 0.95, yExtent[1] * 1.05])
      .range([height - margin.bottom, margin.top]);

    const colorScale = mapping.color
      ? d3
          .scaleOrdinal(d3.schemeCategory10)
          .domain(data.map((d) => String(d[mapping.color!])))
      : () => "steelblue";

    const opacityScale = mapping.opacity
      ? d3
          .scaleLinear()
          .domain(
            d3.extent(data, (d) => +d[mapping.opacity!]) as [number, number]
          )
          .range([0.3, 1])
      : () => 0.8;

    const sizeScale = mapping.size
      ? d3
          .scaleLinear()
          .domain(d3.extent(data, (d) => +d[mapping.size!]) as [number, number])
          .range([4, 12])
      : () => 6;

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(6));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(6));

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(+d[mapping.x]))
      .attr("cy", (d) => yScale(+d[mapping.y]))
      .attr("r", (d) => sizeScale(+d[mapping.size!]))
      .attr("fill", (d) => colorScale(d[mapping.color!]))
      .attr("opacity", (d) => opacityScale(+d[mapping.opacity!]))
      .append("title")
      .text(
        (d) => `${mapping.x}: ${d[mapping.x]}, ${mapping.y}: ${d[mapping.y]}`
      );

    const brush = d3
      .brush()
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ])
      .on("end", (event) => {
        if (!event.selection) return;

        const [[x0, y0], [x1, y1]] = event.selection;
        const selected = data.filter((d) => {
          const cx = xScale(+d[mapping.x]);
          const cy = yScale(+d[mapping.y]);
          return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        });

        setBrushedData(selected);
      });
    //
    svg.append("g").call(brush);
  }, [data, mapping]);

  const allKeys = brushedData.length > 0 ? Object.keys(brushedData[0]) : [];

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-8">
        <div className="w-[300px] bg-gray-100 border p-4 rounded">
          <h3 className="font-semibold mb-3">Control Panel</h3>
          {["x", "y"].map((channel) => (
            <div key={channel} className="mb-2">
              <label className="block text-sm font-medium capitalize">
                {channel}:
              </label>
              <select
                value={mapping[channel as keyof typeof mapping] ?? ""}
                onChange={(e) =>
                  setMapping((prev) => ({
                    ...prev,
                    [channel]:
                      e.target.value === "" ? undefined : e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
              >
                {numericOptions.map((attr) => (
                  <option key={attr} value={attr}>
                    {attr}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {["color", "opacity", "size"].map((channel) => (
            <div key={channel} className="mb-2">
              <label className="block text-sm font-medium capitalize">
                {channel}:
              </label>
              <select
                value={mapping[channel as keyof typeof mapping] ?? ""}
                onChange={(e) =>
                  setMapping((prev) => ({
                    ...prev,
                    [channel]:
                      e.target.value === "" ? undefined : e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
              >
                <option value="">None</option>
                {availableAttributes.map((attr) => (
                  <option key={attr} value={attr}>
                    {attr}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div>
          <svg
            ref={svgRef}
            width={600}
            height={400}
            className="border border-gray-300"
          />
        </div>
      </div>

      <div className="border border-gray-300 bg-white max-h-[300px] overflow-y-auto">
        <h2 className="text-lg font-semibold p-2 bg-gray-100 border-b">
          Brushed Data
        </h2>
        {brushedData.length > 0 ? (
          <table className="table-auto border-collapse w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {allKeys.map((key) => (
                  <th key={key} className="border px-2 py-1 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brushedData.map((d, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {allKeys.map((key) => (
                    <td key={key} className="border px-2 py-1">
                      {d[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 p-2">No data selected</p>
        )}
      </div>
    </div>
  );
};

export default ScatterPlot;
