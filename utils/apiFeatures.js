class apiFeatures
{
    constructor(query,querystring){
        this.query=query;
        this.querystring=querystring;
    }
    filter()
    {
        const queryObj={...this.querystring};
        const excludedFields=['page','sort','limit','fields'];
        excludedFields.forEach(el=>delete queryObj[el]);
        let finalquerystring=JSON.stringify(queryObj);
        /// there can be other relational operators too 
        /// like:- {price:{gte: 5}};
        // but:- mongodb query will accept in form of 
        // {price :{$gte:5}}
        finalquerystring=finalquerystring.replace(/\b(gte|gt|lte|lt)\b/g,match=> `$${match}`);


       this.query= this.query.find(JSON.parse(finalquerystring));
        return this;
    }
    sort()
    {
        if(this.querystring.sort)
        {
            const sortby=this.querystring.sort.split(',').join(' ');
            this.query= this.query.sort(sortby);
           
        }
        return this; 
    }
    fields()
    {
        if(this.querystring.fields)
        {
            const excludedFields=this.querystring.fields.split(',').join(' ');
            this.query=this.query.select(excludedFields);
            
        }
        return this;
    }
    pagination()
    {
        if(this.querystring.page)
        {
        const page=this.querystring.page;
        const limit=this.querystring.limit;
        const skip=(page-1)*limit;
        this.query=this.query.skip(skip).limit(limit);
        }
        return this;
    }
}
module.exports=apiFeatures;