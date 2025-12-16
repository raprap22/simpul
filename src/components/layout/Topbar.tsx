import Image from 'next/image';
import IconSearch from '../../../public/Icon/SearchLight.png';

export default function Topbar() {
  return (
    <header className="h-14.5 bg-[#4F4F4F] flex items-center px-4">      
      <div className="w-5 h-5 opacity-70">
        <Image src={IconSearch} alt="search" />
      </div>
    </header>
  );
}
