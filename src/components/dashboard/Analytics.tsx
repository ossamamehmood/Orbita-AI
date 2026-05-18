import * as React from "react";
import { Task } from "@/types";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default React.memo(function Analytics({ tasks }: { tasks: Task[] }) {
  // Aggregate tasks by status for a simple visualization
  const data = React.useMemo(() => {
    const completedCount = tasks.filter(t => t.status === 'completed' && !t.isDeleted).length;
    const activeCount = tasks.filter(t => t.status !== 'completed' && !t.isDeleted).length;
    const totalCount = tasks.filter(t => !t.isDeleted).length || 1;

    return [
      { name: 'Total', value: totalCount },
      { name: 'Active', value: activeCount },
      { name: 'Synced', value: completedCount },
      { name: 'Flow', value: Math.round((completedCount / totalCount) * 100) },
    ];
  }, [tasks]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#02FEDC" stopOpacity={0.6}/>
              <stop offset="50%" stopColor="#5A5CFF" stopOpacity={0.3}/>
              <stop offset="100%" stopColor="#F502FD" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-foreground/5" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'currentColor', fontSize: 10 }}
            className="text-foreground/30"
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'currentColor', fontSize: 10 }}
            className="text-foreground/30"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--popover)', 
              border: '1px solid var(--border)', 
              borderRadius: '12px', 
              backdropFilter: 'blur(10px)',
              color: 'var(--popover-foreground)'
            }}
            itemStyle={{ color: '#02FEDC', fontSize: '12px', fontWeight: 'bold' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#02FEDC" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});
