type PageHeadingProps = {
  title: string;
  description: string;
};

export function PageHeading({ title, description }: PageHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
