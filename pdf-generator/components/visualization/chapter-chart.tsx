'use client';

import { useBook } from '@/lib/book-context';
import { Visualization } from '@/lib/types';

interface ChapterVisualizationProps {
  chapterId: string;
}

// Simple SVG bar chart component (no recharts dependency needed at runtime)
function SimpleBarChart({ viz }: { viz: Visualization }) {
  const data = viz.data as { labels: string[]; values: number[]; unit?: string };
  const maxValue = Math.max(...data.values);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-zinc-300">{viz.title}</h4>
      <div className="space-y-1.5">
        {data.labels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 w-16 text-right shrink-0">{label}</span>
            <div className="flex-1 h-5 bg-zinc-800 rounded overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded transition-all duration-500"
                style={{ width: `${(data.values[i] / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs text-zinc-400 w-12">{data.values[i]}{data.unit || ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimplePieChart({ viz }: { viz: Visualization }) {
  const data = viz.data as { labels: string[]; values: number[] };
  const total = data.values.reduce((a, b) => a + b, 0);
  const colors = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-zinc-300">{viz.title}</h4>
      <div className="space-y-1.5">
        {data.labels.map((label, i) => {
          const pct = ((data.values[i] / total) * 100).toFixed(1);
          return (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: colors[i % colors.length] }} />
              <span className="text-xs text-zinc-300 flex-1">{label}</span>
              <span className="text-xs text-zinc-500">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SimpleLineChart({ viz }: { viz: Visualization }) {
  const data = viz.data as { labels: string[]; values: number[]; unit?: string };
  const maxValue = Math.max(...data.values);
  const minValue = Math.min(...data.values);
  const range = maxValue - minValue || 1;
  const width = 250;
  const height = 100;
  const padding = 10;

  const points = data.values.map((v, i) => {
    const x = padding + (i / (data.values.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((v - minValue) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-zinc-300">{viz.title}</h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <polyline fill="none" stroke="#6366f1" strokeWidth="2" points={points} />
        {data.values.map((v, i) => {
          const x = padding + (i / (data.values.length - 1)) * (width - 2 * padding);
          const y = height - padding - ((v - minValue) / range) * (height - 2 * padding);
          return <circle key={i} cx={x} cy={y} r="3" fill="#6366f1" />;
        })}
      </svg>
      <div className="flex justify-between text-xs text-zinc-500">
        {data.labels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

export function ChapterVisualization({ chapterId }: ChapterVisualizationProps) {
  const { book, dispatch } = useBook();
  const chapter = book.chapters.find((c) => c.id === chapterId);

  if (!chapter) return null;

  const addSampleVisualization = () => {
    const viz: Visualization = {
      id: crypto.randomUUID(),
      type: 'bar-chart',
      title: '데이터 분석',
      data: {
        labels: ['항목 1', '항목 2', '항목 3', '항목 4'],
        values: [65, 85, 45, 72],
        unit: '%',
      },
    };
    dispatch({ type: 'ADD_VISUALIZATION', payload: { chapterId, viz } });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">시각화</h3>

      {chapter.visualizations.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-sm bg-zinc-900/50 rounded-xl border border-zinc-800">
          시각화 데이터가 없습니다
        </div>
      ) : (
        chapter.visualizations.map((viz) => (
          <div key={viz.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl relative group">
            {viz.type === 'bar-chart' && <SimpleBarChart viz={viz} />}
            {viz.type === 'pie-chart' && <SimplePieChart viz={viz} />}
            {viz.type === 'line-chart' && <SimpleLineChart viz={viz} />}
            {(viz.type === 'statistics' || viz.type === 'case-study' || viz.type === 'comparison-table') && (
              <div className="text-sm text-zinc-400">
                <h4 className="font-semibold text-zinc-300 mb-1">{viz.title}</h4>
                <p>{viz.type === 'statistics' ? '통계 데이터' : viz.type === 'case-study' ? '사례 분석' : '비교표'}</p>
              </div>
            )}
            <button
              onClick={() => dispatch({ type: 'REMOVE_VISUALIZATION', payload: { chapterId, vizId: viz.id } })}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600/20 text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))
      )}

      <button
        onClick={addSampleVisualization}
        className="w-full py-2 border border-dashed border-zinc-700 hover:border-indigo-500 text-zinc-500 hover:text-indigo-400 rounded-xl transition-all text-sm"
      >
        + 시각화 추가
      </button>
    </div>
  );
}
