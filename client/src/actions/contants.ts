export const REAVALIDAION_TIME = {
    COUNT:{
            TIME:500,
            TAGS:["counts"]
    },
    USER:{
            TIME:500,
            TAGS:(id:string)=>["user-"+id]
    }
}