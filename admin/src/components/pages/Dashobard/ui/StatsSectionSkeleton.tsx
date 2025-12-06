const StatsSectionSkeleton = () => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Overview</h2>
      <div className="flex items-center justify-center gap-3 text-base-content p-8 bg-base-100 rounded-xl border border-base-300">
        <span className="text-lg font-medium animate-pulse">
          Loading stats...
        </span>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-base-content/30 border-t-accent" />
      </div>
    </section>
  );
};

export default StatsSectionSkeleton;