const SHOP_INFO_URL = 'http://localhost:8080/api/v1/shops';
const SHOP_PRODUCT_URL = 'http://localhost:8080/api/v1/products/belong-to-shop';

const urlParams = new URLSearchParams(window.location.search);
const shopId = urlParams.get('id');
const user = JSON.parse(localStorage.getItem('user'));


document.getElementById("editInfoBtn").addEventListener("click", async () => {
    const shopName = document.getElementById("shopName").textContent;
    const shopDescription = document.getElementById("shopDescription").textContent;
    const shopAddress = document.getElementById("shopAddress").textContent;
    const shopPhone = document.getElementById("shopPhone").textContent;
    const shopRating = document.getElementById("shopRating").textContent;

    document.getElementById("editShopName").value = shopName;
    document.getElementById("editShopDescription").value = shopDescription;
    document.getElementById("editShopAddress").value = shopAddress;
    document.getElementById("editShopPhone").value = shopPhone;
    document.getElementById("editShopRating").value = shopRating;

    document.getElementById("editShopModal").style.display = "flex";
});

document.getElementById("editShopForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    document.getElementById("shopName").textContent = document.getElementById("editShopName").value;
    document.getElementById("shopDescription").textContent = document.getElementById("editShopDescription").value;
    document.getElementById("shopAddress").textContent = document.getElementById("editShopAddress").value;
    document.getElementById("shopPhone").textContent = document.getElementById("editShopPhone").value;
    document.getElementById("shopRating").textContent = document.getElementById("editShopRating").value;

    document.getElementById("editShopModal").style.display = "none";

    const imagesUrl = await upload_image();
    document.getElementById("shopAvatar").src = imagesUrl.avatarUrl;
    document.getElementById("shopBanner").src = imagesUrl.bannerUrl;
    const response = await fetch(SHOP_INFO_URL+"/"+shopId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('access-token')
        },
        body: JSON.stringify({
            "userId": user.id,
            "name": document.getElementById("editShopName").value,
            "description": document.getElementById("editShopDescription").value,
            "avatarUrl": imagesUrl.avatarUrl,
            "bannerUrl": imagesUrl.bannerUrl,
            "address": document.getElementById("editShopAddress").value,
            "phone": document.getElementById("editShopPhone").value,
            "rating": 0
        })
    });
    const data = response.json();
    alert(data.message);
});

document.getElementById("editShopCloseModalBtn").addEventListener("click", () => {
    document.getElementById("editShopModal").style.display = "none";
});

document.getElementById("deleteShopBtn").addEventListener("click", async () => {
    confirm("Bạn có chắc chắn muốn xóa cửa hàng này?");
    if (confirm == true) {
        const response = await fetch(SHOP_INFO_URL+"/"+shopId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('access-token')
            }
        });
        const data = await response.json();
        alert(data.message);
        window.location.href = "shop-manage.html";
    }
});

function renderShopInfo() {
    document.getElementById("shopBanner").src = shop.bannerUrl;
    document.getElementById("shopAvatar").src = shop.avatarUrl;
    document.getElementById("shopName").textContent = shop.name;
    document.getElementById("shopDescription").textContent = shop.description;
    document.getElementById("shopAddress").textContent = shop.address;
    document.getElementById("shopPhone").textContent = shop.phone;
    document.getElementById("shopRating").textContent = shop.rating;
}

async function fetch_shop_info() {
    const response = await fetch(SHOP_INFO_URL+"/"+shopId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem('access-token')
        }
    });
    const data = await response.json();
    console.log(data);
    if(data.error) {
        alert(data.message);
    } else {
        shop = data.data;
    }
}

async function upload_image() {
    const fileAva = document.getElementById("avatarFileInput").files[0];
    const fileBanner = document.getElementById("bannerFileInput").files[0];
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');

    const supabaseUrl = "https://gcdzatdsbirirrtxktlj.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZHphdGRzYmlyaXJydHhrdGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4ODg1NjksImV4cCI6MjA1MzQ2NDU2OX0._jkPv02rqaNiY7eELU2hm59U1uOZJJqLDx-VvHX0SdM";

    const supabase = createClient(supabaseUrl, supabaseKey);

    const fileAvaPath = `user_${user.id}/${fileAva.name}`; // Đường dẫn lưu trữ trong bucket
    const fileBannerPath = `user_${user.id}/${fileBanner.name}`; // Đường dẫn lưu trữ trong bucket

    await supabase.storage
        .from('vieshop') // Thay bằng tên bucket của bạn
        .upload(fileAvaPath, fileAva, {
            cacheControl: '3600',
            upsert: false
    });
    await supabase.storage
        .from('vieshop')
        .upload(fileBannerPath, fileBanner, {
            cacheControl: '3600',
            upsert: false
    }); 
    const response = {
        avatarUrl: supabase.storage.from(`vieshop/user_${user.id}`).getPublicUrl(fileAva.name).data.publicUrl, 
        bannerUrl: supabase.storage.from(`vieshop/user_${user.id}`).getPublicUrl(fileBanner.name).data.publicUrl
    }
    console.log(response);
    return response;
}


window.onload = async () => {
    await fetch_shop_info();
    renderShopInfo();
    await fetch_products();
    renderProducts();
    await fetch_shop_category();
    render_shop_category();
}   
