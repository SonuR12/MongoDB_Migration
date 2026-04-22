export function HeroSection() {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-bold text-[#00ED64] mb-3 tracking-tight">
        Migrate MongoDB 
        {/* <span className="text-white ">without the terminal</span> */}
      </h1>
      <p className="text-[#8a9bb0] text-base max-w-lg mx-auto">
        No <code className="text-[#00ED64] bg-[#00ED64]/10 px-1 rounded text-sm">mongodump</code>. No <code className="text-[#00ED64] bg-[#00ED64]/10 px-1 rounded text-sm">mongorestore</code>. Just paste, select, and migrate.
      </p>
    </div>
  );
}