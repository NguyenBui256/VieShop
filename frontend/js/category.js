import { getCookie } from "./auth.js";

const CATEGORY_URL = "http://localhost:8080/api/v1/category";

const categoryGrid = document.getElementById("productCategory");

var categoryList;

export async function fetch_shop_category(shopId) {
    const response = await fetch(CATEGORY_URL+"/belong-to-shop/"+shopId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getCookie('access-token')
        }
    });
    const data = await response.json();
    console.log(data);
    categoryList = data.data;    
}

export function render_shop_category() {
    let html = ``;
    for(let category of categoryList){
        html += `<option value =${category.id}>${category.name}</option>`
    }
    categoryGrid.innerHTML = html;
}