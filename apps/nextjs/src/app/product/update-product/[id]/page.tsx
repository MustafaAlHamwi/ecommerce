import { serverSideCallerProtected } from "@acme/api";

// import { FinanceAccountForm } from "~/components/forms/finance-form/FinanceAccountForm";

interface Props {
  params: { productId: string };
}

const UpdateProduct = async ({ params }: Props) => {
  const caller = await serverSideCallerProtected();
  const accountDetails = await caller?.product.getProductById({
    id: params.productId,
  });

  return <div></div>;
};

export default UpdateProduct;
