class ApiFeature{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }
    search(){
        const keyword=this.queryStr.keyword?{
           title:{
            $regex :this.queryStr.keyword,
           $options:"i"
           },
        }:{};
 console.log("your keyword is",keyword)
//  console.log("your query is",)
       this.query=this.query.find({...keyword});
       return this;
    }


    filter(){
        const queryCopy={...this.queryStr} // we are accessing the queryStr and all the thing 
                                           //we get in js are passed by reference so we dont want to manipulate the queryStr to we are using spread operator
console.log("your queryCopy",queryCopy)
        const removeFields=["keyword","page","limit"] ;// we will remove all the queryStr feilds which are not useful for filter operation
        
       removeFields.forEach(key=>delete queryCopy[key]);

       //Filter For price and Rating

       let queryStr=JSON.stringify(queryCopy);
       queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);

       console.log("your queryCopy",queryCopy)

       this.query=this.query.find(JSON.parse(queryStr)); 
       return this;
    }


    pagination(resultPerPage){
const currentpage=Number(this.queryStr.page) || 1;
const skip=resultPerPage*(currentpage-1);
this.query=this.query.limit(resultPerPage).skip(skip);

return this;


    }
}
module.exports=ApiFeature;