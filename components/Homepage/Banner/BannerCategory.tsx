import Image, { StaticImageData } from "next/image";
import { slugify } from "@/utils/hooks/useSlugify";

const BannerCategory = ({
  category,
  image,
}: {
  category: string;
  image: StaticImageData;
}) => {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="relative w-28 h-28 lg:w-48 lg:h-48 border rounded-lg border-text-secondary cursor-pointer">
        <Image
          src={image}
          alt={`Shop ${category}`}
          objectFit="cover"
          objectPosition="center"
          layout="responsive"
          height={200}
          width={200}
          priority
          className="w-full h-full rounded-md"
        />
      </div>
      <a
        href={`/shop/${slugify(category)}`}
        className="w-fit px-1.5 sm:px-4 py-1 sm:py-1.5 bg-button text-xs lg:text-sm rounded-xl font-semibold text-white uppercase mt-2 cursor-pointer border border-transparent hover:border-white"
      >
        {category}
      </a>
      {/* <span className="w-fit px-1 py-1 bg-button text-xs rounded-lg font-semibold text-white capitalize">
        {category}
      </span> */}
    </div>
  );
};

export default BannerCategory;
