type PageHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex min-h-14 flex-col items-start justify-center gap-2 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h1 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
