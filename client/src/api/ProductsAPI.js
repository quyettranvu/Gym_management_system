import React,{useState,useEffect} from 'react';
import axios from 'axios';

export default function ProductsAPI() {
    const [products,setProducts]=useState([]);
    const [callback,setCallback]=useState(false);
    const [category,setCategory]=useState('');
    const [sort,setSort]=useState('');
    const [search,setSearch]=useState('');
    const [page,setPage]=useState(1);
    const [result,setResult]=useState(0);

    //get product from backend
    const getProducts=async ()=>{
      //lưu ý ở phần search là mình search theo title của product nhé
        const res=await axios.get(`/api/products?limit=${page*9}&${category}&${sort}&title[regex]=${search}`); //từ phía backend
        setProducts(res.data.products);
        setResult(res.data.result);
        //console.log(res);
    }

    useEffect(()=>{
        getProducts()
    },[callback,category,sort,search,page])

  return {
    products:[products,setProducts],
    callback:[callback,setCallback],
    category:[category,setCategory],
    sort:[sort,setSort],
    search:[search,setSearch],
    page:[page,setPage],
    result:[result,setResult]
  }
}
