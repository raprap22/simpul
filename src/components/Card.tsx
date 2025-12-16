export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-183.5 h-184.25 bg-white rounded-xl shadow-lg text-[#333333]">
      {children}
    </div>
  );
}