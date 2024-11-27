interface SectionProps {
  section?: string;
}
export default function ProfileDetail({ section }: SectionProps) {
  return (
    <div className="flex flex-col px-5 py-2 bg-white rounded-lg w-[576px]">
      <h1 className="text-[20px] font-semibold">{section}</h1>
      <p>{`No ${section} yet`}</p>
    </div>
  );
}
