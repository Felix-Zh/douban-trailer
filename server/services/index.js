class Service {
  /**
   * 分页
   * @param {*} model 
   * @param {*} query 
   * @param {*} pageNo 
   * @param {*} pageSize 
   */
  async paginate(model, query, pageNo = 1, pageSize = 20) {
    pageNo = Number.parseInt(pageNo);
    pageSize = Number.parseInt(pageSize);

    const [data, total] = await Promise.all([
      model.find(query).skip((pageNo - 1) * pageSize).limit(pageSize),
      model.count(query),
    ]);
    const pagination = { pageNo, pageSize, total };

    return { data, pagination };
  }
}

export default Service;
