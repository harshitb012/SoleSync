class FeaturesApi {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // Searching Feature
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword.trim(),
                $options: "i", // Case insensitive
            }
        } : null;

        if (keyword) {
            this.query = this.query.find(keyword);
        }   
        // console.log("Search Query:", keyword);

        return this;
    }
    
    // filter() {
    //     const queryCopy = { ...this.queryStr };
    //     const removeFields = ["keyword", "page", "limit"];
    //     removeFields.forEach(key => delete queryCopy[key]);
    
    //     let queryStr = JSON.stringify(queryCopy);
    //     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
    
    //     this.query = this.query.find(JSON.parse(queryStr));
    //     return this;
    // }

     
  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach(key => delete queryCopy[key]);
  
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);
  
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }


    // Results per page
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        // Results per page shown, e.g., if 50 products, only 10 will show on a single page
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = FeaturesApi;
