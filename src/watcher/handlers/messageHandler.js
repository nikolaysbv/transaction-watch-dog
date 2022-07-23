export default (models) => {
  return async (data) => {
    const transactionData = JSON.parse(data.toString());
    console.log(transactionData);

    if (!transactionData.id) {
      const transactionNumber = transactionData.params?.result.number;
      await models.Transactions.create({
        transactionNumber: transactionNumber,
      });
    }
  };
};
