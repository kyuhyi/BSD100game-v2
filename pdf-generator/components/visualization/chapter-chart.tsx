'use client';

import { useBook } from '@/lib/book-context';
import { Visualization } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

function SimpleBarChart({ viz }: { viz: Visualization }) {
  const data = viz.data as { labels: string[]; values: number[]; unit?: string };
  const maxValue = Math.max(...data.values);
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">{viz.title}</h4>
      <div className="space-y-1.5">
        {data.labels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-16 text-right shrink-0">{label}</span>
            <div className="flex-1 h-5 bg-secondary rounded overflow-hidden">
              <div className="h-full bg-primary rounded transition-all duration-500" style={{ width: `${(data.values[i] / maxValue) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground w-12">{data.values[i]}{data.unit || ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimplePieChart({ viz }: { viz: Visualization }) {
  const data = viz.data as { labels: string[]; values: number[] };
  const total = data.values.reduce((a, b) => a + b, 0);
  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">{viz.title}</h4>
      <div className="space-y-1.5">
        {data.labels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: colors[i % colors.length] }} />
            <span className="text-xs flex-1">{label}</span>
            <span className="text-xs text-muted-foreground">{((data.values[i] / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleLineChart({ viz }: { viz: Visualization }) {
  const data = viz.data as { labels: string[]; values: number[] };
  const max = Math.max(...data.values);
  const min = Math.min(...data.values);
  const range = max - min || 1;
  const w = 250, h = 100, p = 10;
  const points = data.values.map((v, i) => `${p + (i / (data.values.length - 1)) * (w - 2 * p)},${h - p - ((v - min) / range) * (h - 2 * p)}`).join(' ');
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">{viz.title}</h4>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="2" points={points} />
        {data.values.map((v, i) => {
          const x = p + (i / (data.values.length - 1)) * (w - 2 * p);
          const y = h - p - ((v - min) / range) * (h - 2 * p);
          return <circle key={i} cx={x} cy={y} r="3" fill="hsl(var(--primary))" />;
        })}
      </svg>
      <div className="flex justify-between text-xs text-muted-foreground">
        {data.labels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

export function ChapterVisualization({ chapterId }: { chapterId: string }) {
  const { book, dispatch } = useBook();
  const chapter = book.chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;

  const addSampleVisualization = () => {
    const viz: Visualization = {
      id: crypto.randomUUID(), type: 'bar-chart', title: '데이터 분석',
      data: { labels: ['항목 1', '항목 2', '항목 3', '항목 4'], values: [65, 85, 45, 72], unit: '%' },
    };
    dispatch({ type: 'ADD_VISUALIZATION', payload: { chapterId, viz } });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">시각화</h3>
      {chapter.visualizations.length === 0 ? (
        <Card className="text-center py-8"><p className="text-sm text-muted-foreground">시각화 데이터가 없습니다</p></Card>
      ) : (
        chapter.visualizations.map((viz) => (
          <Card key={viz.id} className="relative group">
            <CardContent className="pt-6">
              {viz.type === 'bar-chart' && <SimpleBarChart viz={viz} />}
              {viz.type === 'pie-chart' && <SimplePieChart viz={viz} />}
              {viz.type === 'line-chart' && <SimpleLineChart viz={viz} />}
            </CardContent>
            <Button
              variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => dispatch({ type: 'REMOVE_VISUALIZATION', payload: { chapterId, vizId: viz.id } })}
            >
              <X className="size-3" />
            </Button>
          </Card>
        ))
      )}
      <Button variant="outline" className="w-full border-dashed" onClick={addSampleVisualization}>
        <Plus className="size-4" /> 시각화 추가
      </Button>
    </div>
  );
}
