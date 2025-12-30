export function useCreatePayment() {
  // const {} = useMutation({
  //   mutationFn: (data: CreatePaymentSchema) => {
  //     return httpClient.post("/payments", data);
  //   },
  // });

  return {
    createPayment: () => {
      console.log("createPayment");
    },
  };
}
