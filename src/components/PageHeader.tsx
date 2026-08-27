const dataOggi = new Date().toLocaleDateString("it-IT", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="jarvis-panel mb-5 flex flex-wrap items-center gap-3.5 rounded-[20px] p-3.5">
      <div className="flex min-w-[180px] flex-1 flex-col gap-0.5">
        <span className="text-[11px] tracking-[.1em] text-white/50 uppercase">
          {dataOggi}
        </span>
        <b className="text-lg tracking-tight">{title}</b>
      </div>
      {action}
    </div>
  );
}
