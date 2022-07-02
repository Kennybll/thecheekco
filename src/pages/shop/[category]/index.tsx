import Image from "next/image";
import { BsStarFill, BsStar } from "react-icons/bs";
import { CartState } from "@/context/Cart/Context";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import * as gtag from "lib/gtag";
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "@/backend/router/_app";
import { inferRouterContext } from "@trpc/server";
import superjson from "superjson";
import { CatalogObject } from "square";
import { trpc } from "@/utils/trpc";
import { Dispatch } from "react";
import FavouriteButton from "@/components/FavouriteButton/FavouriteButton";
import Stars from "@/components/Reviews/Stars";
import Head from "next/head";
import CornerRibbon from "react-corner-ribbon";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

type CartObject = CatalogObject & {
  quantity?: number;
  productImage?: string;
};

const CategoryPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const currentCategoryID = props.currentCategoryID;
  const currentCategoryName = props.currentCategoryName;
  const router = useRouter();
  const query = router.query;
  const {
    cart,
    dispatch,
  }: {
    cart: CartObject[];
    dispatch: Dispatch<{
      type: string;
      item?: CartObject;
      quantity?: number;
      productImage?: string;
    }>;
  } = CartState();
  const { data: products } = trpc.useQuery([
    "square-products.search-products",
    {
      categoryIds: [currentCategoryID],
    },
  ]);

  const { data: reviews, status: reviewQueryStatus } = trpc.useQuery([
    "review.fetch-reviews",
    {
      productIds: products
        ?.filter((product) => product.type === "ITEM")
        .map((product) => product.id) as string[],
    },
  ]);

  const handleAdd = (product: CartObject) => {
    const productImage = products?.find(
      (p) => p.type === "IMAGE" && product.itemData?.imageIds?.includes(p.id)
    );
    dispatch({
      type: "ADD_TO_CART",
      item: product,
      quantity: 1,
      productImage: productImage?.imageData?.url,
    });
    gtag.event({
      action: "add_to_cart",
      category: "ecommerce",
      label: product.itemData?.name as string,
      value: `/shop/${query.category}`,
    });
    toast.custom((t) => {
      return (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-bg-tan shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5 relative">
                <Image
                  className="w-24 h-24 rounded-full"
                  height={50}
                  width={50}
                  objectFit="cover"
                  src={
                    productImage?.imageData?.url ||
                    "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                  }
                  alt={product.itemData?.name}
                />
              </div>
              <div className="ml-3 flex-1 my-auto">
                <p className="mt-1 text-sm text-text-primary font-gothic">
                  {product.itemData?.name} added to cart.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-text-primary border-opacity-10">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:text-text-primary"
            >
              Close
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Head>
        <title>The Cheek Co. - Shop {currentCategoryName}</title>
        <meta
          name="description"
          content="More than just amazing bath and skin care products. Ethically sourced handmade in Australia, cruelty free, vegan."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-screen min-h-screen flex justify-center">
        <div className="py-4 px-4 sm:py-10 sm:px-6 lg:px-8 bg-bg-lighttan mt-24 shadow-[0_0px_7px_1px_rgba(0,0,0,0.51)] w-full h-full mx-6 md:mx-16 sm:mx-20 rounded-md">
          <h2 className="text-4xl text-text-primary font-gothic font-extralight capitalize">
            {currentCategoryName}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-3 lg:grid-cols-4 xl:gap-x-10 ">
            {products &&
              products
                ?.filter((product) => product.type === "ITEM")
                .map((product, index) => {
                  const productImage = products?.find(
                    (p) =>
                      p.type === "IMAGE" &&
                      product.itemData?.imageIds?.includes(p.id)
                  );
                  const review = reviews?.find(
                    (r) => r.productId === product.id
                  );
                  const reviewCount = reviews?.filter(
                    (r) => r.productId === product.id
                  ).length;
                  return (
                    <div key={product.id}>
                      <div className="relative">
                        <Link
                          href="/shop/[category]/[id]"
                          as={`/shop/${query.category}/${product?.itemData?.name
                            ?.replace(/ /g, "-")
                            .toLowerCase()}`}
                        >
                          <div className="relative w-full h-72 rounded-lg overflow-hidden cursor-pointer border border-text-secondary">
                            {productImage &&
                              product.itemData?.variations?.[0]
                                ?.itemVariationData?.locationOverrides?.[0]
                                ?.soldOut === true && (
                                <CornerRibbon
                                  position="top-right" // OPTIONAL, default as "top-right"
                                  fontColor="#f0f0f0" // OPTIONAL, default as "#f0f0f0"
                                  backgroundColor="#a75e2f" // OPTIONAL, default as "#2c7"
                                  containerStyle={{}} // OPTIONAL, style of the ribbon
                                  style={{}} // OPTIONAL, style of ribbon content
                                  className="font-gothic" // OPTIONAL, css class of ribbon
                                >
                                  Out of Stock
                                </CornerRibbon>
                              )}
                            {productImage && (
                              <Image
                                layout="fill"
                                src={
                                  productImage?.imageData?.url ||
                                  "https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                                }
                                alt={product.itemData?.name}
                                placeholder="blur"
                                blurDataURL="https://thecheekcomedia.s3.ap-southeast-2.amazonaws.com/placeholder-image.png"
                                priority={
                                  index === 1 ||
                                  index === 2 ||
                                  index === 3 ||
                                  index === 4
                                    ? true
                                    : false
                                }
                                className="w-full h-full object-center object-cover rounded-md"
                              />
                            )}
                          </div>
                        </Link>
                        <div className="relative mt-4 ">
                          <div className="flex w-full justify-between">
                            <h3 className="text-sm font-medium text-text-primary">
                              {product.itemData?.name}
                            </h3>
                            <FavouriteButton
                              product={product}
                              image={productImage?.imageData?.url as string}
                              styles={{
                                position: "absolute",
                                top: "-40px",
                                right: "-10px",
                              }}
                            />
                          </div>

                          <div className="flex text-header-brown">
                            <Stars review={review} />
                            <span className="text-sm text-text-primary font-medium pl-4">
                              ({reviewCount ? reviewCount : 0})
                            </span>
                            <span className="text-sm text-text-primary font-medium pl-1">
                              {(reviewCount && reviewCount > 1) ||
                              reviewCount === 0
                                ? "reviews"
                                : "review"}
                            </span>
                          </div>
                          {/* <p className="relative text-lg font-bold text-text-primary">
                          $
                          {(
                            product.price.itemVariationData?.priceMoney.amount /
                            100
                          ).toFixed(2)}
                        </p> */}
                          <p className="mt-1 text-sm text-gray-500">
                            {/* {product.color} */}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <button
                          onClick={() => handleAdd(product)}
                          className="relative flex bg-button rounded-2xl py-2 px-8 items-center justify-center text-sm font-medium text-white border border-invisible hover:border-black uppercase cursor-pointer"
                        >
                          Add to cart
                          <span className="sr-only">
                            {product?.itemData?.name}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;

export const getStaticPaths: GetStaticPaths = async (
  context: GetStaticPathsContext
) => {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: context as inferRouterContext<typeof appRouter>,
    transformer: superjson,
  });
  const categoryQuery = await ssg.fetchQuery(
    "square-categories.all-categories"
  );
  const categoryNames = categoryQuery?.filter(
    (category) => category.categoryData?.name as string
  );
  const paths = categoryNames?.map((category) => ({
    params: {
      category: category.categoryData?.name?.replace(/ /g, "-").toLowerCase(),
    },
  }));
  return {
    paths: paths || [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const params = context.params?.category as string;
  //const id = context.params?.id as string;
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: context as inferRouterContext<typeof appRouter>,
    transformer: superjson,
  });
  const categoryQuery = await ssg.fetchQuery(
    "square-categories.all-categories"
  );
  const categoryObject = categoryQuery?.find(
    (category) =>
      category?.categoryData?.name?.replace(/ /g, "-").toLowerCase() === params
  );
  await ssg.fetchQuery("square-products.search-products", {
    categoryIds: [categoryObject?.id as string],
  });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      currentCategoryID: categoryObject?.id as string,
      currentCategoryName: categoryObject?.categoryData?.name as string,
    },
    revalidate: 900,
  };
};
