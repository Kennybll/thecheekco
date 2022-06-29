import { trpc } from "@/utils/trpc";

const Admin = () => {
  const { data: unapprovedReviews, status } = trpc.useQuery([
    "review.fetch-unapproved-reviews",
  ]);
  const approveReviewMutation = trpc.useMutation(["review.approve-review"]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="bg-white sm:p-3 m-2 sm:m-6 font-gothic sm:w-3/4 sm:mx-auto rounded-md sm:rounded-lg shadow">
        <div className="max-w-4xl mx-auto py-3 sm:px-6 sm:py-4">
          <div className="px-4 sm:px-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Check comments to be approved, view stats and more.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white shadow px-4 py-5 rounded-md sm:rounded-lg sm:p-6 m-2 sm:m-6 sm:w-3/4 sm:mx-auto text-text-primary font-gothic">
        Admin Dashboard
      </div>
    </div>
  );
};

export default Admin;
