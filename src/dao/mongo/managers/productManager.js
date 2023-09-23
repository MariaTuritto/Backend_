import productModel from "../models/product.model.js";

export default class productsManager {
  getProductsV = async (limit, page, query = {}, sort) => {
    const sortOption = {};

    if (sort === "asc") {
      sortOption.price = 1;
    } else if (sort === "desc") {
      sortOption.price = -1;
    }

    const filterProducts = await productModel
      .find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalDoc = await productModel.countDocuments(query);
    const totalPages = Math.ceil(totalDoc / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      filterProducts,
      page,
      limit,
      hasPrevPage,
      hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      totalPages,
    };
  };

  getProductsP = async (limit, page, query = {}, sort) => {
    const Options = {
      page: page,
      limit: limit,
      sort:
        sort === "asc" ? { price: 1 } : sort === "des" ? { price: -1 } : null,
    };

    const paginationResult = await productModel.paginate(query, Options);

    return {
      filterProducts: paginationResult.docs,
      page: paginationResult.page,
      limit: paginationResult.limit,
      hasPrevPage: paginationResult.hasPrevPage,
      hasNextPage: paginationResult.hasNextPage,
      prevPage: paginationResult.hasPrevPage ? paginationResult.prevPage : null,
      nextPage: paginationResult.hasNextPage ? paginationResult.nextPage : null,
      totalPages: paginationResult.totalPages,
    };
  };

  getProductsBy = (pid) => {
    return productModel.findOne({ _id: pid }).lean();
  };

  addProducts = (product) => {
    return productModel.create(product);
  };

  updateProduct = (id, product) => {
    return productModel.updateOne({ _id: id }, { $set: product });
  };

  deleteProduct = (id) => {
    return productModel.deleteOne({ _id: id });
  };
}
