import axios from "axios";

export const baseUrl="https://bayut.p.rapidapi.com";

export const fetchApi =async(url) =>{
    const {data}=await axios.get((url),{
        headers:{
            'x-rapidapi-host': 'bayut.p.rapidapi.com',
            'x-rapidapi-key': '330f532505mshff9c1465fef4e5fp151a07jsn463252320748'
        }
     
    })

    return data;
}
