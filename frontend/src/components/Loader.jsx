const Loader = ({ fullScreen = false, label = "Loading" }) => {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-ink-600" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-signal animate-spin" />
      </div>
      <span className="font-mono text-xs tracking-widest text-mist-400 uppercase">{label}...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900">{content}</div>
    );
  }

  return <div className="flex items-center justify-center py-16">{content}</div>;
};

export default Loader;
