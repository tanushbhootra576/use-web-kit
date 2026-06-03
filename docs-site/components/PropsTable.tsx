"use client";

interface Column {
  key: string;
  label: string;
}

interface PropsTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}

export default function PropsTable({ columns, data }: PropsTableProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="overflow-x-auto border border-white/[0.06] bg-[#08080b]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 meta-text !text-[9px] text-zinc-500 bg-white/[0.02] font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.02] transition-colors group"
            >
              {columns.map((col) => {
                const value = row[col.key] as string;
                const isCode = col.key === "type" || col.key === "default" || col.key === "name";

                return (
                  <td key={col.key} className="px-4 py-3 text-[13px] text-zinc-400 align-top leading-relaxed">
                    {isCode ? (
                      <code className={`text-[11px] font-mono px-1.5 py-0.5 transition-colors ${
                        col.key === 'name'
                          ? 'text-accent bg-accent/[0.06] border border-accent/10 group-hover:border-accent/25 font-medium'
                          : 'text-zinc-300 bg-white/[0.03] border border-white/[0.05]'
                      }`}>
                        {value || '—'}
                      </code>
                    ) : (
                      <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors font-normal text-[12px]">
                        {value || '—'}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
